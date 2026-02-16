"use client";

import { motion } from "framer-motion";
import {
    Brain,
    Trophy,
    RotateCcw,
    ArrowLeft,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { Flashcard } from "@/features/vocabulary/Flashcard";
import { useFlashcards } from "@/features/vocabulary/vocabulary.hooks";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

export default function FlashcardsPage() {
    const {
        cards,
        currentCard,
        currentIndex,
        totalCards,
        isFlipped,
        isLoading,
        isSubmitting,
        error,
        sessionStats,
        isComplete,
        loadCards,
        submitReview,
        flipCard,
    } = useFlashcards();

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-lg mx-auto py-12 space-y-6">
                <Skeleton variant="rounded" height={320} className="w-full" />
                <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton
                            key={i}
                            variant="rounded"
                            width={70}
                            height={60}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-lg mx-auto py-12 text-center">
                <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 mb-6">
                    {error}
                </div>
                <Button onClick={loadCards}>Try Again</Button>
            </div>
        );
    }

    // No cards to review
    if (cards.length === 0 && !isLoading) {
        return (
            <div className="max-w-lg mx-auto py-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    All caught up!
                </h2>
                <p className="text-slate-500 mb-6">
                    You&apos;ve reviewed all your flashcards for now. Come back
                    later or learn new words.
                </p>
                <Link href={ROUTES.DASHBOARD.VOCABULARY}>
                    <Button>
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Learn New Words
                    </Button>
                </Link>
            </div>
        );
    }

    // Session complete
    if (isComplete) {
        const accuracy =
            sessionStats.reviewed > 0
                ? Math.round(
                      (sessionStats.correct / sessionStats.reviewed) * 100
                  )
                : 0;

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg mx-auto py-12 text-center"
            >
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-10 h-10 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Session Complete!
                </h2>
                <p className="text-slate-500 mb-8">
                    Great job reviewing your flashcards!
                </p>

                <Card variant="elevated" className="mb-8">
                    <CardContent className="grid grid-cols-3 gap-4 text-center py-6">
                        <div>
                            <p className="text-3xl font-bold text-slate-900">
                                {sessionStats.reviewed}
                            </p>
                            <p className="text-sm text-slate-500">Reviewed</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-green-600">
                                {sessionStats.correct}
                            </p>
                            <p className="text-sm text-slate-500">Correct</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900">
                                {accuracy}%
                            </p>
                            <p className="text-sm text-slate-500">Accuracy</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={loadCards}>
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Practice Again
                    </Button>
                    <Link href={ROUTES.DASHBOARD.ROOT}>
                        <Button>Back to Dashboard</Button>
                    </Link>
                </div>
            </motion.div>
        );
    }

    // Active session
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <Link
                    href={ROUTES.DASHBOARD.VOCABULARY}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-700"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Vocabulary</span>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {sessionStats.correct}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-red-500">
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {sessionStats.incorrect}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Progress */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                    <span>
                        Card {currentIndex + 1} of {totalCards}
                    </span>
                    <span>
                        {Math.round(((currentIndex + 1) / totalCards) * 100)}%
                    </span>
                </div>
                <ProgressBar
                    value={currentIndex + 1}
                    max={totalCards}
                    color="primary"
                    animated
                />
            </motion.div>

            {/* Flashcard */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {currentCard && (
                    <Flashcard
                        word={currentCard.word}
                        progress={currentCard.progress}
                        isFlipped={isFlipped}
                        onFlip={flipCard}
                        onReview={submitReview}
                        isSubmitting={isSubmitting}
                    />
                )}
            </motion.div>
        </div>
    );
}
