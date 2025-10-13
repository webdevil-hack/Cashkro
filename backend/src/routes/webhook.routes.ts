// path: backend/src/routes/webhook.routes.ts
import { Router } from 'express';
import { Request, Response } from 'express';
import TrackingService from '../services/tracking.service';
import PayoutService from '../services/payout.service';
import logger from '../utils/logger';

const router = Router();
const trackingService = new TrackingService();
const payoutService = new PayoutService();

/**
 * Process affiliate network webhooks
 */
router.post('/affiliate/:network', async (req: Request, res: Response) => {
  try {
    const { network } = req.params;
    const signature = req.headers['x-signature'] as string || req.headers['x-webhook-signature'] as string;
    const payload = req.body;

    logger.info(`Received webhook from ${network}:`, { payload, signature });

    // Process webhook
    const transaction = await trackingService.processWebhook(network, payload, signature || '');

    if (transaction) {
      logger.info(`Webhook processed successfully: ${transaction._id}`);
      res.status(200).json({
        success: true,
        message: 'Webhook processed successfully',
        transactionId: transaction._id
      });
    } else {
      logger.warn(`No transaction created from webhook: ${network}`);
      res.status(200).json({
        success: true,
        message: 'Webhook received but no action taken'
      });
    }
  } catch (error) {
    logger.error(`Webhook processing error for ${req.params.network}:`, error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
});

/**
 * Process Razorpay payout webhooks
 */
router.post('/razorpay/payout', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const payload = req.body;

    logger.info('Received Razorpay payout webhook:', { payload, signature });

    await payoutService.processPayoutWebhook(payload, signature, 'razorpay');

    res.status(200).json({
      success: true,
      message: 'Razorpay webhook processed successfully'
    });
  } catch (error) {
    logger.error('Razorpay payout webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Razorpay webhook processing failed'
    });
  }
});

/**
 * Process Stripe payout webhooks
 */
router.post('/stripe/payout', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const payload = req.body;

    logger.info('Received Stripe payout webhook:', { payload, signature });

    await payoutService.processPayoutWebhook(payload, signature, 'stripe');

    res.status(200).json({
      success: true,
      message: 'Stripe webhook processed successfully'
    });
  } catch (error) {
    logger.error('Stripe payout webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Stripe webhook processing failed'
    });
  }
});

/**
 * Test webhook endpoint
 */
router.post('/test', async (req: Request, res: Response) => {
  try {
    const { network, payload } = req.body;

    logger.info(`Test webhook received for ${network}:`, payload);

    // Simulate webhook processing
    const mockConversion = {
      orderId: `test_${Date.now()}`,
      amount: 1000,
      commission: 50,
      status: 'confirmed' as const,
      conversionDate: new Date(),
      productName: 'Test Product',
      trackingId: `track_${Date.now()}`
    };

    res.status(200).json({
      success: true,
      message: 'Test webhook received',
      data: { mockConversion }
    });
  } catch (error) {
    logger.error('Test webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Test webhook failed'
    });
  }
});

/**
 * Health check for webhooks
 */
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Webhook service is healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;