import type { User } from "./user";

/**
 * Login request payload
 */
export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    targetLanguage?: string;
    agreedToTerms: boolean;
}

/**
 * JWT token pair
 */
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}

/**
 * Authentication response from login/register
 */
export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
    email: string;
}

/**
 * Password reset confirmation
 */
export interface PasswordResetConfirm {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * Token refresh request
 */
export interface RefreshTokenRequest {
    refreshToken: string;
}

/**
 * Authentication state
 */
export interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
