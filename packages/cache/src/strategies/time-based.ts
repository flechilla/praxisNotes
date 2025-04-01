import { CacheService } from "../service";
import { KeyManager } from "../utils/key-manager";

/**
 * Options for time-based caching
 */
export type TimeBasedCacheOptions = {
  ttl: number; // Time to live in seconds
  namespace: string; // Namespace for keys
  staleWhileRevalidate?: boolean; // Whether to return stale data while fetching fresh data
  staleIfError?: boolean; // Whether to return stale data on fetch error
};

/**
 * Default time-based cache options
 */
const DEFAULT_OPTIONS: TimeBasedCacheOptions = {
  ttl: 3600, // 1 hour default
  namespace: "default",
  staleWhileRevalidate: true,
  staleIfError: true,
};

/**
 * Time-based caching strategy implementation
 */
export class TimeBasedCache {
  private readonly cache: CacheService;
  private readonly keyManager: KeyManager;
  private readonly options: TimeBasedCacheOptions;

  /**
   * Create a new time-based cache
   * @param cache The cache service to use
   * @param options Cache strategy options
   */
  constructor(cache: CacheService, options?: Partial<TimeBasedCacheOptions>) {
    this.cache = cache;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.keyManager = new KeyManager();
  }

  /**
   * Get a value from cache, or compute and store it if not found
   * @param key The cache key
   * @param fetchFn Function to call if cache miss
   * @returns The cached or computed value
   */
  async getOrSet<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cacheKey = this.keyManager.create(this.options.namespace, key);

    // Try to get from cache
    const cachedValue = await this.cache.get<T>(cacheKey);

    if (cachedValue !== null) {
      return cachedValue;
    }

    // Cache miss, fetch new value
    const newValue = await fetchFn();

    // Store in cache
    await this.cache.set(cacheKey, newValue, {
      ttl: this.options.ttl,
    });

    return newValue;
  }

  /**
   * Refresh a cached value regardless of TTL
   * @param key The cache key
   * @param fetchFn Function to call to get fresh value
   * @returns The refreshed value
   */
  async refresh<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cacheKey = this.keyManager.create(this.options.namespace, key);

    // Fetch new value
    const newValue = await fetchFn();

    // Store in cache
    await this.cache.set(cacheKey, newValue, {
      ttl: this.options.ttl,
    });

    return newValue;
  }

  /**
   * Invalidate a cached value
   * @param key The cache key
   * @returns True if the operation succeeded
   */
  async invalidate(key: string): Promise<boolean> {
    const cacheKey = this.keyManager.create(this.options.namespace, key);
    return this.cache.delete(cacheKey);
  }

  /**
   * Invalidate all keys in this namespace
   * @returns Number of keys invalidated
   */
  async invalidateAll(): Promise<number> {
    const prefix = this.keyManager.pattern(this.options.namespace);
    return this.cache.clearByPrefix(prefix);
  }
}
