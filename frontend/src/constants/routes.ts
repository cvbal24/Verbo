/**
 * Application route constants
 * Centralized routing to prevent hardcoded strings
 */
export const ROUTES = {
    // Public routes
    HOME: "/",

    // Auth routes
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        FORGOT_PASSWORD: "/auth/forgot-password",
        RESET_PASSWORD: "/auth/reset-password",
    },

    // Onboarding routes
    ONBOARDING: {
        ROOT: "/onboarding",
        LANGUAGE: "/onboarding/language",
        PLACEMENT_TEST: "/onboarding/placement-test",
    },

    // Dashboard routes
    DASHBOARD: {
        ROOT: "/dashboard",
        VOCABULARY: "/dashboard/vocabulary",
        FLASHCARDS: "/dashboard/flashcards",
        ASSESSMENTS: "/dashboard/assessments",
        PROGRESS: "/dashboard/progress",
        DIALOG_MISSIONS: "/dashboard/dialog-missions",
        AI_CHAT: "/dashboard/ai-chat",
        MISTAKES: "/dashboard/mistakes",
        SETTINGS: "/dashboard/settings",
    },
} as const;

/**
 * Routes that require authentication
 */
export const PROTECTED_ROUTES = [
    ROUTES.DASHBOARD.ROOT,
    ROUTES.DASHBOARD.VOCABULARY,
    ROUTES.DASHBOARD.FLASHCARDS,
    ROUTES.DASHBOARD.ASSESSMENTS,
    ROUTES.DASHBOARD.PROGRESS,
    ROUTES.DASHBOARD.DIALOG_MISSIONS,
    ROUTES.DASHBOARD.AI_CHAT,
    ROUTES.DASHBOARD.MISTAKES,
    ROUTES.DASHBOARD.SETTINGS,
] as const;

/**
 * Routes accessible only to unauthenticated users
 */
export const AUTH_ROUTES = [
    ROUTES.AUTH.LOGIN,
    ROUTES.AUTH.REGISTER,
    ROUTES.AUTH.FORGOT_PASSWORD,
    ROUTES.AUTH.RESET_PASSWORD,
] as const;

/**
 * Routes for onboarding flow
 */
export const ONBOARDING_ROUTES = [
    ROUTES.ONBOARDING.LANGUAGE,
    ROUTES.ONBOARDING.PLACEMENT_TEST,
] as const;

/**
 * Default redirect after login
 */
export const DEFAULT_LOGIN_REDIRECT = ROUTES.DASHBOARD.ROOT;

/**
 * Redirect for unauthenticated users
 */
export const DEFAULT_AUTH_REDIRECT = ROUTES.AUTH.LOGIN;
