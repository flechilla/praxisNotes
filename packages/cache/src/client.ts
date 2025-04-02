import { Redis } from "@upstash/redis";
import { ErrorCode } from "@praxisnotes/types";

/**
 * Configuration for the Redis client
 */
export type RedisConfig = {
  url?: string | undefined;
  token?: string | undefined;
  retry?:
    | {
        retries?: number | undefined;
      }
    | undefined;
};

/**
 * Error thrown when Redis operations fail
 */
export class RedisError extends Error {
  code: string;
  details: Record<string, unknown>;

  constructor(message: string, details?: Record<string, unknown> | undefined) {
    super(message);
    this.name = "RedisError";
    this.code = ErrorCode.CACHE_ERROR;
    this.details = details || {};
  }
}

/**
 * Default Redis configuration
 */
const defaultConfig: RedisConfig = {
  retry: {
    retries: 3,
  },
};

/**
 * Create a Redis client instance
 * @param config Redis configuration options
 * @returns Redis client instance
 */
export function createRedisClient(config?: RedisConfig | undefined): Redis {
  // Merge provided config with defaults
  const finalConfig = { ...defaultConfig, ...config };

  try {
    // Get credentials from env vars or config
    const url = finalConfig.url || process.env.UPSTASH_REDIS_REST_URL;
    const token = finalConfig.token || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url) {
      throw new RedisError(
        "Redis connection URL is required. Provide it in the config or set UPSTASH_REDIS_REST_URL environment variable.",
      );
    }

    if (!token) {
      throw new RedisError(
        "Redis connection token is required. Provide it in the config or set UPSTASH_REDIS_REST_TOKEN environment variable.",
      );
    }

    // Create and return the Redis client
    // We're modifying this to make the Redis constructor happy
    const redisConfig: {
      url: string;
      token: string;
      retry?: { retries: number };
    } = {
      url,
      token,
    };

    // Only add retry if it's defined
    if (finalConfig.retry?.retries !== undefined) {
      redisConfig.retry = { retries: finalConfig.retry.retries };
    }

    return new Redis(redisConfig);
  } catch (error) {
    throw new RedisError("Failed to create Redis client", {
      originalError: error instanceof Error ? error.message : String(error),
    });
  }
}
