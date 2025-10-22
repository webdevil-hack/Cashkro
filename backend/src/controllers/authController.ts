import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { generateReferralCode } from '../utils/helpers';
import { sendEmail } from '../services/emailService';
import { validateEmail, validatePassword } from '../utils/validation';

const prisma = new PrismaClient();

// Generate JWT token
const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Generate email verification token
const generateVerificationToken = (userId: string) => {
  return jwt.sign({ id: userId, type: 'email_verification' }, process.env.JWT_SECRET!, {
    expiresIn: '24h'
  });
};

// Generate password reset token
const generateResetToken = (userId: string) => {
  return jwt.sign({ id: userId, type: 'password_reset' }, process.env.JWT_SECRET!, {
    expiresIn: '1h'
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, referralCode } = req.body;

    // Validation
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters long and contain uppercase, lowercase, number and special character' 
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Check referral code if provided
    let referrerId = null;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode }
      });
      if (referrer) {
        referrerId = referrer.id;
      }
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate unique referral code
    const userReferralCode = generateReferralCode();

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        referralCode: userReferralCode,
        referredBy: referrerId
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        referralCode: true,
        walletBalance: true,
        totalEarned: true,
        isEmailVerified: true,
        createdAt: true
      }
    });

    // Generate tokens
    const token = generateToken(user.id);
    const verificationToken = generateVerificationToken(user.id);

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: 'Verify Your Email - CashKaro Clone',
        template: 'email-verification',
        data: {
          firstName,
          verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
        }
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        referralCode: true,
        walletBalance: true,
        totalEarned: true,
        isEmailVerified: true,
        isActive: true,
        role: true,
        createdAt: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const newToken = generateToken(decoded.id);

    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if user exists or not
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    const resetToken = generateResetToken(user.id);

    // Send reset email
    try {
      await sendEmail({
        to: email,
        subject: 'Reset Your Password - CashKaro Clone',
        template: 'password-reset',
        data: {
          firstName: user.firstName,
          resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
        }
      });
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      return res.status(500).json({ error: 'Failed to send reset email' });
    }

    res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters long and contain uppercase, lowercase, number and special character' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (decoded.type !== 'password_reset') {
      return res.status(400).json({ error: 'Invalid token type' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (decoded.type !== 'email_verification') {
      return res.status(400).json({ error: 'Invalid token type' });
    }

    await prisma.user.update({
      where: { id: decoded.id },
      data: { isEmailVerified: true }
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resendVerification = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    const verificationToken = generateVerificationToken(user.id);

    // Send verification email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Verify Your Email - CashKaro Clone',
        template: 'email-verification',
        data: {
          firstName: user.firstName,
          verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
        }
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    res.json({ message: 'Verification email sent' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    // This would integrate with Google OAuth
    // For now, returning a placeholder response
    res.status(501).json({ error: 'Google authentication not implemented yet' });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const facebookAuth = async (req: Request, res: Response) => {
  try {
    // This would integrate with Facebook OAuth
    // For now, returning a placeholder response
    res.status(501).json({ error: 'Facebook authentication not implemented yet' });
  } catch (error) {
    console.error('Facebook auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};