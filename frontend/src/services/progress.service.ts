import { api, mockDelay, isMockMode } from "./api";
import type {
    ProgressStats,
    Achievement,
    Milestone,
    WeeklyProgress,
    DailyActivity,
    JournalEntry,
} from "@/types/progress";

// Mock data for development
const mockProgressStats: ProgressStats = {
    userId: "mock_user",
    language: "es",
    currentLevel: "A2",
    totalXp: 2450,
    xpToNextLevel: 550,
    currentStreak: 7,
    longestStreak: 14,
    totalStudyTime: 1260, // minutes
    averageSessionTime: 18,
    wordsLearned: 156,
    wordsMastered: 89,
    lessonsCompleted: 24,
    quizzesPassed: 12,
    overallAccuracy: 78,
    lastActiveAt: new Date().toISOString(),
};

const mockAchievements: Achievement[] = [
    {
        id: "ach_1",
        name: "First Steps",
        description: "Complete your first lesson",
        iconUrl: "/achievements/first-steps.svg",
        category: "special",
        tier: "bronze",
        xpReward: 50,
        requirement: "Complete 1 lesson",
        progress: 1,
        maxProgress: 1,
        isUnlocked: true,
        unlockedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
        id: "ach_2",
        name: "Word Collector",
        description: "Learn 100 new words",
        iconUrl: "/achievements/word-collector.svg",
        category: "vocabulary",
        tier: "silver",
        xpReward: 200,
        requirement: "Learn 100 words",
        progress: 156,
        maxProgress: 100,
        isUnlocked: true,
        unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
        id: "ach_3",
        name: "Week Warrior",
        description: "Maintain a 7-day streak",
        iconUrl: "/achievements/week-warrior.svg",
        category: "streak",
        tier: "silver",
        xpReward: 150,
        requirement: "7 day streak",
        progress: 7,
        maxProgress: 7,
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
    },
    {
        id: "ach_4",
        name: "Quiz Master",
        description: "Pass 25 quizzes",
        iconUrl: "/achievements/quiz-master.svg",
        category: "quiz",
        tier: "gold",
        xpReward: 300,
        requirement: "Pass 25 quizzes",
        progress: 12,
        maxProgress: 25,
        isUnlocked: false,
    },
];

const mockMilestones: Milestone[] = [
    {
        id: "ms_1",
        title: "First 50 Words",
        description: "Learn your first 50 vocabulary words",
        type: "words_learned",
        targetValue: 50,
        currentValue: 50,
        isCompleted: true,
        completedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        xpReward: 100,
    },
    {
        id: "ms_2",
        title: "Consistent Learner",
        description: "Study for 5 consecutive days",
        type: "streak_days",
        targetValue: 5,
        currentValue: 5,
        isCompleted: true,
        completedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        xpReward: 75,
    },
    {
        id: "ms_3",
        title: "Study Hour",
        description: "Accumulate 10 hours of study time",
        type: "study_hours",
        targetValue: 600,
        currentValue: 1260,
        isCompleted: true,
        completedAt: new Date(Date.now() - 86400000).toISOString(),
        xpReward: 150,
    },
];

export const progressService = {
    /**
     * Get user's progress overview
     */
    async getOverview(): Promise<ProgressStats> {
        if (isMockMode()) {
            await mockDelay(600);
            return mockProgressStats;
        }

        const response = await api.get<ProgressStats>("/progress/overview");
        return response.data;
    },

    /**
     * Get user's achievements
     */
    async getAchievements(): Promise<Achievement[]> {
        if (isMockMode()) {
            await mockDelay(500);
            return mockAchievements;
        }

        const response = await api.get<Achievement[]>("/progress/achievements");
        return response.data;
    },

    /**
     * Get user's milestones
     */
    async getMilestones(): Promise<Milestone[]> {
        if (isMockMode()) {
            await mockDelay(500);
            return mockMilestones;
        }

        const response = await api.get<Milestone[]>("/progress/milestones");
        return response.data;
    },

    /**
     * Get weekly progress summary
     */
    async getWeeklyProgress(): Promise<WeeklyProgress> {
        if (isMockMode()) {
            await mockDelay(600);

            const today = new Date();
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());

            const dailyActivities: DailyActivity[] = Array.from(
                { length: 7 },
                (_, i) => {
                    const date = new Date(weekStart);
                    date.setDate(weekStart.getDate() + i);
                    const isPast = date <= today;

                    return {
                        date: date.toISOString().split("T")[0],
                        studyTimeMinutes: isPast
                            ? Math.floor(Math.random() * 30) + 10
                            : 0,
                        wordsLearned: isPast
                            ? Math.floor(Math.random() * 15) + 5
                            : 0,
                        wordsReviewed: isPast
                            ? Math.floor(Math.random() * 25) + 10
                            : 0,
                        quizzesCompleted: isPast
                            ? Math.floor(Math.random() * 3)
                            : 0,
                        xpEarned: isPast
                            ? Math.floor(Math.random() * 150) + 50
                            : 0,
                        streakMaintained: isPast,
                    };
                }
            );

            return {
                weekStart: weekStart.toISOString(),
                weekEnd: today.toISOString(),
                dailyActivities,
                totalStudyTime: dailyActivities.reduce(
                    (sum, d) => sum + d.studyTimeMinutes,
                    0
                ),
                totalWordsLearned: dailyActivities.reduce(
                    (sum, d) => sum + d.wordsLearned,
                    0
                ),
                totalXpEarned: dailyActivities.reduce(
                    (sum, d) => sum + d.xpEarned,
                    0
                ),
                goalsCompleted: 5,
                averageAccuracy: 78,
            };
        }

        const response = await api.get<WeeklyProgress>("/progress/weekly");
        return response.data;
    },

    /**
     * Get achievement journal entries
     */
    async getJournal(): Promise<JournalEntry[]> {
        if (isMockMode()) {
            await mockDelay(500);
            return [
                {
                    id: "journal_1",
                    date: new Date().toISOString(),
                    title: "Great progress today!",
                    content: "Learned 15 new words and passed 2 quizzes.",
                    achievements: [mockAchievements[2]],
                    milestones: [],
                    stats: {
                        wordsLearned: 15,
                        studyTime: 25,
                        xpEarned: 175,
                    },
                },
            ];
        }

        const response = await api.get<JournalEntry[]>("/progress/journal");
        return response.data;
    },
};

export default progressService;
