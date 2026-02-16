/**
 * Core user entity
 */
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
    isEmailVerified: boolean;
    profile: UserProfile;
    preferences: UserPreferences;
}

/**
 * User profile information
 */
export interface UserProfile {
    targetLanguage: string;
    nativeLanguage: string;
    proficiencyLevel: ProficiencyLevel;
    learningGoal?: string;
    dailyGoalMinutes: number;
    streak: number;
    totalXp: number;
    joinedAt: string;
    timezone: string;
}

/**
 * User preferences and settings
 */
export interface UserPreferences {
    theme: "light" | "dark" | "system";
    soundEnabled: boolean;
    notificationsEnabled: boolean;
    dailyReminderTime?: string;
    fontSize: "small" | "medium" | "large";
    autoPlayAudio: boolean;
    showRomanization: boolean;
    difficultyMode: "adaptive" | "fixed";
}

/**
 * CEFR-based proficiency levels
 */
export type ProficiencyLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

/**
 * User stats summary
 */
export interface UserStats {
    wordsLearned: number;
    lessonsCompleted: number;
    quizzesPassed: number;
    totalStudyTime: number;
    currentStreak: number;
    longestStreak: number;
    accuracy: number;
}

/**
 * Profile update request
 */
export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    targetLanguage?: string;
    learningGoal?: string;
    dailyGoalMinutes?: number;
    timezone?: string;
}

/**
 * Preferences update request
 */
export interface UpdatePreferencesRequest extends Partial<UserPreferences> {}
