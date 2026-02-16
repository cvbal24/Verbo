import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, AuthTokens } from "@/types";

interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isHydrated: boolean;
}

interface AuthActions {
    login: (user: User, tokens: AuthTokens) => void;
    logout: () => void;
    setUser: (user: User) => void;
    updateUser: (updates: Partial<User>) => void;
    setTokens: (tokens: AuthTokens) => void;
    setLoading: (isLoading: boolean) => void;
    setHydrated: (hydrated: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: true,
    isHydrated: false,
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            login: (user, tokens) => {
                set({
                    user,
                    tokens,
                    isAuthenticated: true,
                    isLoading: false,
                });
            },

            logout: () => {
                set({
                    user: null,
                    tokens: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            },

            setUser: (user) => {
                set({ user, isAuthenticated: true });
            },

            updateUser: (updates) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({
                        user: { ...currentUser, ...updates },
                    });
                }
            },

            setTokens: (tokens) => {
                set({ tokens });
            },

            setLoading: (isLoading) => {
                set({ isLoading });
            },

            setHydrated: (hydrated) => {
                set({ isHydrated: hydrated });
            },
        }),
        {
            name: "verbo-auth",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                tokens: state.tokens,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true);
                state?.setLoading(false);
            },
        }
    )
);

// Selector hooks for optimized re-renders
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
    useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
