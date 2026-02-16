"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/onboarding.store";
import { useAuthStore } from "@/store/auth.store";
import { onboardingService } from "@/services/onboarding.service";
import { ROUTES } from "@/constants/routes";
import type { PlacementTestResult, Question } from "@/types/assessment";
import type { ApiError } from "@/types/api";

/**
 * Hook for language selection step
 */
export function useLanguageSelect() {
    const router = useRouter();
    const { selectLanguage, completeStep, setStep } = useOnboardingStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSelectLanguage = useCallback(
        async (languageCode: string) => {
            setIsLoading(true);
            setError(null);

            try {
                await onboardingService.selectLanguage(languageCode);
                selectLanguage(languageCode);
                completeStep("language_selection");
                setStep("placement_test");
                router.push(ROUTES.ONBOARDING.PLACEMENT_TEST);
            } catch (err) {
                const apiError = err as ApiError;
                setError(
                    apiError.message || "Failed to select language. Please try again."
                );
            } finally {
                setIsLoading(false);
            }
        },
        [selectLanguage, completeStep, setStep, router]
    );

    return {
        selectLanguage: handleSelectLanguage,
        isLoading,
        error,
    };
}

/**
 * Hook for placement test
 */
export function usePlacementTest() {
    const router = useRouter();
    const { selectedLanguage, setProficiencyLevel, completeStep, completeOnboarding } =
        useOnboardingStore();
    const { updateUser } = useAuthStore();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<
        { questionId: string; answer: string }[]
    >([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<PlacementTestResult | null>(null);

    const loadQuestions = useCallback(async () => {
        if (!selectedLanguage) return;

        setIsLoading(true);
        setError(null);

        try {
            const testQuestions = await onboardingService.getPlacementTest(
                selectedLanguage
            );
            setQuestions(testQuestions);
        } catch (err) {
            const apiError = err as ApiError;
            setError(
                apiError.message || "Failed to load test. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    }, [selectedLanguage]);

    const submitAnswer = useCallback(
        (questionId: string, answer: string) => {
            setAnswers((prev) => [...prev, { questionId, answer }]);

            if (currentIndex < questions.length - 1) {
                setCurrentIndex((prev) => prev + 1);
            }
        },
        [currentIndex, questions.length]
    );

    const submitTest = useCallback(async () => {
        if (!selectedLanguage) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const testResult = await onboardingService.submitPlacementTest(
                selectedLanguage,
                answers
            );

            setResult(testResult);
            setProficiencyLevel(testResult.recommendedLevel);
            completeStep("placement_test");

            // Update user profile with new level
            updateUser({
                profile: {
                    targetLanguage: selectedLanguage,
                    nativeLanguage: "en",
                    proficiencyLevel: testResult.recommendedLevel,
                    dailyGoalMinutes: 15,
                    streak: 0,
                    totalXp: 0,
                    joinedAt: new Date().toISOString(),
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
            } as never);
        } catch (err) {
            const apiError = err as ApiError;
            setError(
                apiError.message || "Failed to submit test. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedLanguage, answers, setProficiencyLevel, completeStep, updateUser]);

    const skipTest = useCallback(async () => {
        if (!selectedLanguage) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const testResult = await onboardingService.skipPlacementTest(
                selectedLanguage
            );

            setResult(testResult);
            setProficiencyLevel(testResult.recommendedLevel);
            completeStep("placement_test");
        } catch (err) {
            const apiError = err as ApiError;
            setError(
                apiError.message || "Failed to skip test. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedLanguage, setProficiencyLevel, completeStep]);

    const finishOnboarding = useCallback(async () => {
        setIsLoading(true);

        try {
            await onboardingService.completeOnboarding();
            completeOnboarding();
            router.push(ROUTES.DASHBOARD.ROOT);
        } catch {
            // Continue to dashboard even if API fails
            completeOnboarding();
            router.push(ROUTES.DASHBOARD.ROOT);
        } finally {
            setIsLoading(false);
        }
    }, [completeOnboarding, router]);

    return {
        questions,
        currentQuestion: questions[currentIndex],
        currentIndex,
        totalQuestions: questions.length,
        answers,
        result,
        isLoading,
        isSubmitting,
        error,
        isComplete: currentIndex >= questions.length - 1 && answers.length === questions.length,
        loadQuestions,
        submitAnswer,
        submitTest,
        skipTest,
        finishOnboarding,
    };
}
