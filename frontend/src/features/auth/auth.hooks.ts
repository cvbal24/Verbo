"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";
import type { LoginFormData, RegisterFormData } from "./auth.types";
import type { ApiError } from "@/types/api";

/**
 * Hook for handling login
 */
export function useLogin() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = useCallback(
        async (data: LoginFormData) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await authService.login({
                    email: data.email,
                    password: data.password,
                    rememberMe: data.rememberMe,
                });

                login(response.user, response.tokens);
                router.push(ROUTES.DASHBOARD.ROOT);
            } catch (err) {
                const apiError = err as ApiError;
                setError(
                    apiError.message || "Failed to login. Please try again."
                );
            } finally {
                setIsLoading(false);
            }
        },
        [login, router]
    );

    return {
        login: handleLogin,
        isLoading,
        error,
        clearError: () => setError(null),
    };
}

/**
 * Hook for handling registration
 */
export function useRegister() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = useCallback(
        async (data: RegisterFormData) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await authService.register({
                    email: data.email,
                    password: data.password,
                    confirmPassword: data.confirmPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    agreedToTerms: data.agreedToTerms,
                });

                login(response.user, response.tokens);
                router.push(ROUTES.ONBOARDING.LANGUAGE);
            } catch (err) {
                const apiError = err as ApiError;
                setError(
                    apiError.message ||
                        "Failed to create account. Please try again."
                );
            } finally {
                setIsLoading(false);
            }
        },
        [login, router]
    );

    return {
        register: handleRegister,
        isLoading,
        error,
        clearError: () => setError(null),
    };
}

/**
 * Hook for handling logout
 */
export function useLogout() {
    const router = useRouter();
    const { logout } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = useCallback(async () => {
        setIsLoading(true);

        try {
            await authService.logout();
        } catch {
            // Logout even if API call fails
        } finally {
            logout();
            router.push(ROUTES.AUTH.LOGIN);
            setIsLoading(false);
        }
    }, [logout, router]);

    return {
        logout: handleLogout,
        isLoading,
    };
}

/**
 * Hook for password strength validation
 */
export function usePasswordStrength(password: string) {
    const getStrength = useCallback((pwd: string) => {
        let score = 0;
        const feedback: string[] = [];

        if (pwd.length >= 8) {
            score++;
        } else {
            feedback.push("Use at least 8 characters");
        }

        if (/[A-Z]/.test(pwd)) {
            score++;
        } else {
            feedback.push("Add an uppercase letter");
        }

        if (/[a-z]/.test(pwd)) {
            score++;
        } else {
            feedback.push("Add a lowercase letter");
        }

        if (/[0-9]/.test(pwd)) {
            score++;
        } else {
            feedback.push("Add a number");
        }

        if (/[^A-Za-z0-9]/.test(pwd)) {
            score++;
        } else if (score === 4) {
            feedback.push("Add a special character for extra security");
        }

        return {
            score: Math.min(score, 4) as 0 | 1 | 2 | 3 | 4,
            feedback,
            isStrong: score >= 4,
        };
    }, []);

    return getStrength(password);
}
