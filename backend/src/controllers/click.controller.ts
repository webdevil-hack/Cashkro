// path: backend/src/controllers/click.controller.ts
import { Request, Response } from 'express';
import TrackingService from '../services/tracking.service';
import { clickValidation } from '../utils/validator';
import logger from '../utils/logger';

export class ClickController {
  private trackingService: TrackingService;

  constructor() {
    this.trackingService = new TrackingService();
  }

  /**
   * Create click tracking
   */
  async createClick(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const { error, value } = clickValidation.create.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
        return;
      }

      const { storeId, couponId, redirectToAffiliateUrl } = value;
      const userId = (req as any).user?.userId; // Optional for guest users
      const sessionId = req.sessionID || req.headers['x-session-id'] as string || 'guest';

      // Extract metadata from request
      const meta = {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip || req.connection.remoteAddress,
        referrer: req.headers.referer,
        utmSource: req.query.utm_source as string,
        utmMedium: req.query.utm_medium as string,
        utmCampaign: req.query.utm_campaign as string,
        deviceType: this.detectDeviceType(req.headers['user-agent']),
        browser: this.detectBrowser(req.headers['user-agent']),
        os: this.detectOS(req.headers['user-agent'])
      };

      // Create click
      const result = await this.trackingService.createClick({
        userId,
        sessionId,
        storeId,
        couponId,
        redirectToAffiliateUrl,
        meta
      });

      logger.info(`Click created: ${result.clickToken} for store ${storeId}`);

      res.json({
        success: true,
        message: 'Click created successfully',
        data: {
          clickToken: result.clickToken,
          redirectUrl: result.redirectUrl
        }
      });
    } catch (error) {
      logger.error('Create click error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Process click redirect
   */
  async processRedirect(req: Request, res: Response): Promise<void> {
    try {
      const { clickToken } = req.params;

      if (!clickToken) {
        res.status(400).json({
          success: false,
          message: 'Click token is required'
        });
        return;
      }

      // Process redirect
      const redirectUrl = await this.trackingService.processClickRedirect(clickToken);

      // Set session cookie for tracking
      res.cookie('ck_session', clickToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      // Redirect to affiliate URL
      res.redirect(302, redirectUrl);
    } catch (error) {
      logger.error('Process redirect error:', error);
      
      // Redirect to error page or home page
      res.redirect(302, `${process.env.FRONTEND_URL}/error?message=Invalid or expired link`);
    }
  }

  /**
   * Get click statistics
   */
  async getClickStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { storeId, startDate, endDate } = req.query;

      const dateRange = startDate && endDate ? {
        start: new Date(startDate as string),
        end: new Date(endDate as string)
      } : undefined;

      const stats = await this.trackingService.getClickStats(
        storeId as string,
        userId,
        dateRange
      );

      res.json({
        success: true,
        data: {
          stats
        }
      });
    } catch (error) {
      logger.error('Get click stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Detect device type from user agent
   */
  private detectDeviceType(userAgent?: string): 'mobile' | 'desktop' | 'tablet' {
    if (!userAgent) return 'desktop';

    const ua = userAgent.toLowerCase();
    
    if (/tablet|ipad/.test(ua)) {
      return 'tablet';
    } else if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/.test(ua)) {
      return 'mobile';
    } else {
      return 'desktop';
    }
  }

  /**
   * Detect browser from user agent
   */
  private detectBrowser(userAgent?: string): string {
    if (!userAgent) return 'unknown';

    const ua = userAgent.toLowerCase();
    
    if (ua.includes('chrome') && !ua.includes('edg')) {
      return 'Chrome';
    } else if (ua.includes('firefox')) {
      return 'Firefox';
    } else if (ua.includes('safari') && !ua.includes('chrome')) {
      return 'Safari';
    } else if (ua.includes('edg')) {
      return 'Edge';
    } else if (ua.includes('opera') || ua.includes('opr')) {
      return 'Opera';
    } else {
      return 'Other';
    }
  }

  /**
   * Detect operating system from user agent
   */
  private detectOS(userAgent?: string): string {
    if (!userAgent) return 'unknown';

    const ua = userAgent.toLowerCase();
    
    if (ua.includes('windows')) {
      return 'Windows';
    } else if (ua.includes('mac')) {
      return 'macOS';
    } else if (ua.includes('linux')) {
      return 'Linux';
    } else if (ua.includes('android')) {
      return 'Android';
    } else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) {
      return 'iOS';
    } else {
      return 'Other';
    }
  }
}

export default new ClickController();