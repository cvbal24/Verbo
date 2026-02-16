"use client";

import { useState, useEffect, useCallback } from "react";
import { progressService } from "@/services/progress.service";
import type {
    ProgressStats,
    Achievement,
    Milestone,
    WeeklyProgress,
    JournalEntry,
} from "@/types/progress";
import type { ApiError } from "@/types/api";

/**
 * Hook for loading user progress overview
 */
export function useProgress() {
    const [stats, setStats] = useState<ProgressStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProgress = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await progressService.getOverview();
            setStats(data);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || "Failed to load progress");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProgress();
    }, [loadProgress]);

    return { stats, isLoading, error, refresh: loadProgress };
}

/**
 * Hook for loading achievements
 */
export function useAchievements() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadAchievements() {
            try {
                const data = await progressService.getAchievements();
                setAchievements(data);
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message || "Failed to load achievements");
            } finally {
                setIsLoading(false);
            }
        }

        loadAchievements();
    }, []);

    const unlockedAchievements = achievements.filter((a) => a.isUnlocked);
    const lockedAchievements = achievements.filter((a) => !a.isUnlocked);

    return {
        achievements,
        unlockedAchievements,
        lockedAchievements,
        isLoading,
        error,
    };
}

/**
 * Hook for loading milestones
 */
export function useMilestones() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadMilestones() {
            try {
                const data = await progressService.getMilestones();
                setMilestones(data);
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message || "Failed to load milestones");
            } finally {
                setIsLoading(false);
            }
        }

        loadMilestones();
    }, []);

    const completedMilestones = milestones.filter((m) => m.isCompleted);
    const pendingMilestones = milestones.filter((m) => !m.isCompleted);

    return {
        milestones,
        completedMilestones,
        pendingMilestones,
        isLoading,
        error,
    };
}

/**
 * Hook for weekly progress data
 */
export function useWeeklyProgress() {
    const [weekly, setWeekly] = useState<WeeklyProgress | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadWeekly() {
            try {
                const data = await progressService.getWeeklyProgress();
                setWeekly(data);
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message || "Failed to load weekly progress");
            } finally {
                setIsLoading(false);
            }
        }

        loadWeekly();
    }, []);

    return { weekly, isLoading, error };
}

/**
 * Hook for achievement journal
 */
export function useJournal() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadJournal() {
            try {
                const data = await progressService.getJournal();
                setEntries(data);
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message || "Failed to load journal");
            } finally {
                setIsLoading(false);
            }
        }

        loadJournal();
    }, []);

    return { entries, isLoading, error };
}
