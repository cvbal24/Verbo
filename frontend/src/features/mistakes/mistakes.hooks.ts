"use client";

import { useState, useCallback, useEffect } from "react";
import { mistakesService } from "@/services/mistakes.service";
import type { Mistake, MistakeFilters } from "@/services/mistakes.service";

export function useMistakes(initialFilters?: MistakeFilters) {
    const [mistakes, setMistakes] = useState<Mistake[]>([]);
    const [filters, setFilters] = useState<MistakeFilters>(initialFilters || {});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async (f: MistakeFilters) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await mistakesService.getMistakes(f);
            setMistakes(data);
        } catch {
            setError("Failed to load mistakes");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        load(filters);
    }, [filters, load]);

    const updateFilters = useCallback((newFilters: Partial<MistakeFilters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    }, []);

    return { mistakes, filters, isLoading, error, updateFilters, reload: () => load(filters) };
}

export function useMistakeStats() {
    const [stats, setStats] = useState<{
        total: number;
        resolved: number;
        byType: Record<Mistake["type"], number>;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await mistakesService.getStats();
                setStats(data);
            } catch {
                // silently fail for stats
            } finally {
                setIsLoading(false);
            }
        };
        loadStats();
    }, []);

    return { stats, isLoading };
}

export function useReviewMistake() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const markReviewed = useCallback(async (id: string) => {
        setIsSubmitting(true);
        try {
            const updated = await mistakesService.markReviewed(id);
            return updated;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    const markResolved = useCallback(async (id: string) => {
        setIsSubmitting(true);
        try {
            const updated = await mistakesService.markResolved(id);
            return updated;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    return { markReviewed, markResolved, isSubmitting };
}
