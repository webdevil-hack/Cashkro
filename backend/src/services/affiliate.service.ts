// path: backend/src/services/affiliate.service.ts
import axios from 'axios';
import logger from '../utils/logger';
import { IStore, IAffiliateLink } from '../models/store.model';

export interface AffiliateConversion {
  orderId: string;
  amount: number;
  commission: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  conversionDate: Date;
  productName?: string;
  trackingId?: string;
}

export interface AffiliateResponse {
  success: boolean;
  redirectUrl?: string;
  error?: string;
  conversion?: AffiliateConversion;
}

export abstract class AffiliateAdapter {
  abstract generateLink(store: IStore, couponCode?: string, userId?: string): Promise<string>;
  abstract trackConversion(orderId: string, amount: number): Promise<AffiliateConversion | null>;
  abstract validateWebhook(payload: any, signature: string): boolean;
  abstract processWebhook(payload: any): AffiliateConversion | null;
}

export class AdmitadAdapter extends AffiliateAdapter {
  private apiKey: string;
  private baseUrl = 'https://api.admitad.com';

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async generateLink(store: IStore, couponCode?: string, userId?: string): Promise<string> {
    try {
      const affiliateLink = store.affiliateLinks.find(link => link.network === 'admitad' && link.isActive);
      if (!affiliateLink) {
        throw new Error('No active Admitad affiliate link found for this store');
      }

      let url = affiliateLink.link;
      
      // Add tracking parameters
      const params = new URLSearchParams();
      params.append('aid', affiliateLink.partnerId);
      if (userId) {
        params.append('subid', userId);
      }
      if (couponCode) {
        params.append('promocode', couponCode);
      }

      // Add timestamp for tracking
      params.append('timestamp', Date.now().toString());

      url += (url.includes('?') ? '&' : '?') + params.toString();
      
      logger.info(`Generated Admitad link for store ${store.name}: ${url}`);
      return url;
    } catch (error) {
      logger.error('Error generating Admitad link:', error);
      throw error;
    }
  }

  async trackConversion(orderId: string, amount: number): Promise<AffiliateConversion | null> {
    try {
      // Admitad API call to track conversion
      const response = await axios.get(`${this.baseUrl}/conversions/`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        params: {
          order_id: orderId,
          amount: amount
        }
      });

      if (response.data && response.data.results && response.data.results.length > 0) {
        const conversion = response.data.results[0];
        return {
          orderId: conversion.order_id,
          amount: conversion.amount,
          commission: conversion.commission,
          status: conversion.status === 'confirmed' ? 'confirmed' : 'pending',
          conversionDate: new Date(conversion.created_at),
          productName: conversion.product_name,
          trackingId: conversion.tracking_id
        };
      }

      return null;
    } catch (error) {
      logger.error('Error tracking Admitad conversion:', error);
      return null;
    }
  }

  validateWebhook(payload: any, signature: string): boolean {
    // Implement Admitad webhook validation
    // This would typically involve HMAC verification
    return true; // Simplified for demo
  }

  processWebhook(payload: any): AffiliateConversion | null {
    try {
      if (payload.event_type === 'conversion' && payload.conversion) {
        const conversion = payload.conversion;
        return {
          orderId: conversion.order_id,
          amount: conversion.amount,
          commission: conversion.commission,
          status: conversion.status === 'confirmed' ? 'confirmed' : 'pending',
          conversionDate: new Date(conversion.created_at),
          productName: conversion.product_name,
          trackingId: conversion.tracking_id
        };
      }
      return null;
    } catch (error) {
      logger.error('Error processing Admitad webhook:', error);
      return null;
    }
  }
}

export class ImpactAdapter extends AffiliateAdapter {
  private apiKey: string;
  private baseUrl = 'https://api.impact.com';

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async generateLink(store: IStore, couponCode?: string, userId?: string): Promise<string> {
    try {
      const affiliateLink = store.affiliateLinks.find(link => link.network === 'impact' && link.isActive);
      if (!affiliateLink) {
        throw new Error('No active Impact affiliate link found for this store');
      }

      let url = affiliateLink.link;
      
      // Add Impact-specific tracking parameters
      const params = new URLSearchParams();
      params.append('campaign_id', affiliateLink.partnerId);
      if (userId) {
        params.append('sub_id', userId);
      }
      if (couponCode) {
        params.append('coupon_code', couponCode);
      }

      url += (url.includes('?') ? '&' : '?') + params.toString();
      
      logger.info(`Generated Impact link for store ${store.name}: ${url}`);
      return url;
    } catch (error) {
      logger.error('Error generating Impact link:', error);
      throw error;
    }
  }

  async trackConversion(orderId: string, amount: number): Promise<AffiliateConversion | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/conversions/`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        params: {
          order_id: orderId,
          amount: amount
        }
      });

      if (response.data && response.data.conversions && response.data.conversions.length > 0) {
        const conversion = response.data.conversions[0];
        return {
          orderId: conversion.order_id,
          amount: conversion.amount,
          commission: conversion.commission,
          status: conversion.status === 'approved' ? 'confirmed' : 'pending',
          conversionDate: new Date(conversion.created_at),
          productName: conversion.product_name,
          trackingId: conversion.tracking_id
        };
      }

      return null;
    } catch (error) {
      logger.error('Error tracking Impact conversion:', error);
      return null;
    }
  }

  validateWebhook(payload: any, signature: string): boolean {
    // Implement Impact webhook validation
    return true; // Simplified for demo
  }

  processWebhook(payload: any): AffiliateConversion | null {
    try {
      if (payload.type === 'conversion' && payload.data) {
        const conversion = payload.data;
        return {
          orderId: conversion.order_id,
          amount: conversion.amount,
          commission: conversion.commission,
          status: conversion.status === 'approved' ? 'confirmed' : 'pending',
          conversionDate: new Date(conversion.created_at),
          productName: conversion.product_name,
          trackingId: conversion.tracking_id
        };
      }
      return null;
    } catch (error) {
      logger.error('Error processing Impact webhook:', error);
      return null;
    }
  }
}

export class CuelinksAdapter extends AffiliateAdapter {
  private apiKey: string;
  private baseUrl = 'https://api.cuelinks.com';

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async generateLink(store: IStore, couponCode?: string, userId?: string): Promise<string> {
    try {
      const affiliateLink = store.affiliateLinks.find(link => link.network === 'cuelinks' && link.isActive);
      if (!affiliateLink) {
        throw new Error('No active Cuelinks affiliate link found for this store');
      }

      let url = affiliateLink.link;
      
      // Add Cuelinks-specific tracking parameters
      const params = new URLSearchParams();
      params.append('aff_id', affiliateLink.partnerId);
      if (userId) {
        params.append('sub_id', userId);
      }
      if (couponCode) {
        params.append('coupon', couponCode);
      }

      url += (url.includes('?') ? '&' : '?') + params.toString();
      
      logger.info(`Generated Cuelinks link for store ${store.name}: ${url}`);
      return url;
    } catch (error) {
      logger.error('Error generating Cuelinks link:', error);
      throw error;
    }
  }

  async trackConversion(orderId: string, amount: number): Promise<AffiliateConversion | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/conversions/`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        params: {
          order_id: orderId,
          amount: amount
        }
      });

      if (response.data && response.data.conversions && response.data.conversions.length > 0) {
        const conversion = response.data.conversions[0];
        return {
          orderId: conversion.order_id,
          amount: conversion.amount,
          commission: conversion.commission,
          status: conversion.status === 'confirmed' ? 'confirmed' : 'pending',
          conversionDate: new Date(conversion.created_at),
          productName: conversion.product_name,
          trackingId: conversion.tracking_id
        };
      }

      return null;
    } catch (error) {
      logger.error('Error tracking Cuelinks conversion:', error);
      return null;
    }
  }

  validateWebhook(payload: any, signature: string): boolean {
    // Implement Cuelinks webhook validation
    return true; // Simplified for demo
  }

  processWebhook(payload: any): AffiliateConversion | null {
    try {
      if (payload.event === 'conversion' && payload.data) {
        const conversion = payload.data;
        return {
          orderId: conversion.order_id,
          amount: conversion.amount,
          commission: conversion.commission,
          status: conversion.status === 'confirmed' ? 'confirmed' : 'pending',
          conversionDate: new Date(conversion.created_at),
          productName: conversion.product_name,
          trackingId: conversion.tracking_id
        };
      }
      return null;
    } catch (error) {
      logger.error('Error processing Cuelinks webhook:', error);
      return null;
    }
  }
}

export class FlipkartAdapter extends AffiliateAdapter {
  private affiliateId: string;
  private baseUrl = 'https://affiliate-api.flipkart.net';

  constructor(affiliateId: string) {
    super();
    this.affiliateId = affiliateId;
  }

  async generateLink(store: IStore, couponCode?: string, userId?: string): Promise<string> {
    try {
      const affiliateLink = store.affiliateLinks.find(link => link.network === 'flipkart' && link.isActive);
      if (!affiliateLink) {
        throw new Error('No active Flipkart affiliate link found for this store');
      }

      let url = affiliateLink.link;
      
      // Add Flipkart-specific tracking parameters
      const params = new URLSearchParams();
      params.append('affid', this.affiliateId);
      if (userId) {
        params.append('subid', userId);
      }
      if (couponCode) {
        params.append('coupon', couponCode);
      }

      url += (url.includes('?') ? '&' : '?') + params.toString();
      
      logger.info(`Generated Flipkart link for store ${store.name}: ${url}`);
      return url;
    } catch (error) {
      logger.error('Error generating Flipkart link:', error);
      throw error;
    }
  }

  async trackConversion(orderId: string, amount: number): Promise<AffiliateConversion | null> {
    try {
      // Flipkart API call to track conversion
      const response = await axios.get(`${this.baseUrl}/conversions/`, {
        params: {
          affiliate_id: this.affiliateId,
          order_id: orderId,
          amount: amount
        }
      });

      if (response.data && response.data.conversions && response.data.conversions.length > 0) {
        const conversion = response.data.conversions[0];
        return {
          orderId: conversion.order_id,
          amount: conversion.amount,
          commission: conversion.commission,
          status: conversion.status === 'confirmed' ? 'confirmed' : 'pending',
          conversionDate: new Date(conversion.created_at),
          productName: conversion.product_name,
          trackingId: conversion.tracking_id
        };
      }

      return null;
    } catch (error) {
      logger.error('Error tracking Flipkart conversion:', error);
      return null;
    }
  }

  validateWebhook(payload: any, signature: string): boolean {
    // Implement Flipkart webhook validation
    return true; // Simplified for demo
  }

  processWebhook(payload: any): AffiliateConversion | null {
    try {
      if (payload.event_type === 'conversion' && payload.conversion) {
        const conversion = payload.conversion;
        return {
          orderId: conversion.order_id,
          amount: conversion.amount,
          commission: conversion.commission,
          status: conversion.status === 'confirmed' ? 'confirmed' : 'pending',
          conversionDate: new Date(conversion.created_at),
          productName: conversion.product_name,
          trackingId: conversion.tracking_id
        };
      }
      return null;
    } catch (error) {
      logger.error('Error processing Flipkart webhook:', error);
      return null;
    }
  }
}

export class AmazonAdapter extends AffiliateAdapter {
  private affiliateId: string;
  private baseUrl = 'https://webservices.amazon.com';

  constructor(affiliateId: string) {
    super();
    this.affiliateId = affiliateId;
  }

  async generateLink(store: IStore, couponCode?: string, userId?: string): Promise<string> {
    try {
      const affiliateLink = store.affiliateLinks.find(link => link.network === 'amazon' && link.isActive);
      if (!affiliateLink) {
        throw new Error('No active Amazon affiliate link found for this store');
      }

      let url = affiliateLink.link;
      
      // Add Amazon-specific tracking parameters
      const params = new URLSearchParams();
      params.append('tag', this.affiliateId);
      if (userId) {
        params.append('linkCode', userId);
      }
      if (couponCode) {
        params.append('coupon', couponCode);
      }

      url += (url.includes('?') ? '&' : '?') + params.toString();
      
      logger.info(`Generated Amazon link for store ${store.name}: ${url}`);
      return url;
    } catch (error) {
      logger.error('Error generating Amazon link:', error);
      throw error;
    }
  }

  async trackConversion(orderId: string, amount: number): Promise<AffiliateConversion | null> {
    try {
      // Amazon API call to track conversion
      const response = await axios.get(`${this.baseUrl}/conversions/`, {
        params: {
          affiliate_id: this.affiliateId,
          order_id: orderId,
          amount: amount
        }
      });

      if (response.data && response.data.conversions && response.data.conversions.length > 0) {
        const conversion = response.data.conversions[0];
        return {
          orderId: conversion.order_id,
          amount: conversion.amount,
          commission: conversion.commission,
          status: conversion.status === 'confirmed' ? 'confirmed' : 'pending',
          conversionDate: new Date(conversion.created_at),
          productName: conversion.product_name,
          trackingId: conversion.tracking_id
        };
      }

      return null;
    } catch (error) {
      logger.error('Error tracking Amazon conversion:', error);
      return null;
    }
  }

  validateWebhook(payload: any, signature: string): boolean {
    // Implement Amazon webhook validation
    return true; // Simplified for demo
  }

  processWebhook(payload: any): AffiliateConversion | null {
    try {
      if (payload.eventType === 'conversion' && payload.conversion) {
        const conversion = payload.conversion;
        return {
          orderId: conversion.order_id,
          amount: conversion.amount,
          commission: conversion.commission,
          status: conversion.status === 'confirmed' ? 'confirmed' : 'pending',
          conversionDate: new Date(conversion.created_at),
          productName: conversion.product_name,
          trackingId: conversion.tracking_id
        };
      }
      return null;
    } catch (error) {
      logger.error('Error processing Amazon webhook:', error);
      return null;
    }
  }
}

export class AffiliateService {
  private adapters: Map<string, AffiliateAdapter> = new Map();

  constructor() {
    this.initializeAdapters();
  }

  private initializeAdapters(): void {
    // Initialize adapters based on environment variables
    if (process.env.ADMITAD_API_KEY) {
      this.adapters.set('admitad', new AdmitadAdapter(process.env.ADMITAD_API_KEY));
    }
    
    if (process.env.IMPACT_API_KEY) {
      this.adapters.set('impact', new ImpactAdapter(process.env.IMPACT_API_KEY));
    }
    
    if (process.env.CUELINKS_API_KEY) {
      this.adapters.set('cuelinks', new CuelinksAdapter(process.env.CUELINKS_API_KEY));
    }
    
    if (process.env.FLIPKART_AFFILIATE_ID) {
      this.adapters.set('flipkart', new FlipkartAdapter(process.env.FLIPKART_AFFILIATE_ID));
    }
    
    if (process.env.AMAZON_AFFILIATE_ID) {
      this.adapters.set('amazon', new AmazonAdapter(process.env.AMAZON_AFFILIATE_ID));
    }
  }

  async generateAffiliateLink(store: IStore, network: string, couponCode?: string, userId?: string): Promise<string> {
    const adapter = this.adapters.get(network);
    if (!adapter) {
      throw new Error(`No adapter found for network: ${network}`);
    }

    return await adapter.generateLink(store, couponCode, userId);
  }

  async trackConversion(network: string, orderId: string, amount: number): Promise<AffiliateConversion | null> {
    const adapter = this.adapters.get(network);
    if (!adapter) {
      logger.error(`No adapter found for network: ${network}`);
      return null;
    }

    return await adapter.trackConversion(orderId, amount);
  }

  validateWebhook(network: string, payload: any, signature: string): boolean {
    const adapter = this.adapters.get(network);
    if (!adapter) {
      logger.error(`No adapter found for network: ${network}`);
      return false;
    }

    return adapter.validateWebhook(payload, signature);
  }

  processWebhook(network: string, payload: any): AffiliateConversion | null {
    const adapter = this.adapters.get(network);
    if (!adapter) {
      logger.error(`No adapter found for network: ${network}`);
      return null;
    }

    return adapter.processWebhook(payload);
  }

  getAvailableNetworks(): string[] {
    return Array.from(this.adapters.keys());
  }
}

export default AffiliateService;