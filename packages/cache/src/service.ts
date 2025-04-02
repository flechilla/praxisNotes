import { Redis } from "@upstash/redis";
import { createRedisClient, RedisError } from "./client";

/**
 * Cache operation options
 */
export type CacheOptions = {
  ttl?: number; // Time to live in seconds
  prefix?: string; // Key prefix for namespace isolation
};

/**
 * Default cache options
 */
const DEFAULT_OPTIONS: CacheOptions = {
  ttl: 3600, // 1 hour default
  prefix: "praxisnotes:",
};

/**
 * Cache service for type-safe Redis operations
 */
export class CacheService {
  private client: Redis;
  private defaultOptions: CacheOptions;

  /**
   * Create a new cache service instance
   * @param options Default options for all cache operations
   */
  constructor(options: CacheOptions = {}) {
    this.client = createRedisClient();
    this.defaultOptions = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Generate a full cache key with prefix
   * @param key The base key
   * @param options Cache options that may contain a prefix
   * @returns Full prefixed key
   */
  private getFullKey(key: string, options?: CacheOptions): string {
    const prefix = options?.prefix || this.defaultOptions.prefix;
    return prefix ? `${prefix}${key}` : key;
  }

  /**
   * Get a value from cache
   * @param key The cache key
   * @param options Cache options
   * @returns The cached value or null if not found
   */
  async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
    try {
      const fullKey = this.getFullKey(key, options);
      const result = await this.client.get<T>(fullKey);
      return result;
    } catch (error) {
      throw new RedisError(`Failed to get value for key: ${key}`, {
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Store a value in cache
   * @param key The cache key
   * @param value The value to store
   * @param options Cache options
   * @returns True if the operation succeeded
   */
  async set<T>(
    key: string,
    value: T,
    options?: CacheOptions,
  ): Promise<boolean> {
    try {
      const fullKey = this.getFullKey(key, options);
      const ttl = options?.ttl || this.defaultOptions.ttl;

      if (ttl) {
        await this.client.setex(fullKey, ttl, value);
      } else {
        await this.client.set(fullKey, value);
      }

      return true;
    } catch (error) {
      throw new RedisError(`Failed to set value for key: ${key}`, {
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Delete a value from cache
   * @param key The cache key
   * @param options Cache options
   * @returns True if the operation succeeded
   */
  async delete(key: string, options?: CacheOptions): Promise<boolean> {
    try {
      const fullKey = this.getFullKey(key, options);
      await this.client.del(fullKey);
      return true;
    } catch (error) {
      throw new RedisError(`Failed to delete key: ${key}`, {
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Check if a key exists in cache
   * @param key The cache key
   * @param options Cache options
   * @returns True if the key exists
   */
  async exists(key: string, options?: CacheOptions): Promise<boolean> {
    try {
      const fullKey = this.getFullKey(key, options);
      const result = await this.client.exists(fullKey);
      return result === 1;
    } catch (error) {
      throw new RedisError(`Failed to check if key exists: ${key}`, {
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Set value only if the key doesn't already exist
   * @param key The cache key
   * @param value The value to store
   * @param options Cache options
   * @returns True if the value was set
   */
  async setNX<T>(
    key: string,
    value: T,
    options?: CacheOptions,
  ): Promise<boolean> {
    try {
      const fullKey = this.getFullKey(key, options);
      const ttl = options?.ttl || this.defaultOptions.ttl;

      // Set only if not exists
      const result = await this.client.setnx(fullKey, value);

      // If set and TTL specified, set expiry
      if (result === 1 && ttl) {
        await this.client.expire(fullKey, ttl);
      }

      return result === 1;
    } catch (error) {
      throw new RedisError(`Failed to set if not exists for key: ${key}`, {
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Retrieve multiple values at once
   * @param keys Array of cache keys
   * @param options Cache options
   * @returns Array of values in the same order as the keys
   */
  async mget<T>(keys: string[], options?: CacheOptions): Promise<(T | null)[]> {
    if (keys.length === 0) {
      return [];
    }

    try {
      const fullKeys = keys.map((key) => this.getFullKey(key, options));
      // Type assertion to ensure the return value is treated as array
      const results = await this.client.mget(...fullKeys);
      // Convert the results to the expected type
      return Array.isArray(results) ? (results as (T | null)[]) : [];
    } catch (error) {
      throw new RedisError(`Failed to get multiple keys: ${keys.join(", ")}`, {
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Clear all keys with a specific prefix
   * @param prefix The prefix to clear
   * @returns Number of keys removed
   */
  async clearByPrefix(prefix: string): Promise<number> {
    try {
      const pattern = `${prefix}*`;
      const keys = await this.client.keys(pattern);

      if (keys.length === 0) {
        return 0;
      }

      const count = await this.client.del(...keys);
      return count;
    } catch (error) {
      throw new RedisError(`Failed to clear keys with prefix: ${prefix}`, {
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
