/**
 * API utility types
 * Common types for API responses, requests, and error handling
 */

import { ApiError } from "./error.type";

/**
 * Base pagination parameters for API requests
 * Note: This extends the existing PaginationParams from response.type.ts
 * with a more consistent naming (page/limit vs page/perPage)
 */
export type ApiPaginationParams = {
  page?: number;
  limit?: number;
};

/**
 * Base sorting parameters for API requests
 */
export type SortParams = {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

/**
 * Base filter parameters for API requests
 */
export type FilterParams = {
  search?: string;
  [key: string]: any;
};

/**
 * Common parameters for API list endpoints
 */
export type ListParams = ApiPaginationParams & SortParams & FilterParams;

/**
 * Pagination metadata for API responses
 */
export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/**
 * Standard API response structure for single entity
 * Enhanced version of ApiResponse from response.type.ts
 */
export type ApiDataResponse<T> = {
  data?: T;
  error?: ApiError;
  meta?: Record<string, any>;
};

/**
 * Standard API response structure for lists of entities
 */
export type ApiListResponse<T> = {
  data?: T[];
  error?: ApiError;
  meta?: PaginationMeta & Record<string, any>;
};

/**
 * Type for API endpoints that return a success/failure status
 */
export type ApiStatusResponse = {
  success: boolean;
  error?: ApiError;
  message?: string;
};
