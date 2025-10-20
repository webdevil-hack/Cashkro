import nodemailer from 'nodemailer';
import { User } from '../models/User';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify Your Email - CashKaro Clone',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to CashKaro Clone!</h2>
          <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Reset Your Password - CashKaro Clone',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #f44336; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">If you didn't request a password reset, please ignore this email.</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendWelcomeEmail(user: User): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Welcome to CashKaro Clone - Start Earning Cashback!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome ${user.firstName}!</h2>
          <p>Thank you for joining CashKaro Clone. You're now ready to start earning cashback on your online shopping!</p>
          
          <h3 style="color: #4CAF50;">How it works:</h3>
          <ol style="line-height: 1.8;">
            <li>Browse through our partner stores</li>
            <li>Click on any store to activate cashback</li>
            <li>Shop as usual on the retailer's website</li>
            <li>Your cashback will be tracked automatically</li>
            <li>Withdraw your earnings once confirmed</li>
          </ol>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Your Referral Code: <span style="color: #4CAF50;">${user.referralCode}</span></h4>
            <p>Share this code with friends and earn bonus cashback when they join and make their first purchase!</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/stores" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Start Shopping
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">Happy Shopping!</p>
          <p style="color: #666; font-size: 14px;">The CashKaro Clone Team</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendCashbackTrackedEmail(
    user: User,
    storeName: string,
    amount: number
  ): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Cashback Tracked! - CashKaro Clone',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Great News, ${user.firstName}!</h2>
          <p>Your cashback has been successfully tracked for your recent purchase.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Transaction Details</h3>
            <p><strong>Store:</strong> ${storeName}</p>
            <p><strong>Cashback Amount:</strong> ₹${amount.toFixed(2)}</p>
            <p><strong>Status:</strong> <span style="color: #ff9800;">Pending Confirmation</span></p>
          </div>
          
          <p>Your cashback will be confirmed by the merchant within 45-90 days. Once confirmed, you can withdraw it to your bank account.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/account/cashback" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Cashback Details
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">Keep shopping and earning!</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendCashbackConfirmedEmail(
    user: User,
    storeName: string,
    amount: number
  ): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Cashback Confirmed! - CashKaro Clone',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Congratulations, ${user.firstName}!</h2>
          <p>Your cashback has been confirmed and added to your wallet.</p>
          
          <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <h3 style="margin-top: 0; color: #2e7d32;">₹${amount.toFixed(2)}</h3>
            <p style="margin-bottom: 0; color: #666;">Cashback from ${storeName}</p>
          </div>
          
          <p><strong>Current Wallet Balance:</strong> ₹${user.walletBalance.toFixed(2)}</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/account/withdraw" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Withdraw Now
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">Minimum withdrawal amount is ₹250.</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendWithdrawalProcessedEmail(
    user: User,
    amount: number,
    method: string
  ): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Withdrawal Processed - CashKaro Clone',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Withdrawal Successful!</h2>
          <p>Hi ${user.firstName},</p>
          <p>Your withdrawal request has been processed successfully.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Withdrawal Details</h3>
            <p><strong>Amount:</strong> ₹${amount.toFixed(2)}</p>
            <p><strong>Method:</strong> ${method.replace('_', ' ').toUpperCase()}</p>
            <p><strong>Status:</strong> <span style="color: #4CAF50;">Completed</span></p>
          </div>
          
          <p>The amount will be credited to your account within 1-3 business days depending on your bank's processing time.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">Thank you for using CashKaro Clone!</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}