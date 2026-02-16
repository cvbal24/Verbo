/**
 * Feature-specific auth types
 * Extends shared types with UI-specific concerns
 */

export interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    agreedToTerms: boolean;
}

export interface AuthFormState {
    isSubmitting: boolean;
    error: string | null;
    success: boolean;
}

export interface PasswordStrength {
    score: 0 | 1 | 2 | 3 | 4;
    feedback: string[];
    isStrong: boolean;
}
