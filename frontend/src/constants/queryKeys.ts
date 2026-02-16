/**
 * React Query cache keys
 * Centralized key management for consistent cache invalidation
 */
export const QUERY_KEYS = {
    // Auth
    AUTH: {
        USER: ["auth", "user"] as const,
        SESSION: ["auth", "session"] as const,
    },

    // User
    USER: {
        PROFILE: ["user", "profile"] as const,
        PREFERENCES: ["user", "preferences"] as const,
        STATS: ["user", "stats"] as const,
    },

    // Vocabulary
    VOCABULARY: {
        ALL: ["vocabulary"] as const,
        LIST: (filters?: Record<string, unknown>) =>
            ["vocabulary", "list", filters] as const,
        WORD: (id: string) => ["vocabulary", "word", id] as const,
        SETS: ["vocabulary", "sets"] as const,
        SET: (id: string) => ["vocabulary", "set", id] as const,
        STATS: ["vocabulary", "stats"] as const,
    },

    // Flashcards
    FLASHCARDS: {
        DUE: ["flashcards", "due"] as const,
        PROGRESS: (wordId: string) =>
            ["flashcards", "progress", wordId] as const,
        SESSION: ["flashcards", "session"] as const,
    },

    // Assessments
    ASSESSMENTS: {
        ALL: ["assessments"] as const,
        LIST: (filters?: Record<string, unknown>) =>
            ["assessments", "list", filters] as const,
        QUIZ: (id: string) => ["assessments", "quiz", id] as const,
        HISTORY: ["assessments", "history"] as const,
        RESULT: (id: string) => ["assessments", "result", id] as const,
    },

    // Progress
    PROGRESS: {
        OVERVIEW: ["progress", "overview"] as const,
        STATS: ["progress", "stats"] as const,
        ACHIEVEMENTS: ["progress", "achievements"] as const,
        MILESTONES: ["progress", "milestones"] as const,
        WEEKLY: ["progress", "weekly"] as const,
        DAILY: (date: string) => ["progress", "daily", date] as const,
        JOURNAL: ["progress", "journal"] as const,
    },

    // AI Chat
    AI: {
        CONVERSATIONS: ["ai", "conversations"] as const,
        CONVERSATION: (id: string) => ["ai", "conversation", id] as const,
        MESSAGES: (conversationId: string) =>
            ["ai", "messages", conversationId] as const,
    },

    // Mistakes
    MISTAKES: {
        ALL: ["mistakes"] as const,
        LIST: (filters?: Record<string, unknown>) =>
            ["mistakes", "list", filters] as const,
        MISTAKE: (id: string) => ["mistakes", "mistake", id] as const,
    },

    // Onboarding
    ONBOARDING: {
        STATUS: ["onboarding", "status"] as const,
        PLACEMENT_TEST: ["onboarding", "placement-test"] as const,
    },
} as const;

/**
 * Helper to invalidate all keys in a category
 */
export function getInvalidationKeys(
    category: keyof typeof QUERY_KEYS
): readonly string[] {
    const keys = QUERY_KEYS[category];
    if (Array.isArray(keys)) {
        return keys;
    }
    // Return the first key array from the category object
    const firstKey = Object.values(keys)[0];
    return Array.isArray(firstKey) ? firstKey : [];
}
