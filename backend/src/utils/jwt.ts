// path: backend/src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

export class JWTUtils {
  /**
   * Generate access token
   */
  static generateAccessToken(user: IUser): string {
    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'cashkaro-clone',
      audience: 'cashkaro-users'
    });
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(user: IUser, tokenVersion: number = 0): string {
    const payload: RefreshTokenPayload = {
      userId: user._id.toString(),
      tokenVersion
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '30d',
      issuer: 'cashkaro-clone',
      audience: 'cashkaro-users'
    });
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'cashkaro-clone',
        audience: 'cashkaro-users'
      }) as JWTPayload;

      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'cashkaro-clone',
        audience: 'cashkaro-users'
      }) as RefreshTokenPayload;

      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate password reset token
   */
  static generatePasswordResetToken(user: IUser): string {
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      type: 'password_reset'
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1h',
      issuer: 'cashkaro-clone',
      audience: 'cashkaro-users'
    });
  }

  /**
   * Verify password reset token
   */
  static verifyPasswordResetToken(token: string): { userId: string; email: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'cashkaro-clone',
        audience: 'cashkaro-users'
      }) as any;

      if (decoded.type !== 'password_reset') {
        return null;
      }

      return {
        userId: decoded.userId,
        email: decoded.email
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate email verification token
   */
  static generateEmailVerificationToken(user: IUser): string {
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      type: 'email_verification'
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '24h',
      issuer: 'cashkaro-clone',
      audience: 'cashkaro-users'
    });
  }

  /**
   * Verify email verification token
   */
  static verifyEmailVerificationToken(token: string): { userId: string; email: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'cashkaro-clone',
        audience: 'cashkaro-users'
      }) as any;

      if (decoded.type !== 'email_verification') {
        return null;
      }

      return {
        userId: decoded.userId,
        email: decoded.email
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate OTP verification token
   */
  static generateOTPToken(phone: string): string {
    const payload = {
      phone,
      type: 'otp_verification'
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '10m',
      issuer: 'cashkaro-clone',
      audience: 'cashkaro-users'
    });
  }

  /**
   * Verify OTP token
   */
  static verifyOTPToken(token: string): { phone: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'cashkaro-clone',
        audience: 'cashkaro-users'
      }) as any;

      if (decoded.type !== 'otp_verification') {
        return null;
      }

      return {
        phone: decoded.phone
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) {
        return true;
      }

      return Date.now() >= decoded.exp * 1000;
    } catch (error) {
      return true;
    }
  }

  /**
   * Get token expiration time
   */
  static getTokenExpiration(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) {
        return null;
      }

      return new Date(decoded.exp * 1000);
    } catch (error) {
      return null;
    }
  }
}

export default JWTUtils;