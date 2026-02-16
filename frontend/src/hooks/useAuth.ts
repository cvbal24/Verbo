"use client";

import { useAuthStore } from "@/store/auth.store";

/**
 * Hook for accessing authentication state and actions
 * This is a convenience wrapper around the auth store
 */
export function useAuth() {
    const {
        user,
        tokens,
        isAuthenticated,
        isLoading,
        login,
        logout,
        setUser,
        updateUser,
    } = useAuthStore();

    return {
        user,
        tokens,
        isAuthenticated,
        isLoading,
        login,
        logout,
        setUser,
        updateUser,
    };
}

/**
 * Hook that returns only the current user
 */
export function useCurrentUser() {
    return useAuthStore((state) => state.user);
}

/**
 * Hook that returns authentication status
 */
export function useIsAuthenticated() {
    return useAuthStore((state) => state.isAuthenticated);
}
