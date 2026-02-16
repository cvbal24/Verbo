"use client";

import { useState, useEffect, useCallback } from "react";
import { vocabularyService } from "@/services/vocabulary.service";
import { useDebounce } from "@/hooks/useDebounce";
import type {
    Word,
    VocabularyFilters,
    FlashcardProgress,
    VocabularyStats,
    ReviewQuality,
} from "@/types/vocabulary";
import type { ApiError } from "@/types/api";

/**
 * Hook for vocabulary list with search and filters
 */
export function useVocabulary(initialFilters?: VocabularyFilters) {
    const [words, setWords] = useState<Word[]>([]);
    const [filters, setFilters] = useState<VocabularyFilters>(
        initialFilters || {}
    );
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearch = useDebounce(filters.search || "", 300);

    const loadWords = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await vocabularyService.getWords(
                { ...filters, search: debouncedSearch },
                page
            );
            setWords(response.data);
            setTotalPages(response.pagination.totalPages);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || "Failed to load vocabulary");
        } finally {
            setIsLoading(false);
        }
    }, [filters, debouncedSearch, page]);

    useEffect(() => {
        loadWords();
    }, [loadWords]);

    const updateFilters = (newFilters: Partial<VocabularyFilters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setPage(1);
    };

    return {
        words,
        filters,
        page,
        totalPages,
        isLoading,
        error,
        setPage,
        updateFilters,
        refresh: loadWords,
    };
}

/**
 * Hook for vocabulary search
 */
export function useSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Word[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            return;
        }

        async function search() {
            setIsSearching(true);
            try {
                const words = await vocabularyService.searchWords(
                    debouncedQuery
                );
                setResults(words);
            } catch {
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        }

        search();
    }, [debouncedQuery]);

    return {
        query,
        setQuery,
        results,
        isSearching,
        clearSearch: () => {
            setQuery("");
            setResults([]);
        },
    };
}

/**
 * Hook for flashcard review session
 */
export function useFlashcards() {
    const [cards, setCards] = useState<
        { word: Word; progress: FlashcardProgress }[]
    >([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionStats, setSessionStats] = useState({
        correct: 0,
        incorrect: 0,
        reviewed: 0,
    });

    const loadCards = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const dueCards = await vocabularyService.getDueFlashcards();
            setCards(dueCards);
            setCurrentIndex(0);
            setIsFlipped(false);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || "Failed to load flashcards");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCards();
    }, [loadCards]);

    const submitReview = useCallback(
        async (quality: ReviewQuality) => {
            if (currentIndex >= cards.length) return;

            setIsSubmitting(true);
            const currentCard = cards[currentIndex];

            try {
                await vocabularyService.submitReview({
                    wordId: currentCard.word.id,
                    quality,
                    responseTime: 0,
                    reviewedAt: new Date().toISOString(),
                });

                setSessionStats((prev) => ({
                    correct: quality >= 4 ? prev.correct + 1 : prev.correct,
                    incorrect: quality < 4 ? prev.incorrect + 1 : prev.incorrect,
                    reviewed: prev.reviewed + 1,
                }));

                // Move to next card
                if (currentIndex < cards.length - 1) {
                    setCurrentIndex((prev) => prev + 1);
                    setIsFlipped(false);
                }
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message || "Failed to submit review");
            } finally {
                setIsSubmitting(false);
            }
        },
        [currentIndex, cards]
    );

    const flipCard = useCallback(() => {
        setIsFlipped((prev) => !prev);
    }, []);

    return {
        cards,
        currentCard: cards[currentIndex],
        currentIndex,
        totalCards: cards.length,
        isFlipped,
        isLoading,
        isSubmitting,
        error,
        sessionStats,
        isComplete: currentIndex >= cards.length - 1 && sessionStats.reviewed > 0,
        loadCards,
        submitReview,
        flipCard,
    };
}

/**
 * Hook for vocabulary statistics
 */
export function useVocabularyStats() {
    const [stats, setStats] = useState<VocabularyStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadStats() {
            try {
                const data = await vocabularyService.getStats();
                setStats(data);
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message || "Failed to load stats");
            } finally {
                setIsLoading(false);
            }
        }

        loadStats();
    }, []);

    return { stats, isLoading, error };
}
