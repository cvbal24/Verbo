"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { Question } from "./Question";
import { Feedback } from "./Feedback";
import { useQuiz } from "./assessments.hooks";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { QuizResult } from "@/types/assessment";

interface QuizProps {
    quizId: string;
}

export function Quiz({ quizId }: QuizProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const {
        quiz,
        currentQuestion,
        currentIndex,
        totalQuestions,
        result,
        feedback,
        isLoading,
        isSubmitting,
        error,
        isLastQuestion,
        submitAnswer,
        nextQuestion,
        completeQuiz,
    } = useQuiz(quizId);

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Skeleton width="40%" height={24} />
                <Skeleton width="100%" height={200} variant="rounded" />
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} height={60} variant="rounded" />
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 mb-6">
                    {error}
                </div>
                <Link href={ROUTES.DASHBOARD.ASSESSMENTS}>
                    <Button>Back to Quizzes</Button>
                </Link>
            </div>
        );
    }

    // Results state
    if (result) {
        return <QuizResults result={result} />;
    }

    const handleSubmit = async () => {
        if (!selectedAnswer) return;
        await submitAnswer(selectedAnswer);
    };

    const handleContinue = async () => {
        if (isLastQuestion) {
            await completeQuiz();
        } else {
            nextQuestion();
            setSelectedAnswer(null);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link
                    href={ROUTES.DASHBOARD.ASSESSMENTS}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-700"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Exit Quiz</span>
                </Link>
                {quiz?.timeLimit && (
                    <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                            {Math.floor(quiz.timeLimit / 60)} min
                        </span>
                    </div>
                )}
            </div>

            {/* Progress */}
            <div>
                <div className="flex justify-between text-sm text-slate-500 mb-2">
                    <span>{quiz?.title}</span>
                    <span>
                        Question {currentIndex + 1} of {totalQuestions}
                    </span>
                </div>
                <ProgressBar
                    value={currentIndex + 1}
                    max={totalQuestions}
                    color="primary"
                    animated
                />
            </div>

            {/* Question Card */}
            <Card variant="elevated" padding="lg">
                {currentQuestion && (
                    <>
                        <Question
                            question={currentQuestion}
                            selectedAnswer={selectedAnswer}
                            onSelectAnswer={setSelectedAnswer}
                            disabled={!!feedback}
                            showCorrect={!!feedback}
                            correctAnswer={feedback?.correctAnswer}
                        />

                        {/* Feedback */}
                        {feedback && (
                            <div className="mt-6">
                                <Feedback
                                    isCorrect={feedback.isCorrect}
                                    correctAnswer={
                                        currentQuestion.options.find(
                                            (o) => o.id === feedback.correctAnswer
                                        )?.text
                                    }
                                    explanation={feedback.explanation}
                                    onContinue={handleContinue}
                                    isLastQuestion={isLastQuestion}
                                />
                            </div>
                        )}

                        {/* Submit Button */}
                        {!feedback && (
                            <div className="mt-8 flex justify-end">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!selectedAnswer || isSubmitting}
                                    size="lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Checking...
                                        </>
                                    ) : (
                                        "Submit Answer"
                                    )}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </Card>
        </div>
    );
}

function QuizResults({ result }: { result: QuizResult }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
        >
            <div
                className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6",
                    result.passed ? "bg-green-100" : "bg-amber-100"
                )}
            >
                <span
                    className={cn(
                        "text-4xl font-bold",
                        result.passed ? "text-green-600" : "text-amber-600"
                    )}
                >
                    {Math.round(result.percentage)}%
                </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {result.passed ? "Quiz Passed!" : "Quiz Complete"}
            </h2>
            <p className="text-slate-500 mb-8">{result.feedback}</p>

            <Card variant="elevated" className="mb-8">
                <div className="grid grid-cols-3 gap-4 p-6 text-center">
                    <div>
                        <p className="text-2xl font-bold text-green-600">
                            {result.correctCount}
                        </p>
                        <p className="text-sm text-slate-500">Correct</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-500">
                            {result.incorrectCount}
                        </p>
                        <p className="text-sm text-slate-500">Incorrect</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-primary-600">
                            +{result.xpEarned}
                        </p>
                        <p className="text-sm text-slate-500">XP Earned</p>
                    </div>
                </div>
            </Card>

            <div className="flex justify-center gap-4">
                <Link href={ROUTES.DASHBOARD.ASSESSMENTS}>
                    <Button variant="outline">Back to Quizzes</Button>
                </Link>
                <Link href={ROUTES.DASHBOARD.ROOT}>
                    <Button>Continue Learning</Button>
                </Link>
            </div>
        </motion.div>
    );
}

export default Quiz;
