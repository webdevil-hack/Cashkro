// path: backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/user.model';
import { Referral } from '../models/referral.model';
import JWTUtils from '../utils/jwt';
import { userValidation } from '../utils/validator';
import logger from '../utils/logger';

export class AuthController {
  /**
   * User registration
   */
  async signup(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const { error, value } = userValidation.signup.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
        return;
      }

      const { name, email, password, referralCode, phone } = value;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'User already exists with this email'
        });
        return;
      }

      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Find referrer if referral code provided
      let referredBy = null;
      if (referralCode) {
        const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
        if (referrer) {
          referredBy = referrer._id;
        }
      }

      // Create user
      const user = new User({
        name,
        email,
        passwordHash,
        referredBy,
        phone,
        wallet: { available: 0, pending: 0 }
      });

      await user.save();

      // Create referral record if user was referred
      if (referredBy) {
        const referral = new Referral({
          referrerId: referredBy,
          referredId: user._id,
          rewardAmount: 50, // Configurable signup reward
          rewardType: 'signup',
          status: 'pending'
        });

        await referral.save();
        logger.info(`Referral created for user ${user._id} by referrer ${referredBy}`);
      }

      // Generate tokens
      const accessToken = JWTUtils.generateAccessToken(user);
      const refreshToken = JWTUtils.generateRefreshToken(user);

      logger.info(`User registered: ${user.email}`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            wallet: user.wallet,
            referralCode: user.referralCode,
            isPhoneVerified: user.isPhoneVerified
          },
          tokens: {
            accessToken,
            refreshToken
          }
        }
      });
    } catch (error) {
      logger.error('Signup error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * User login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const { error, value } = userValidation.login.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
        return;
      }

      const { email, password } = value;

      // Find user
      const user = await User.findOne({ email }).select('+passwordHash');
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
        return;
      }

      // Check if user is blocked
      if (user.isBlocked) {
        res.status(403).json({
          success: false,
          message: 'Account is blocked. Please contact support.'
        });
        return;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
        return;
      }

      // Generate tokens
      const accessToken = JWTUtils.generateAccessToken(user);
      const refreshToken = JWTUtils.generateRefreshToken(user);

      logger.info(`User logged in: ${user.email}`);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            wallet: user.wallet,
            referralCode: user.referralCode,
            isPhoneVerified: user.isPhoneVerified
          },
          tokens: {
            accessToken,
            refreshToken
          }
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        });
        return;
      }

      // Verify refresh token
      const payload = JWTUtils.verifyRefreshToken(refreshToken);
      if (!payload) {
        res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
        return;
      }

      // Find user
      const user = await User.findById(payload.userId);
      if (!user || user.isBlocked) {
        res.status(401).json({
          success: false,
          message: 'User not found or blocked'
        });
        return;
      }

      // Generate new tokens
      const newAccessToken = JWTUtils.generateAccessToken(user);
      const newRefreshToken = JWTUtils.generateRefreshToken(user, payload.tokenVersion || 0);

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          tokens: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
          }
        }
      });
    } catch (error) {
      logger.error('Refresh token error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const user = await User.findById(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            wallet: user.wallet,
            referralCode: user.referralCode,
            isPhoneVerified: user.isPhoneVerified,
            profilePicture: user.profilePicture,
            phone: user.phone,
            createdAt: user.createdAt
          }
        }
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { error, value } = userValidation.updateProfile.validate(req.body);

      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
        return;
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { ...value, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      logger.info(`User profile updated: ${user.email}`);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            wallet: user.wallet,
            referralCode: user.referralCode,
            isPhoneVerified: user.isPhoneVerified,
            profilePicture: user.profilePicture,
            phone: user.phone
          }
        }
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Change password
   */
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { error, value } = userValidation.changePassword.validate(req.body);

      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
        return;
      }

      const { currentPassword, newPassword } = value;

      // Find user with password hash
      const user = await User.findById(userId).select('+passwordHash');
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isCurrentPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
        return;
      }

      // Hash new password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      user.passwordHash = newPasswordHash;
      user.updatedAt = new Date();
      await user.save();

      logger.info(`Password changed for user: ${user.email}`);

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      logger.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Logout user
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      // In a real implementation, you would blacklist the token
      // For now, we'll just return success
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { password } = req.body;

      if (!password) {
        res.status(400).json({
          success: false,
          message: 'Password is required to delete account'
        });
        return;
      }

      // Find user with password hash
      const user = await User.findById(userId).select('+passwordHash');
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Password is incorrect'
        });
        return;
      }

      // Soft delete user (mark as blocked)
      user.isBlocked = true;
      user.updatedAt = new Date();
      await user.save();

      logger.info(`User account deleted: ${user.email}`);

      res.json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      logger.error('Delete account error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

export default new AuthController();