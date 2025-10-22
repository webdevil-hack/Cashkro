import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

export class RedisService {
  private static instance: RedisService;
  private client: Redis;

  private constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    this.client.on('connect', () => {
      console.log('Redis Client Connected');
    });
  }

  static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(
    key: string,
    value: string,
    expireSeconds?: number
  ): Promise<void> {
    if (expireSeconds) {
      await this.client.setex(key, expireSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds);
  }

  // Session management
  async setSession(sessionId: string, data: any, ttl = 86400): Promise<void> {
    await this.set(`session:${sessionId}`, JSON.stringify(data), ttl);
  }

  async getSession(sessionId: string): Promise<any | null> {
    const data = await this.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.del(`session:${sessionId}`);
  }

  // Token blacklisting
  async blacklistToken(token: string, ttl = 86400 * 30): Promise<void> {
    await this.set(`blacklist:${token}`, '1', ttl);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return this.exists(`blacklist:${token}`);
  }

  // Click tracking
  async trackClick(clickId: string, data: any, ttl = 86400 * 7): Promise<void> {
    await this.set(`click:${clickId}`, JSON.stringify(data), ttl);
  }

  async getClick(clickId: string): Promise<any | null> {
    const data = await this.get(`click:${clickId}`);
    return data ? JSON.parse(data) : null;
  }

  // Rate limiting
  async incrementRateLimit(
    key: string,
    windowSeconds = 60
  ): Promise<number> {
    const multi = this.client.multi();
    multi.incr(key);
    multi.expire(key, windowSeconds);
    const results = await multi.exec();
    return results?.[0]?.[1] as number;
  }

  // Cache management
  async setCache(
    key: string,
    data: any,
    ttl = 3600
  ): Promise<void> {
    await this.set(`cache:${key}`, JSON.stringify(data), ttl);
  }

  async getCache(key: string): Promise<any | null> {
    const data = await this.get(`cache:${key}`);
    return data ? JSON.parse(data) : null;
  }

  async invalidateCache(pattern: string): Promise<void> {
    const keys = await this.client.keys(`cache:${pattern}`);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  // Queue management for background jobs
  async pushToQueue(queue: string, data: any): Promise<void> {
    await this.client.rpush(queue, JSON.stringify(data));
  }

  async popFromQueue(queue: string): Promise<any | null> {
    const data = await this.client.lpop(queue);
    return data ? JSON.parse(data) : null;
  }

  async getQueueLength(queue: string): Promise<number> {
    return this.client.llen(queue);
  }
}