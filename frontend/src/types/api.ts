/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

/**
 * API error response structure
 */
export interface ApiError {
    message: string;
    code: string;
    status: number;
    details?: Record<string, string[]>;
}

/**
 * Paginated response for list endpoints
 */
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}

/**
 * Request options for API calls
 */
export interface RequestOptions {
    signal?: AbortSignal;
    headers?: Record<string, string>;
}

/**
 * Sort direction for list queries
 */
export type SortDirection = "asc" | "desc";

/**
 * Common query parameters for list endpoints
 */
export interface ListQueryParams {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: SortDirection;
    search?: string;
}
