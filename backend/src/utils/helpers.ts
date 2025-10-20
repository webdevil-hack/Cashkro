import crypto from 'crypto';

export const generateReferralCode = (): string => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

export const generateOrderId = (): string => {
  return `CK${Date.now()}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
};

export const calculateCashback = (orderValue: number, cashbackRate: number, maxCashback?: number): number => {
  const cashback = (orderValue * cashbackRate) / 100;
  return maxCashback ? Math.min(cashback, maxCashback) : cashback;
};

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '');
};

export const generateTrackingId = (): string => {
  return `TRK${Date.now()}${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
};

export const parseUserAgent = (userAgent: string) => {
  // Basic user agent parsing - in production, use a library like ua-parser-js
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
  const isTablet = /iPad|Tablet/i.test(userAgent);
  const isDesktop = !isMobile && !isTablet;
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    userAgent
  };
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const getClientIp = (req: any): string => {
  return req.ip || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress || 
         req.headers['x-forwarded-for']?.split(',')[0] || 
         '127.0.0.1';
};