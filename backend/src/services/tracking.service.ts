// path: backend/src/services/tracking.service.ts
import crypto from 'crypto';
import { Click, IClick } from '../models/click.model';
import { Store } from '../models/store.model';
import { Coupon } from '../models/coupon.model';
import { Transaction } from '../models/transaction.model';
import { User } from '../models/user.model';
import AffiliateService from './affiliate.service';
import redisClient from '../utils/redis.client';
import logger from '../utils/logger';

export interface ClickData {
  userId?: string;
  sessionId: string;
  storeId: string;
  couponId?: string;
  redirectToAffiliateUrl: string;
  meta?: {
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    deviceType?: 'mobile' | 'desktop' | 'tablet';
    browser?: string;
    os?: string;
  };
}

export interface ConversionData {
  orderId: string;
  amount: number;
  clickToken: string;
  conversionDate?: Date;
  productName?: string;
  trackingId?: string;
}

export class TrackingService {
  private affiliateService: AffiliateService;

  constructor() {
    this.affiliateService = new AffiliateService();
  }

  /**
   * Create a click tracking record
   */
  async createClick(clickData: ClickData): Promise<{ clickToken: string; redirectUrl: string }> {
    try {
      // Validate store exists and is active
      const store = await Store.findById(clickData.storeId);
      if (!store || !store.active) {
        throw new Error('Store not found or inactive');
      }

      // Validate coupon if provided
      if (clickData.couponId) {
        const coupon = await Coupon.findById(clickData.couponId);
        if (!coupon || !coupon.isActive || coupon.isExpired) {
          throw new Error('Coupon not found or inactive');
        }
      }

      // Generate unique click token
      const clickToken = this.generateClickToken();

      // Get the best affiliate link for the store
      const affiliateLink = this.getBestAffiliateLink(store);
      if (!affiliateLink) {
        throw new Error('No active affiliate link found for this store');
      }

      // Generate affiliate redirect URL
      const redirectUrl = await this.affiliateService.generateAffiliateLink(
        store,
        affiliateLink.network,
        clickData.couponId ? (await Coupon.findById(clickData.couponId))?.code : undefined,
        clickData.userId
      );

      // Create click record
      const click = new Click({
        userId: clickData.userId,
        sessionId: clickData.sessionId,
        storeId: clickData.storeId,
        couponId: clickData.couponId,
        affiliateNetwork: affiliateLink.network,
        clickToken,
        redirectUrl,
        meta: clickData.meta || {}
      });

      await click.save();

      // Cache click data in Redis for quick lookup
      await redisClient.set(
        `click:${clickToken}`,
        JSON.stringify({
          clickId: click._id.toString(),
          storeId: clickData.storeId,
          userId: clickData.userId,
          sessionId: clickData.sessionId
        }),
        { EX: 2592000 } // 30 days
      );

      // Update store stats
      await this.updateStoreStats(clickData.storeId, 'click');

      logger.info(`Click created: ${clickToken} for store ${store.name}`);
      
      return {
        clickToken,
        redirectUrl: `${process.env.FRONTEND_URL}/r/${clickToken}`
      };
    } catch (error) {
      logger.error('Error creating click:', error);
      throw error;
    }
  }

  /**
   * Process click redirect
   */
  async processClickRedirect(clickToken: string): Promise<string> {
    try {
      // Try to get from Redis first
      let clickData = await redisClient.get(`click:${clickToken}`);
      let click: IClick | null = null;

      if (clickData) {
        const parsed = JSON.parse(clickData);
        click = await Click.findById(parsed.clickId);
      } else {
        // Fallback to database
        click = await Click.findByToken(clickToken);
      }

      if (!click) {
        throw new Error('Click not found or expired');
      }

      if (click.isExpired) {
        click.status = 'expired';
        await click.save();
        throw new Error('Click has expired');
      }

      // Update click status if needed
      if (click.status === 'pending') {
        // Click is being processed
        logger.info(`Processing click redirect: ${clickToken}`);
      }

      return click.redirectUrl;
    } catch (error) {
      logger.error('Error processing click redirect:', error);
      throw error;
    }
  }

  /**
   * Process conversion from affiliate network
   */
  async processConversion(conversionData: ConversionData): Promise<Transaction | null> {
    try {
      // Find the click record
      const click = await Click.findOne({ clickToken: conversionData.clickToken });
      if (!click) {
        logger.error(`Click not found for token: ${conversionData.clickToken}`);
        return null;
      }

      // Check if conversion already exists
      const existingTransaction = await Transaction.findOne({ 
        orderId: conversionData.orderId,
        clickId: click._id
      });

      if (existingTransaction) {
        logger.warn(`Conversion already exists for order: ${conversionData.orderId}`);
        return existingTransaction;
      }

      // Get store details
      const store = await Store.findById(click.storeId);
      if (!store) {
        logger.error(`Store not found for click: ${click._id}`);
        return null;
      }

      // Calculate cashback amount
      const cashbackAmount = this.calculateCashbackAmount(
        conversionData.amount,
        store.currentCashbackPercent,
        store.cashbackType,
        store.maxCashback
      );

      // Calculate commission earned
      const commissionEarned = this.calculateCommission(
        conversionData.amount,
        store.currentCashbackPercent
      );

      // Create transaction record
      const transaction = new Transaction({
        userId: click.userId!,
        clickId: click._id,
        storeId: click.storeId,
        orderId: conversionData.orderId,
        amount: conversionData.amount,
        cashbackAmount,
        status: 'pending',
        affiliateNetwork: click.affiliateNetwork,
        commissionRate: store.currentCashbackPercent,
        commissionEarned,
        metadata: {
          productName: conversionData.productName,
          orderDate: conversionData.conversionDate || new Date(),
          trackingId: conversionData.trackingId,
          affiliateData: {
            clickToken: conversionData.clickToken,
            sessionId: click.sessionId
          }
        }
      });

      await transaction.save();

      // Update click status
      click.status = 'converted';
      click.conversionValue = conversionData.amount;
      click.commissionEarned = commissionEarned;
      click.orderId = conversionData.orderId;
      click.convertedAt = new Date();
      await click.save();

      // Update user wallet (pending amount)
      if (click.userId) {
        await this.updateUserWallet(click.userId, cashbackAmount, 'pending');
      }

      // Update store stats
      await this.updateStoreStats(click.storeId, 'conversion', conversionData.amount);

      // Process referral rewards if applicable
      await this.processReferralRewards(click.userId!, conversionData.amount);

      logger.info(`Conversion processed: ${conversionData.orderId} for user ${click.userId}`);
      
      return transaction;
    } catch (error) {
      logger.error('Error processing conversion:', error);
      throw error;
    }
  }

  /**
   * Process webhook from affiliate network
   */
  async processWebhook(network: string, payload: any, signature: string): Promise<Transaction | null> {
    try {
      // Validate webhook signature
      if (!this.affiliateService.validateWebhook(network, payload, signature)) {
        logger.error(`Invalid webhook signature for network: ${network}`);
        return null;
      }

      // Process webhook payload
      const conversion = this.affiliateService.processWebhook(network, payload);
      if (!conversion) {
        logger.warn(`No conversion data found in webhook for network: ${network}`);
        return null;
      }

      // Find click by order ID or other tracking data
      const click = await Click.findOne({
        orderId: conversion.orderId,
        affiliateNetwork: network
      });

      if (!click) {
        logger.error(`Click not found for order: ${conversion.orderId}`);
        return null;
      }

      // Process the conversion
      return await this.processConversion({
        orderId: conversion.orderId,
        amount: conversion.amount,
        clickToken: click.clickToken,
        conversionDate: conversion.conversionDate,
        productName: conversion.productName,
        trackingId: conversion.trackingId
      });
    } catch (error) {
      logger.error('Error processing webhook:', error);
      throw error;
    }
  }

  /**
   * Get click statistics
   */
  async getClickStats(storeId?: string, userId?: string, dateRange?: { start: Date; end: Date }) {
    try {
      const match: any = {};
      
      if (storeId) match.storeId = storeId;
      if (userId) match.userId = userId;
      if (dateRange) {
        match.createdAt = {
          $gte: dateRange.start,
          $lte: dateRange.end
        };
      }

      const stats = await Click.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalClicks: { $sum: 1 },
            convertedClicks: {
              $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] }
            },
            totalConversionValue: {
              $sum: { $cond: [{ $eq: ['$status', 'converted'] }, '$conversionValue', 0] }
            },
            totalCommission: {
              $sum: { $cond: [{ $eq: ['$status', 'converted'] }, '$commissionEarned', 0] }
            }
          }
        }
      ]);

      return stats[0] || {
        totalClicks: 0,
        convertedClicks: 0,
        totalConversionValue: 0,
        totalCommission: 0
      };
    } catch (error) {
      logger.error('Error getting click stats:', error);
      throw error;
    }
  }

  /**
   * Generate unique click token
   */
  private generateClickToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Get the best affiliate link for a store
   */
  private getBestAffiliateLink(store: IStore) {
    // Priority order: active links with highest commission rate
    const activeLinks = store.affiliateLinks.filter(link => link.isActive);
    if (activeLinks.length === 0) return null;

    return activeLinks.reduce((best, current) => {
      if (!best) return current;
      if (current.commissionRate && best.commissionRate) {
        return current.commissionRate > best.commissionRate ? current : best;
      }
      return current;
    });
  }

  /**
   * Calculate cashback amount
   */
  private calculateCashbackAmount(
    orderAmount: number,
    cashbackPercent: number,
    cashbackType: 'percent' | 'fixed',
    maxCashback?: number
  ): number {
    let cashback = 0;

    if (cashbackType === 'percent') {
      cashback = (orderAmount * cashbackPercent) / 100;
    } else {
      cashback = cashbackPercent;
    }

    if (maxCashback && cashback > maxCashback) {
      cashback = maxCashback;
    }

    return Math.round(cashback * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Calculate commission earned
   */
  private calculateCommission(orderAmount: number, commissionRate: number): number {
    return Math.round((orderAmount * commissionRate / 100) * 100) / 100;
  }

  /**
   * Update user wallet
   */
  private async updateUserWallet(userId: string, amount: number, type: 'available' | 'pending'): Promise<void> {
    try {
      const updateField = type === 'available' ? 'wallet.available' : 'wallet.pending';
      await User.findByIdAndUpdate(
        userId,
        { $inc: { [updateField]: amount } },
        { new: true }
      );
    } catch (error) {
      logger.error('Error updating user wallet:', error);
      throw error;
    }
  }

  /**
   * Update store statistics
   */
  private async updateStoreStats(storeId: string, type: 'click' | 'conversion', amount?: number): Promise<void> {
    try {
      const updateData: any = {
        'stats.clicks': 1,
        'stats.lastUpdated': new Date()
      };

      if (type === 'conversion' && amount) {
        updateData['stats.conversions'] = 1;
        updateData['stats.totalCashback'] = amount;
      }

      await Store.findByIdAndUpdate(storeId, { $inc: updateData });
    } catch (error) {
      logger.error('Error updating store stats:', error);
      throw error;
    }
  }

  /**
   * Process referral rewards
   */
  private async processReferralRewards(userId: string, orderAmount: number): Promise<void> {
    try {
      // Find if user was referred by someone
      const user = await User.findById(userId);
      if (!user || !user.referredBy) return;

      // Check if this is user's first purchase
      const existingTransactions = await Transaction.countDocuments({
        userId: userId,
        status: 'approved'
      });

      if (existingTransactions === 0) {
        // This is the first purchase, reward the referrer
        const Referral = require('../models/referral.model').Referral;
        
        const referral = new Referral({
          referrerId: user.referredBy,
          referredId: userId,
          rewardAmount: 50, // Configurable reward amount
          rewardType: 'first_purchase',
          status: 'pending'
        });

        await referral.save();
        logger.info(`Referral reward created for referrer ${user.referredBy}`);
      }
    } catch (error) {
      logger.error('Error processing referral rewards:', error);
      // Don't throw error as this shouldn't break the conversion flow
    }
  }
}

export default TrackingService;