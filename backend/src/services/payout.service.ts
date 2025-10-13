// path: backend/src/services/payout.service.ts
import Razorpay from 'razorpay';
import Stripe from 'stripe';
import { User } from '../models/user.model';
import { Transaction } from '../models/transaction.model';
import logger from '../utils/logger';

export interface PayoutRequest {
  userId: string;
  amount: number;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  method: 'razorpay' | 'stripe';
}

export interface PayoutResponse {
  success: boolean;
  payoutId?: string;
  error?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface BankAccount {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankName?: string;
  branchName?: string;
}

export class PayoutService {
  private razorpay: Razorpay | null = null;
  private stripe: Stripe | null = null;

  constructor() {
    this.initializePaymentGateways();
  }

  private initializePaymentGateways(): void {
    // Initialize Razorpay
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });
    }

    // Initialize Stripe
    if (process.env.STRIPE_SECRET_KEY) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16'
      });
    }
  }

  /**
   * Process payout request
   */
  async processPayout(payoutRequest: PayoutRequest): Promise<PayoutResponse> {
    try {
      // Validate user and amount
      const user = await User.findById(payoutRequest.userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Check if user has sufficient balance
      if (user.wallet.available < payoutRequest.amount) {
        return {
          success: false,
          error: 'Insufficient balance'
        };
      }

      // Validate minimum payout amount
      if (payoutRequest.amount < 100) {
        return {
          success: false,
          error: 'Minimum payout amount is ₹100'
        };
      }

      // Validate maximum payout amount
      if (payoutRequest.amount > 50000) {
        return {
          success: false,
          error: 'Maximum payout amount is ₹50,000'
        };
      }

      // Process payout based on method
      let payoutResponse: PayoutResponse;

      if (payoutRequest.method === 'razorpay' && this.razorpay) {
        payoutResponse = await this.processRazorpayPayout(payoutRequest);
      } else if (payoutRequest.method === 'stripe' && this.stripe) {
        payoutResponse = await this.processStripePayout(payoutRequest);
      } else {
        return {
          success: false,
          error: 'Payment method not available'
        };
      }

      if (payoutResponse.success) {
        // Deduct amount from user's wallet
        await this.deductFromWallet(payoutRequest.userId, payoutRequest.amount);
        
        // Log the payout transaction
        await this.logPayoutTransaction(payoutRequest, payoutResponse.payoutId!);
      }

      return payoutResponse;
    } catch (error) {
      logger.error('Error processing payout:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  /**
   * Process Razorpay payout
   */
  private async processRazorpayPayout(payoutRequest: PayoutRequest): Promise<PayoutResponse> {
    try {
      if (!this.razorpay) {
        throw new Error('Razorpay not initialized');
      }

      // Create Razorpay contact
      const contact = await this.razorpay.contacts.create({
        name: payoutRequest.bankDetails.accountHolderName,
        type: 'customer',
        reference_id: `user_${payoutRequest.userId}`,
        notes: {
          user_id: payoutRequest.userId
        }
      });

      // Create Razorpay fund account
      const fundAccount = await this.razorpay.fundAccounts.create({
        contact_id: contact.id,
        account_type: 'bank_account',
        bank_account: {
          name: payoutRequest.bankDetails.accountHolderName,
          account_number: payoutRequest.bankDetails.accountNumber,
          ifsc: payoutRequest.bankDetails.ifscCode
        }
      });

      // Create payout
      const payout = await this.razorpay.payouts.create({
        account_number: process.env.RAZORPAY_ACCOUNT_NUMBER || '2323230000000000',
        fund_account_id: fundAccount.id,
        amount: payoutRequest.amount * 100, // Convert to paise
        currency: 'INR',
        mode: 'IMPS',
        purpose: 'payout',
        queue_if_low_balance: true,
        reference_id: `payout_${Date.now()}`,
        narration: 'Cashback payout'
      });

      logger.info(`Razorpay payout created: ${payout.id}`);

      return {
        success: true,
        payoutId: payout.id,
        status: payout.status as 'pending' | 'processing' | 'completed' | 'failed'
      };
    } catch (error) {
      logger.error('Error processing Razorpay payout:', error);
      return {
        success: false,
        error: 'Failed to process Razorpay payout'
      };
    }
  }

  /**
   * Process Stripe payout
   */
  private async processStripePayout(payoutRequest: PayoutRequest): Promise<PayoutResponse> {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not initialized');
      }

      // Create Stripe account for the user
      const account = await this.stripe.accounts.create({
        type: 'express',
        country: 'IN',
        email: payoutRequest.userId + '@cashkaro-clone.com',
        capabilities: {
          transfers: { requested: true }
        }
      });

      // Create account link for bank account setup
      const accountLink = await this.stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.FRONTEND_URL}/dashboard/payouts`,
        return_url: `${process.env.FRONTEND_URL}/dashboard/payouts`,
        type: 'account_onboarding'
      });

      // For now, return the account link for user to complete setup
      // In production, you'd want to handle this differently
      return {
        success: true,
        payoutId: account.id,
        status: 'pending'
      };
    } catch (error) {
      logger.error('Error processing Stripe payout:', error);
      return {
        success: false,
        error: 'Failed to process Stripe payout'
      };
    }
  }

  /**
   * Verify bank account details
   */
  async verifyBankAccount(bankDetails: BankAccount): Promise<{ valid: boolean; error?: string }> {
    try {
      // Basic validation
      if (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolderName) {
        return {
          valid: false,
          error: 'All bank details are required'
        };
      }

      // Validate account number format
      if (!/^\d{9,18}$/.test(bankDetails.accountNumber)) {
        return {
          valid: false,
          error: 'Account number must be 9-18 digits'
        };
      }

      // Validate IFSC code format
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankDetails.ifscCode)) {
        return {
          valid: false,
          error: 'Invalid IFSC code format'
        };
      }

      // In a real implementation, you would call a bank verification API
      // For now, we'll do basic format validation
      return {
        valid: true
      };
    } catch (error) {
      logger.error('Error verifying bank account:', error);
      return {
        valid: false,
        error: 'Failed to verify bank account'
      };
    }
  }

  /**
   * Get payout status
   */
  async getPayoutStatus(payoutId: string, method: 'razorpay' | 'stripe'): Promise<{ status: string; error?: string }> {
    try {
      if (method === 'razorpay' && this.razorpay) {
        const payout = await this.razorpay.payouts.fetch(payoutId);
        return {
          status: payout.status
        };
      } else if (method === 'stripe' && this.stripe) {
        const payout = await this.stripe.payouts.retrieve(payoutId);
        return {
          status: payout.status
        };
      } else {
        return {
          status: 'unknown',
          error: 'Payment method not available'
        };
      }
    } catch (error) {
      logger.error('Error getting payout status:', error);
      return {
        status: 'error',
        error: 'Failed to get payout status'
      };
    }
  }

  /**
   * Get user's payout history
   */
  async getPayoutHistory(userId: string, page: number = 1, limit: number = 20) {
    try {
      // This would typically be stored in a separate payouts collection
      // For now, we'll return a placeholder
      return {
        payouts: [],
        total: 0,
        page,
        limit
      };
    } catch (error) {
      logger.error('Error getting payout history:', error);
      throw error;
    }
  }

  /**
   * Deduct amount from user's wallet
   */
  private async deductFromWallet(userId: string, amount: number): Promise<void> {
    try {
      await User.findByIdAndUpdate(
        userId,
        { $inc: { 'wallet.available': -amount } },
        { new: true }
      );
    } catch (error) {
      logger.error('Error deducting from wallet:', error);
      throw error;
    }
  }

  /**
   * Log payout transaction
   */
  private async logPayoutTransaction(payoutRequest: PayoutRequest, payoutId: string): Promise<void> {
    try {
      // In a real implementation, you would create a Payout model and store this
      logger.info(`Payout logged: ${payoutId} for user ${payoutRequest.userId}, amount: ${payoutRequest.amount}`);
    } catch (error) {
      logger.error('Error logging payout transaction:', error);
      // Don't throw error as this shouldn't break the payout flow
    }
  }

  /**
   * Process webhook for payout status updates
   */
  async processPayoutWebhook(payload: any, signature: string, method: 'razorpay' | 'stripe'): Promise<void> {
    try {
      if (method === 'razorpay' && this.razorpay) {
        // Verify Razorpay webhook signature
        const crypto = require('crypto');
        const expectedSignature = crypto
          .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
          .update(JSON.stringify(payload))
          .digest('hex');

        if (signature !== expectedSignature) {
          logger.error('Invalid Razorpay webhook signature');
          return;
        }

        // Process Razorpay payout webhook
        if (payload.event === 'payout.processed') {
          const payout = payload.payload.payout.entity;
          await this.updatePayoutStatus(payout.id, payout.status);
        }
      } else if (method === 'stripe' && this.stripe) {
        // Verify Stripe webhook signature
        const event = this.stripe.webhooks.constructEvent(
          payload,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET || ''
        );

        // Process Stripe payout webhook
        if (event.type === 'payout.paid') {
          const payout = event.data.object;
          await this.updatePayoutStatus(payout.id, 'completed');
        } else if (event.type === 'payout.failed') {
          const payout = event.data.object;
          await this.updatePayoutStatus(payout.id, 'failed');
        }
      }
    } catch (error) {
      logger.error('Error processing payout webhook:', error);
      throw error;
    }
  }

  /**
   * Update payout status in database
   */
  private async updatePayoutStatus(payoutId: string, status: string): Promise<void> {
    try {
      // In a real implementation, you would update the payout record in database
      logger.info(`Payout status updated: ${payoutId} -> ${status}`);
    } catch (error) {
      logger.error('Error updating payout status:', error);
      throw error;
    }
  }
}

export default PayoutService;