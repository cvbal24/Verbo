"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronRight, Trophy, Target, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { usePlacementTest } from "./onboarding.hooks";
import { PROFICIENCY_LEVELS } from "@/constants/languages";

export function PlacementTest() {
    const {
        questions,
        currentQuestion,
        currentIndex,
        totalQuestions,
        result,
        isLoading,
        isSubmitting,
        error,
        isComplete,
        loadQuestions,
        submitAnswer,
        submitTest,
        skipTest,
        finishOnboarding,
    } = usePlacementTest();

    useEffect(() => {
        loadQuestions();
    }, [loadQuestions]);

    // Loading state
    if (isLoading && questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                <p className="text-slate-500">Loading placement test...</p>
            </div>
        );
    }

    // Error state
    if (error && questions.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 mb-6 max-w-md mx-auto">
                    {error}
                </div>
                <Button onClick={loadQuestions}>Try Again</Button>
            </div>
        );
    }

    // Results state
    if (result) {
        const levelInfo = PROFICIENCY_LEVELS.find(
            (l) => l.level === result.recommendedLevel
        );

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg mx-auto text-center"
            >
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-10 h-10 text-primary-600" />
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Test Complete!
                </h2>
                <p className="text-slate-500 mb-8">
                    Based on your answers, we recommend starting at:
                </p>

                <Card variant="elevated" padding="lg" className="mb-8">
                    <div className="text-5xl font-bold text-primary-600 mb-2">
                        {result.recommendedLevel}
                    </div>
                    <div className="text-lg font-medium text-slate-900 mb-1">
                        {levelInfo?.name}
                    </div>
                    <p className="text-sm text-slate-500">
                        {levelInfo?.description}
                    </p>

                    {result.score > 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <div className="text-2xl font-bold text-slate-900">
                                {Math.round(result.score)}%
                            </div>
                            <p className="text-sm text-slate-500">
                                Test Score
                            </p>
                        </div>
                    )}
                </Card>

                {result.strengths.length > 0 && (
                    <div className="mb-6 text-left">
                        <h3 className="font-medium text-slate-900 mb-2">
                            Your Strengths
                        </h3>
                        <ul className="space-y-1">
                            {result.strengths.map((strength, i) => (
                                <li
                                    key={i}
                                    className="flex items-center gap-2 text-sm text-slate-600"
                                >
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                    {strength}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {result.areasToImprove.length > 0 && (
                    <div className="mb-8 text-left">
                        <h3 className="font-medium text-slate-900 mb-2">
                            Areas to Improve
                        </h3>
                        <ul className="space-y-1">
                            {result.areasToImprove.map((area, i) => (
                                <li
                                    key={i}
                                    className="flex items-center gap-2 text-sm text-slate-600"
                                >
                                    <Target className="w-4 h-4 text-amber-500" />
                                    {area}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <Button
                    onClick={finishOnboarding}
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Starting...
                        </>
                    ) : (
                        <>
                            Start Learning
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </Button>
            </motion.div>
        );
    }

    // Test in progress
    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
                <div className="flex justify-between text-sm text-slate-500 mb-2">
                    <span>Question {currentIndex + 1} of {totalQuestions}</span>
                    <span>
                        {Math.round(((currentIndex + 1) / totalQuestions) * 100)}%
                    </span>
                </div>
                <ProgressBar
                    value={currentIndex + 1}
                    max={totalQuestions}
                    color="primary"
                    animated
                />
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
                {currentQuestion && (
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card variant="elevated" padding="lg">
                            <h2 className="text-xl font-semibold text-slate-900 mb-6">
                                {currentQuestion.prompt}
                            </h2>

                            <div className="space-y-3">
                                {currentQuestion.options.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() =>
                                            submitAnswer(
                                                currentQuestion.id,
                                                option.id
                                            )
                                        }
                                        className={cn(
                                            "w-full p-4 text-left rounded-xl border-2 transition-all duration-200",
                                            "hover:border-primary-300 hover:bg-primary-50",
                                            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                                            "border-slate-200 bg-white"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600 uppercase">
                                                {option.id}
                                            </span>
                                            <span className="font-medium text-slate-900">
                                                {option.text}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Submit or Skip */}
            <div className="flex justify-between items-center mt-8">
                <Button
                    variant="ghost"
                    onClick={skipTest}
                    disabled={isSubmitting}
                >
                    Skip test (start as beginner)
                </Button>

                {isComplete && (
                    <Button
                        onClick={submitTest}
                        disabled={isSubmitting}
                        size="lg"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                See Results
                                <ChevronRight className="w-5 h-5 ml-1" />
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default PlacementTest;
