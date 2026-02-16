"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    GraduationCap,
    Clock,
    Trophy,
    ArrowRight,
    History,
    Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Quiz } from "@/features/assessments/Quiz";
import { useQuizzes, useQuizHistory } from "@/features/assessments/assessments.hooks";
import { cn } from "@/lib/utils";
import type { Quiz as QuizType } from "@/types/assessment";

export default function AssessmentsPage() {
    const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
    const { quizzes, isLoading: quizzesLoading, error: quizzesError } = useQuizzes();
    const { history, isLoading: historyLoading } = useQuizHistory();

    // Active quiz view
    if (activeQuiz) {
        return (
            <div className="py-6">
                <Quiz quizId={activeQuiz} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    Assessments
                </h1>
                <p className="text-slate-500">
                    Test your knowledge with quizzes
                </p>
            </motion.div>

            {/* Quiz History Summary */}
            {!historyLoading && history.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card variant="elevated">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="w-5 h-5 text-primary-500" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {history.slice(0, 3).map((item) => (
                                    <div
                                        key={item.quizId}
                                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                            <Star className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 truncate">
                                                {item.quizTitle}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Best: {item.bestScore}% •{" "}
                                                {item.attempts} attempt
                                                {item.attempts !== 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Error */}
            {quizzesError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    {quizzesError}
                </div>
            )}

            {/* Available Quizzes */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Available Quizzes
                </h2>

                {quizzesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} variant="elevated" padding="md">
                                <div className="space-y-3">
                                    <Skeleton width="70%" height={24} />
                                    <Skeleton width="100%" height={16} />
                                    <Skeleton width="40%" height={16} />
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {quizzes.map((quiz, index) => (
                            <QuizCard
                                key={quiz.id}
                                quiz={quiz}
                                onStart={() => setActiveQuiz(quiz.id)}
                                delay={index * 0.1}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}

function QuizCard({
    quiz,
    onStart,
    delay,
}: {
    quiz: QuizType;
    onStart: () => void;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Card
                variant="interactive"
                padding="md"
                className="h-full flex flex-col"
            >
                <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div
                            className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                {
                                    "bg-blue-100": quiz.type === "vocabulary",
                                    "bg-purple-100": quiz.type === "grammar",
                                    "bg-green-100": quiz.type === "listening",
                                    "bg-amber-100": quiz.type === "reading",
                                }
                            )}
                        >
                            <GraduationCap
                                className={cn("w-5 h-5", {
                                    "text-blue-600": quiz.type === "vocabulary",
                                    "text-purple-600": quiz.type === "grammar",
                                    "text-green-600": quiz.type === "listening",
                                    "text-amber-600": quiz.type === "reading",
                                })}
                            />
                        </div>
                        <span
                            className={cn(
                                "text-xs font-medium px-2 py-0.5 rounded-full",
                                {
                                    "bg-green-100 text-green-700":
                                        quiz.difficulty === "A1",
                                    "bg-blue-100 text-blue-700":
                                        quiz.difficulty === "A2",
                                    "bg-purple-100 text-purple-700":
                                        quiz.difficulty === "B1",
                                    "bg-orange-100 text-orange-700":
                                        quiz.difficulty === "B2",
                                }
                            )}
                        >
                            {quiz.difficulty}
                        </span>
                    </div>

                    {/* Content */}
                    <h3 className="font-semibold text-slate-900 mb-1">
                        {quiz.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                        {quiz.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                        <span className="flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5" />
                            {quiz.questionCount} questions
                        </span>
                        {quiz.timeLimit && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {Math.floor(quiz.timeLimit / 60)} min
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5" />
                            {quiz.passingScore}% to pass
                        </span>
                    </div>
                </div>

                {/* Action */}
                <Button onClick={onStart} variant="outline" className="w-full">
                    Start Quiz
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </Card>
        </motion.div>
    );
}
