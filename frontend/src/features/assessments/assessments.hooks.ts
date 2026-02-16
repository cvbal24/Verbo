"use client";

import { useState, useEffect, useCallback } from "react";
import { assessmentsService } from "@/services/assessments.service";
import type {
    Quiz,
    Question,
    Answer,
    QuizResult,
    QuizHistory,
} from "@/types/assessment";
import type { ApiError } from "@/types/api";

/**
 * Hook for loading available quizzes
 */
export function useQuizzes() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadQuizzes() {
            try {
                const data = await assessmentsService.getQuizzes();
                setQuizzes(data);
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message || "Failed to load quizzes");
            } finally {
                setIsLoading(false);
            }
        }

        loadQuizzes();
    }, []);

    return { quizzes, isLoading, error };
}

/**
 * Hook for taking a quiz
 */
export function useQuiz(quizId: string) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [attemptId, setAttemptId] = useState<string | null>(null);
    const [result, setResult] = useState<QuizResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{
        isCorrect: boolean;
        correctAnswer: string;
        explanation?: string;
    } | null>(null);

    // Load quiz data
    useEffect(() => {
        async function loadQuiz() {
            try {
                const quizData = await assessmentsService.getQuiz(quizId);
                setQuiz(quizData);

                // Start the quiz attempt
                const { attemptId: id, questions: qs } =
                    await assessmentsService.startQuiz(quizId);
                setAttemptId(id);
                setQuestions(qs);
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message || "Failed to load quiz");
            } finally {
                setIsLoading(false);
            }
        }

        loadQuiz();
    }, [quizId]);

    const currentQuestion = questions[currentIndex];

    const submitAnswer = useCallback(
        async (selectedAnswer: string) => {
            if (!attemptId || !currentQuestion) return;

            setIsSubmitting(true);
            setFeedback(null);

            try {
                const startTime = Date.now();
                const response = await assessmentsService.submitAnswer(
                    attemptId,
                    currentQuestion.id,
                    selectedAnswer
                );

                setFeedback(response);

                const answer: Answer = {
                    questionId: currentQuestion.id,
                    selectedAnswer,
                    isCorrect: response.isCorrect,
                    timeSpent: Date.now() - startTime,
                    submittedAt: new Date().toISOString(),
                };

                setAnswers((prev) => [...prev, answer]);
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message || "Failed to submit answer");
            } finally {
                setIsSubmitting(false);
            }
        },
        [attemptId, currentQuestion]
    );

    const nextQuestion = useCallback(() => {
        setFeedback(null);
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    }, [currentIndex, questions.length]);

    const completeQuiz = useCallback(async () => {
        if (!attemptId) return;

        setIsSubmitting(true);

        try {
            const quizResult = await assessmentsService.completeQuiz(
                attemptId,
                answers
            );
            setResult(quizResult);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || "Failed to complete quiz");
        } finally {
            setIsSubmitting(false);
        }
    }, [attemptId, answers]);

    return {
        quiz,
        questions,
        currentQuestion,
        currentIndex,
        totalQuestions: questions.length,
        answers,
        result,
        feedback,
        isLoading,
        isSubmitting,
        error,
        isLastQuestion: currentIndex === questions.length - 1,
        hasAnswered: answers.some(
            (a) => a.questionId === currentQuestion?.id
        ),
        submitAnswer,
        nextQuestion,
        completeQuiz,
    };
}

/**
 * Hook for quiz history
 */
export function useQuizHistory() {
    const [history, setHistory] = useState<QuizHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadHistory() {
            try {
                const data = await assessmentsService.getHistory();
                setHistory(data);
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message || "Failed to load history");
            } finally {
                setIsLoading(false);
            }
        }

        loadHistory();
    }, []);

    return { history, isLoading, error };
}
