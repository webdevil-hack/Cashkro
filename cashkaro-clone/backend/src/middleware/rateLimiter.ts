import rateLimit from 'express-rate-limit';
import { RedisService } from '../services/RedisService';

// General rate limiter
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate limiter
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Store visit rate limiter
export const storeVisitRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 store visits per minute
  message: 'Too many store visits, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Custom rate limiter using Redis
export const createRedisRateLimiter = (
  windowMs: number,
  maxRequests: number,
  keyPrefix: string
) => {
  return async (req: any, res: any, next: any) => {
    try {
      const redisService = RedisService.getInstance();
      const key = `${keyPrefix}:${req.ip}`;
      
      const requests = await redisService.incrementRateLimit(
        key,
        Math.floor(windowMs / 1000)
      );

      if (requests > maxRequests) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests, please try again later.',
        });
      }

      next();
    } catch (error) {
      // If Redis fails, allow the request
      console.error('Rate limiter error:', error);
      next();
    }
  };
};