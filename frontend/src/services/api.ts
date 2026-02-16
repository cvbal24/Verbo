import type { ApiResponse, ApiError } from "@/types/api";

/**
 * API configuration
 */
const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    timeout: 30000,
    mockMode: process.env.NEXT_PUBLIC_MOCK_API === "true",
};

/**
 * Storage keys for auth tokens
 */
const STORAGE_KEYS = {
    ACCESS_TOKEN: "verbo_access_token",
    REFRESH_TOKEN: "verbo_refresh_token",
};

/**
 * Get stored access token
 */
function getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

/**
 * Set auth tokens in storage
 */
export function setAuthTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
}

/**
 * Clear auth tokens from storage
 */
export function clearAuthTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Get stored refresh token
 */
export function getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Build request headers
 */
function buildHeaders(customHeaders?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...customHeaders,
    };

    const token = getAccessToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
}

/**
 * Parse API error response
 */
async function parseError(response: Response): Promise<ApiError> {
    try {
        const data = await response.json();
        return {
            message: data.message || data.detail || "An error occurred",
            code: data.code || "UNKNOWN_ERROR",
            status: response.status,
            details: data.errors || data.details,
        };
    } catch {
        return {
            message: response.statusText || "An error occurred",
            code: "PARSE_ERROR",
            status: response.status,
        };
    }
}

/**
 * Core fetch wrapper with error handling
 */
async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = `${API_CONFIG.baseUrl}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(
        () => controller.abort(),
        API_CONFIG.timeout
    );

    try {
        const response = await fetch(url, {
            ...options,
            headers: buildHeaders(options.headers as Record<string, string>),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const error = await parseError(response);
            throw error;
        }

        const data = await response.json();
        return {
            data: data.data ?? data,
            success: true,
            message: data.message,
        };
    } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof DOMException && error.name === "AbortError") {
            throw {
                message: "Request timed out",
                code: "TIMEOUT",
                status: 408,
            } as ApiError;
        }

        if ((error as ApiError).status) {
            throw error;
        }

        throw {
            message: "Network error",
            code: "NETWORK_ERROR",
            status: 0,
        } as ApiError;
    }
}

/**
 * API client with HTTP methods
 */
export const api = {
    get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
        return request<T>(endpoint, { ...options, method: "GET" });
    },

    post<T>(
        endpoint: string,
        body?: unknown,
        options?: RequestInit
    ): Promise<ApiResponse<T>> {
        return request<T>(endpoint, {
            ...options,
            method: "POST",
            body: body ? JSON.stringify(body) : undefined,
        });
    },

    put<T>(
        endpoint: string,
        body?: unknown,
        options?: RequestInit
    ): Promise<ApiResponse<T>> {
        return request<T>(endpoint, {
            ...options,
            method: "PUT",
            body: body ? JSON.stringify(body) : undefined,
        });
    },

    patch<T>(
        endpoint: string,
        body?: unknown,
        options?: RequestInit
    ): Promise<ApiResponse<T>> {
        return request<T>(endpoint, {
            ...options,
            method: "PATCH",
            body: body ? JSON.stringify(body) : undefined,
        });
    },

    delete<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<ApiResponse<T>> {
        return request<T>(endpoint, { ...options, method: "DELETE" });
    },
};

/**
 * Check if mock mode is enabled
 */
export function isMockMode(): boolean {
    return API_CONFIG.mockMode;
}

/**
 * Simulate API delay for mock responses
 */
export function mockDelay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a successful mock response
 */
export function mockResponse<T>(data: T, message?: string): ApiResponse<T> {
    return {
        data,
        success: true,
        message,
    };
}

export default api;
