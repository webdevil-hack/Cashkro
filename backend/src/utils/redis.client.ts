// path: backend/src/utils/redis.client.ts
import { createClient, RedisClientType } from 'redis';
import logger from './logger';

class RedisClient {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    this.client = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error('Redis connection failed after 10 retries');
            return new Error('Redis connection failed');
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });

    this.client.on('error', (err) => {
      logger.error('Redis Client Error:', err);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      logger.info('Redis client connected');
      this.isConnected = true;
    });

    this.client.on('ready', () => {
      logger.info('Redis client ready');
    });

    this.client.on('end', () => {
      logger.info('Redis client disconnected');
      this.isConnected = false;
    });
  }

  /**
   * Connect to Redis
   */
  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    try {
      await this.client.quit();
    } catch (error) {
      logger.error('Failed to disconnect from Redis:', error);
      throw error;
    }
  }

  /**
   * Check if client is connected
   */
  isClientConnected(): boolean {
    return this.isConnected && this.client.isReady;
  }

  /**
   * Set a key-value pair with optional expiration
   */
  async set(key: string, value: string, options?: { EX?: number; PX?: number }): Promise<void> {
    try {
      if (options) {
        await this.client.set(key, value, options);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      logger.error(`Failed to set key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get a value by key
   */
  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error(`Failed to get key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Delete a key
   */
  async del(key: string): Promise<number> {
    try {
      return await this.client.del(key);
    } catch (error) {
      logger.error(`Failed to delete key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Check if a key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Failed to check existence of key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Set expiration for a key
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await this.client.expire(key, seconds);
      return result;
    } catch (error) {
      logger.error(`Failed to set expiration for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get TTL for a key
   */
  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      logger.error(`Failed to get TTL for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Increment a numeric value
   */
  async incr(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      logger.error(`Failed to increment key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Increment a numeric value by a specific amount
   */
  async incrBy(key: string, increment: number): Promise<number> {
    try {
      return await this.client.incrBy(key, increment);
    } catch (error) {
      logger.error(`Failed to increment key ${key} by ${increment}:`, error);
      throw error;
    }
  }

  /**
   * Decrement a numeric value
   */
  async decr(key: string): Promise<number> {
    try {
      return await this.client.decr(key);
    } catch (error) {
      logger.error(`Failed to decrement key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Decrement a numeric value by a specific amount
   */
  async decrBy(key: string, decrement: number): Promise<number> {
    try {
      return await this.client.decrBy(key, decrement);
    } catch (error) {
      logger.error(`Failed to decrement key ${key} by ${decrement}:`, error);
      throw error;
    }
  }

  /**
   * Set a hash field
   */
  async hSet(key: string, field: string, value: string): Promise<number> {
    try {
      return await this.client.hSet(key, field, value);
    } catch (error) {
      logger.error(`Failed to set hash field ${field} for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get a hash field
   */
  async hGet(key: string, field: string): Promise<string | undefined> {
    try {
      return await this.client.hGet(key, field);
    } catch (error) {
      logger.error(`Failed to get hash field ${field} for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get all hash fields
   */
  async hGetAll(key: string): Promise<Record<string, string>> {
    try {
      return await this.client.hGetAll(key);
    } catch (error) {
      logger.error(`Failed to get all hash fields for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Delete a hash field
   */
  async hDel(key: string, field: string): Promise<number> {
    try {
      return await this.client.hDel(key, field);
    } catch (error) {
      logger.error(`Failed to delete hash field ${field} for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Add to a set
   */
  async sAdd(key: string, member: string): Promise<number> {
    try {
      return await this.client.sAdd(key, member);
    } catch (error) {
      logger.error(`Failed to add member to set ${key}:`, error);
      throw error;
    }
  }

  /**
   * Check if member exists in set
   */
  async sIsMember(key: string, member: string): Promise<boolean> {
    try {
      return await this.client.sIsMember(key, member);
    } catch (error) {
      logger.error(`Failed to check membership in set ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get all members of a set
   */
  async sMembers(key: string): Promise<string[]> {
    try {
      return await this.client.sMembers(key);
    } catch (error) {
      logger.error(`Failed to get members of set ${key}:`, error);
      throw error;
    }
  }

  /**
   * Remove from a set
   */
  async sRem(key: string, member: string): Promise<number> {
    try {
      return await this.client.sRem(key, member);
    } catch (error) {
      logger.error(`Failed to remove member from set ${key}:`, error);
      throw error;
    }
  }

  /**
   * Push to a list
   */
  async lPush(key: string, element: string): Promise<number> {
    try {
      return await this.client.lPush(key, element);
    } catch (error) {
      logger.error(`Failed to push to list ${key}:`, error);
      throw error;
    }
  }

  /**
   * Pop from a list
   */
  async lPop(key: string): Promise<string | null> {
    try {
      return await this.client.lPop(key);
    } catch (error) {
      logger.error(`Failed to pop from list ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get list length
   */
  async lLen(key: string): Promise<number> {
    try {
      return await this.client.lLen(key);
    } catch (error) {
      logger.error(`Failed to get length of list ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get list elements
   */
  async lRange(key: string, start: number, stop: number): Promise<string[]> {
    try {
      return await this.client.lRange(key, start, stop);
    } catch (error) {
      logger.error(`Failed to get range from list ${key}:`, error);
      throw error;
    }
  }

  /**
   * Publish a message to a channel
   */
  async publish(channel: string, message: string): Promise<number> {
    try {
      return await this.client.publish(channel, message);
    } catch (error) {
      logger.error(`Failed to publish to channel ${channel}:`, error);
      throw error;
    }
  }

  /**
   * Subscribe to a channel
   */
  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    try {
      await this.client.subscribe(channel, callback);
    } catch (error) {
      logger.error(`Failed to subscribe to channel ${channel}:`, error);
      throw error;
    }
  }

  /**
   * Unsubscribe from a channel
   */
  async unsubscribe(channel: string): Promise<void> {
    try {
      await this.client.unsubscribe(channel);
    } catch (error) {
      logger.error(`Failed to unsubscribe from channel ${channel}:`, error);
      throw error;
    }
  }

  /**
   * Get Redis info
   */
  async info(): Promise<string> {
    try {
      return await this.client.info();
    } catch (error) {
      logger.error('Failed to get Redis info:', error);
      throw error;
    }
  }

  /**
   * Flush all databases
   */
  async flushAll(): Promise<void> {
    try {
      await this.client.flushAll();
    } catch (error) {
      logger.error('Failed to flush Redis databases:', error);
      throw error;
    }
  }

  /**
   * Get the underlying Redis client
   */
  getClient(): RedisClientType {
    return this.client;
  }
}

// Create singleton instance
const redisClient = new RedisClient();

export default redisClient;