import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, AuthProvider } from '../models/User';
import { AppDataSource } from '../config/database';
import { EmailService } from './EmailService';
import { RedisService } from './RedisService';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);
  private emailService = new EmailService();
  private redisService = RedisService.getInstance();

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    referralCode?: string;
  }): Promise<{ user: User; tokens: AuthTokens }> {
    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user
    const user = this.userRepository.create({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      provider: AuthProvider.LOCAL,
      emailVerificationToken: crypto.randomBytes(32).toString('hex'),
      referredBy: data.referralCode,
    });

    await this.userRepository.save(user);

    // Send verification email
    await this.emailService.sendVerificationEmail(
      user.email,
      user.emailVerificationToken
    );

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Handle referral if applicable
    if (data.referralCode) {
      await this.handleReferral(user.id, data.referralCode);
    }

    return { user, tokens };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const user = await this.userRepository.findOne({
      where: { email, provider: AuthProvider.LOCAL },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new Error('Please verify your email before logging in');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    const tokens = this.generateTokens(user);

    return { user, tokens };
  }

  async socialLogin(profile: {
    provider: AuthProvider;
    providerId: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  }): Promise<{ user: User; tokens: AuthTokens }> {
    let user = await this.userRepository.findOne({
      where: [
        { email: profile.email },
        { providerId: profile.providerId, provider: profile.provider },
      ],
    });

    if (!user) {
      // Create new user
      user = this.userRepository.create({
        ...profile,
        emailVerified: true,
      });
      await this.userRepository.save(user);
    } else {
      // Update existing user
      user.lastLoginAt = new Date();
      if (profile.profileImage && !user.profileImage) {
        user.profileImage = profile.profileImage;
      }
      await this.userRepository.save(user);
    }

    const tokens = this.generateTokens(user);

    return { user, tokens };
  }

  async verifyEmail(token: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new Error('Invalid verification token');
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    await this.userRepository.save(user);

    return true;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return; // Don't reveal if user exists
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    await this.userRepository.save(user);

    await this.emailService.sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { passwordResetToken: token },
    });

    if (!user || !user.passwordResetExpires) {
      throw new Error('Invalid or expired reset token');
    }

    if (user.passwordResetExpires < new Date()) {
      throw new Error('Reset token has expired');
    }

    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await this.userRepository.save(user);

    return true;
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as TokenPayload;

      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    // Add refresh token to blacklist
    await this.redisService.blacklistToken(refreshToken);
  }

  private generateTokens(user: User): AuthTokens {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRE || '1d',
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
    });

    return { accessToken, refreshToken };
  }

  private async handleReferral(
    refereeId: string,
    referralCode: string
  ): Promise<void> {
    const referrer = await this.userRepository.findOne({
      where: { referralCode },
    });

    if (!referrer) {
      return;
    }

    // Create referral record
    // Implementation depends on Referral model
  }
}