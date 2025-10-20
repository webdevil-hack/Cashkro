import { AppDataSource } from '../config/database';
import { Cashback, CashbackStatus } from '../models/Cashback';
import { User } from '../models/User';
import { Store } from '../models/Store';
import { Click } from '../models/Click';
import { EmailService } from './EmailService';
import { RedisService } from './RedisService';
import { v4 as uuidv4 } from 'uuid';

export class CashbackService {
  private cashbackRepository = AppDataSource.getRepository(Cashback);
  private userRepository = AppDataSource.getRepository(User);
  private storeRepository = AppDataSource.getRepository(Store);
  private clickRepository = AppDataSource.getRepository(Click);
  private emailService = new EmailService();
  private redisService = RedisService.getInstance();

  async createClickTracking(
    userId: string,
    storeId: string,
    offerId?: string
  ): Promise<{ clickId: string; redirectUrl: string }> {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });

    if (!store) {
      throw new Error('Store not found');
    }

    const clickId = uuidv4();
    const subId = `${userId}_${Date.now()}`;

    // Create click record
    const click = this.clickRepository.create({
      clickId,
      userId,
      storeId,
      offerId,
      redirectUrl: store.affiliateUrl,
      subId,
      metadata: {
        userAgent: '', // Will be filled by controller
        ipAddress: '', // Will be filled by controller
        referrer: '',
        device: '',
        browser: '',
        os: '',
        country: '',
        city: '',
      },
    });

    await this.clickRepository.save(click);

    // Store click data in Redis for quick lookup
    await this.redisService.trackClick(clickId, {
      userId,
      storeId,
      offerId,
      subId,
      timestamp: Date.now(),
    });

    // Update store click count
    await this.storeRepository.increment({ id: storeId }, 'totalClicks', 1);

    // Build redirect URL with tracking parameters
    const redirectUrl = this.buildAffiliateUrl(store, clickId, subId);

    return { clickId, redirectUrl };
  }

  async trackPurchase(data: {
    clickId?: string;
    userId: string;
    storeId: string;
    orderId: string;
    purchaseAmount: number;
    orderDetails?: any;
  }): Promise<Cashback> {
    const user = await this.userRepository.findOne({
      where: { id: data.userId },
    });

    const store = await this.storeRepository.findOne({
      where: { id: data.storeId },
    });

    if (!user || !store) {
      throw new Error('User or store not found');
    }

    // Calculate cashback amount
    const cashbackRate = store.cashbackRate;
    const cashbackAmount = (data.purchaseAmount * cashbackRate) / 100;

    // Create cashback record
    const cashback = this.cashbackRepository.create({
      transactionId: uuidv4(),
      userId: data.userId,
      storeId: data.storeId,
      clickId: data.clickId,
      orderId: data.orderId,
      purchaseAmount: data.purchaseAmount,
      cashbackRate,
      cashbackAmount,
      status: CashbackStatus.TRACKED,
      orderDetails: data.orderDetails,
      expectedConfirmDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
      metadata: {
        userAgent: '',
        ipAddress: '',
        referrer: '',
        affiliateData: {},
      },
    });

    await this.cashbackRepository.save(cashback);

    // Update user's pending cashback
    user.pendingCashback += cashbackAmount;
    await this.userRepository.save(user);

    // Update store metrics
    await this.storeRepository.increment({ id: data.storeId }, 'totalOrders', 1);
    await this.storeRepository.increment(
      { id: data.storeId },
      'totalRevenue',
      cashbackAmount
    );

    // Mark click as converted if applicable
    if (data.clickId) {
      await this.clickRepository.update(
        { clickId: data.clickId },
        { converted: true, conversionTime: new Date() }
      );
    }

    // Send email notification
    await this.emailService.sendCashbackTrackedEmail(
      user,
      store.name,
      cashbackAmount
    );

    return cashback;
  }

  async confirmCashback(cashbackId: string): Promise<Cashback> {
    const cashback = await this.cashbackRepository.findOne({
      where: { id: cashbackId },
      relations: ['user', 'store'],
    });

    if (!cashback) {
      throw new Error('Cashback not found');
    }

    if (cashback.status !== CashbackStatus.TRACKED) {
      throw new Error('Cashback cannot be confirmed in current status');
    }

    // Update cashback status
    cashback.status = CashbackStatus.CONFIRMED;
    cashback.confirmedAt = new Date();
    await this.cashbackRepository.save(cashback);

    // Update user balances
    const user = cashback.user;
    user.pendingCashback -= cashback.cashbackAmount;
    user.availableCashback += cashback.cashbackAmount;
    user.walletBalance += cashback.cashbackAmount;
    user.totalEarnings += cashback.cashbackAmount;
    await this.userRepository.save(user);

    // Send confirmation email
    await this.emailService.sendCashbackConfirmedEmail(
      user,
      cashback.store.name,
      cashback.cashbackAmount
    );

    // Handle referral bonus if this is user's first confirmed cashback
    await this.handleReferralBonus(user.id);

    return cashback;
  }

  async cancelCashback(
    cashbackId: string,
    reason: string
  ): Promise<Cashback> {
    const cashback = await this.cashbackRepository.findOne({
      where: { id: cashbackId },
      relations: ['user'],
    });

    if (!cashback) {
      throw new Error('Cashback not found');
    }

    if (
      cashback.status === CashbackStatus.CONFIRMED ||
      cashback.status === CashbackStatus.PAID
    ) {
      throw new Error('Cannot cancel confirmed or paid cashback');
    }

    // Update cashback status
    cashback.status = CashbackStatus.CANCELLED;
    cashback.cancellationReason = reason;
    await this.cashbackRepository.save(cashback);

    // Update user's pending cashback if it was tracked
    if (cashback.status === CashbackStatus.TRACKED) {
      const user = cashback.user;
      user.pendingCashback -= cashback.cashbackAmount;
      await this.userRepository.save(user);
    }

    return cashback;
  }

  async getUserCashbacks(
    userId: string,
    status?: CashbackStatus,
    limit = 20,
    offset = 0
  ): Promise<{ cashbacks: Cashback[]; total: number }> {
    const query = this.cashbackRepository
      .createQueryBuilder('cashback')
      .leftJoinAndSelect('cashback.store', 'store')
      .where('cashback.userId = :userId', { userId });

    if (status) {
      query.andWhere('cashback.status = :status', { status });
    }

    const [cashbacks, total] = await query
      .orderBy('cashback.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { cashbacks, total };
  }

  async getCashbackSummary(userId: string): Promise<{
    pending: number;
    confirmed: number;
    available: number;
    totalEarnings: number;
    transactions: {
      pending: number;
      confirmed: number;
      cancelled: number;
    };
  }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const transactions = await this.cashbackRepository
      .createQueryBuilder('cashback')
      .select('cashback.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('cashback.userId = :userId', { userId })
      .groupBy('cashback.status')
      .getRawMany();

    const transactionCounts = {
      pending: 0,
      confirmed: 0,
      cancelled: 0,
    };

    transactions.forEach((t) => {
      if (t.status === CashbackStatus.TRACKED) {
        transactionCounts.pending = parseInt(t.count);
      } else if (t.status === CashbackStatus.CONFIRMED) {
        transactionCounts.confirmed = parseInt(t.count);
      } else if (t.status === CashbackStatus.CANCELLED) {
        transactionCounts.cancelled = parseInt(t.count);
      }
    });

    return {
      pending: user.pendingCashback,
      confirmed: user.availableCashback,
      available: user.walletBalance,
      totalEarnings: user.totalEarnings,
      transactions: transactionCounts,
    };
  }

  private buildAffiliateUrl(
    store: Store,
    clickId: string,
    subId: string
  ): string {
    let url = store.trackingUrl || store.affiliateUrl;

    // Add tracking parameters based on affiliate network
    if (store.metadata?.affiliateNetwork) {
      switch (store.metadata.affiliateNetwork) {
        case 'amazon':
          url += `?tag=${process.env.AMAZON_AFFILIATE_ID}&ascsubtag=${subId}`;
          break;
        case 'flipkart':
          url += `?affid=${process.env.FLIPKART_AFFILIATE_ID}&affExtParam1=${subId}`;
          break;
        default:
          // Generic tracking parameter
          url += url.includes('?') ? '&' : '?';
          url += `clickId=${clickId}&subId=${subId}`;
      }
    }

    return url;
  }

  private async handleReferralBonus(userId: string): Promise<void> {
    // Check if this is user's first confirmed cashback
    const confirmedCount = await this.cashbackRepository.count({
      where: {
        userId,
        status: CashbackStatus.CONFIRMED,
      },
    });

    if (confirmedCount === 1) {
      // Process referral bonus logic
      // Implementation depends on Referral model and business logic
    }
  }

  // Webhook handlers for affiliate networks
  async handleAffiliateWebhook(
    network: string,
    data: any
  ): Promise<void> {
    switch (network) {
      case 'amazon':
        await this.processAmazonWebhook(data);
        break;
      case 'flipkart':
        await this.processFlipkartWebhook(data);
        break;
      // Add more affiliate networks as needed
    }
  }

  private async processAmazonWebhook(data: any): Promise<void> {
    // Process Amazon affiliate webhook
    // Map their data structure to our cashback tracking
  }

  private async processFlipkartWebhook(data: any): Promise<void> {
    // Process Flipkart affiliate webhook
    // Map their data structure to our cashback tracking
  }
}