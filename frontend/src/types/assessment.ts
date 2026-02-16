import type { ProficiencyLevel } from "./user";

/**
 * Quiz/assessment entity
 */
export interface Quiz {
    id: string;
    title: string;
    description: string;
    type: QuizType;
    difficulty: ProficiencyLevel;
    language: string;
    questionCount: number;
    timeLimit?: number;
    passingScore: number;
    questions: Question[];
    category: string;
    createdAt: string;
}

/**
 * Types of quizzes available
 */
export type QuizType =
    | "vocabulary"
    | "grammar"
    | "listening"
    | "reading"
    | "placement"
    | "review";

/**
 * A quiz question
 */
export interface Question {
    id: string;
    quizId: string;
    type: QuestionType;
    prompt: string;
    promptAudioUrl?: string;
    promptImageUrl?: string;
    options: QuestionOption[];
    correctAnswer: string | string[];
    explanation?: string;
    hints?: string[];
    points: number;
    timeLimit?: number;
    order: number;
}

/**
 * Types of questions
 */
export type QuestionType =
    | "multiple_choice"
    | "true_false"
    | "fill_blank"
    | "matching"
    | "audio_response"
    | "typing"
    | "ordering";

/**
 * Question option for multiple choice
 */
export interface QuestionOption {
    id: string;
    text: string;
    audioUrl?: string;
    imageUrl?: string;
}

/**
 * User's answer to a question
 */
export interface Answer {
    questionId: string;
    selectedAnswer: string | string[];
    isCorrect: boolean;
    timeSpent: number;
    submittedAt: string;
}

/**
 * Result of a completed quiz
 */
export interface QuizResult {
    id: string;
    quizId: string;
    userId: string;
    score: number;
    totalPoints: number;
    percentage: number;
    passed: boolean;
    timeSpent: number;
    answers: Answer[];
    correctCount: number;
    incorrectCount: number;
    xpEarned: number;
    completedAt: string;
    feedback?: string;
}

/**
 * Quiz attempt state during an active quiz
 */
export interface QuizAttempt {
    quizId: string;
    currentQuestionIndex: number;
    answers: Answer[];
    startedAt: string;
    timeRemaining?: number;
}

/**
 * Quiz history entry
 */
export interface QuizHistory {
    quizId: string;
    quizTitle: string;
    attempts: number;
    bestScore: number;
    lastAttemptAt: string;
    averageScore: number;
}

/**
 * Placement test result
 */
export interface PlacementTestResult {
    userId: string;
    language: string;
    recommendedLevel: ProficiencyLevel;
    score: number;
    strengths: string[];
    areasToImprove: string[];
    completedAt: string;
}
