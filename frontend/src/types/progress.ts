import type { ProficiencyLevel } from "./user";

/**
 * User's overall progress statistics
 */
export interface ProgressStats {
    userId: string;
    language: string;
    currentLevel: ProficiencyLevel;
    totalXp: number;
    xpToNextLevel: number;
    currentStreak: number;
    longestStreak: number;
    totalStudyTime: number;
    averageSessionTime: number;
    wordsLearned: number;
    wordsMastered: number;
    lessonsCompleted: number;
    quizzesPassed: number;
    overallAccuracy: number;
    lastActiveAt: string;
}

/**
 * Achievement/badge earned by user
 */
export interface Achievement {
    id: string;
    name: string;
    description: string;
    iconUrl: string;
    category: AchievementCategory;
    tier: AchievementTier;
    xpReward: number;
    requirement: string;
    progress: number;
    maxProgress: number;
    isUnlocked: boolean;
    unlockedAt?: string;
}

/**
 * Achievement categories
 */
export type AchievementCategory =
    | "streak"
    | "vocabulary"
    | "quiz"
    | "study_time"
    | "accuracy"
    | "social"
    | "special";

/**
 * Achievement tiers
 */
export type AchievementTier = "bronze" | "silver" | "gold" | "platinum";

/**
 * Learning milestone
 */
export interface Milestone {
    id: string;
    title: string;
    description: string;
    type: MilestoneType;
    targetValue: number;
    currentValue: number;
    isCompleted: boolean;
    completedAt?: string;
    xpReward: number;
    iconUrl?: string;
}

/**
 * Types of milestones
 */
export type MilestoneType =
    | "words_learned"
    | "streak_days"
    | "quizzes_passed"
    | "study_hours"
    | "perfect_scores"
    | "level_reached";

/**
 * Daily activity summary
 */
export interface DailyActivity {
    date: string;
    studyTimeMinutes: number;
    wordsLearned: number;
    wordsReviewed: number;
    quizzesCompleted: number;
    xpEarned: number;
    streakMaintained: boolean;
}

/**
 * Weekly progress summary
 */
export interface WeeklyProgress {
    weekStart: string;
    weekEnd: string;
    dailyActivities: DailyActivity[];
    totalStudyTime: number;
    totalWordsLearned: number;
    totalXpEarned: number;
    goalsCompleted: number;
    averageAccuracy: number;
}

/**
 * Learning goal
 */
export interface LearningGoal {
    id: string;
    type: GoalType;
    targetValue: number;
    currentValue: number;
    period: "daily" | "weekly" | "monthly";
    isActive: boolean;
    completedAt?: string;
}

/**
 * Types of learning goals
 */
export type GoalType =
    | "study_time"
    | "words_learned"
    | "quizzes_completed"
    | "xp_earned"
    | "accuracy";

/**
 * Journal entry for achievement diary
 */
export interface JournalEntry {
    id: string;
    date: string;
    title: string;
    content: string;
    achievements: Achievement[];
    milestones: Milestone[];
    stats: {
        wordsLearned: number;
        studyTime: number;
        xpEarned: number;
    };
}
