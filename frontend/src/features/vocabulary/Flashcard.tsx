"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Volume2, RotateCcw, Check, X, Frown, Meh, Smile } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { usePlaySound } from "@/hooks/useAudioPlayer";
import { cn } from "@/lib/utils";
import type { Word, FlashcardProgress, ReviewQuality } from "@/types/vocabulary";

interface FlashcardProps {
    word: Word;
    progress?: FlashcardProgress;
    isFlipped: boolean;
    onFlip: () => void;
    onReview: (quality: ReviewQuality) => void;
    isSubmitting?: boolean;
}

export function Flashcard({
    word,
    progress,
    isFlipped,
    onFlip,
    onReview,
    isSubmitting = false,
}: FlashcardProps) {
    const { playSound, isPlaying } = usePlaySound();

    const handlePlayAudio = () => {
        if (word.audioUrl) {
            playSound(word.audioUrl);
        }
    };

    const reviewOptions: { quality: ReviewQuality; label: string; icon: React.ElementType; color: string }[] = [
        { quality: 1, label: "Again", icon: Frown, color: "bg-red-500 hover:bg-red-600" },
        { quality: 3, label: "Hard", icon: Meh, color: "bg-amber-500 hover:bg-amber-600" },
        { quality: 4, label: "Good", icon: Smile, color: "bg-green-500 hover:bg-green-600" },
        { quality: 5, label: "Easy", icon: Check, color: "bg-emerald-500 hover:bg-emerald-600" },
    ];

    return (
        <div className="w-full max-w-lg mx-auto perspective-1000">
            {/* Card */}
            <motion.div
                className="relative w-full h-80 cursor-pointer"
                onClick={!isFlipped ? onFlip : undefined}
                style={{ transformStyle: "preserve-3d" }}
            >
                <AnimatePresence mode="wait">
                    {!isFlipped ? (
                        // Front of card (term)
                        <motion.div
                            key="front"
                            initial={{ rotateY: 180, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: -180, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0"
                        >
                            <Card
                                variant="elevated"
                                className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary-50 to-white"
                            >
                                <p className="text-sm text-slate-400 mb-4">
                                    Tap to reveal
                                </p>
                                <h2 className="text-4xl font-bold text-slate-900 text-center mb-2">
                                    {word.term}
                                </h2>
                                {word.pronunciation && (
                                    <p className="text-lg text-slate-400">
                                        /{word.pronunciation}/
                                    </p>
                                )}
                                {word.audioUrl && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePlayAudio();
                                        }}
                                        className={cn(
                                            "mt-4 p-3 rounded-full transition-colors",
                                            isPlaying
                                                ? "bg-primary-100 text-primary-600"
                                                : "bg-slate-100 text-slate-500 hover:bg-primary-50 hover:text-primary-600"
                                        )}
                                    >
                                        <Volume2 className="w-6 h-6" />
                                    </button>
                                )}
                                <p className="text-sm text-slate-400 capitalize mt-4">
                                    {word.partOfSpeech}
                                </p>
                            </Card>
                        </motion.div>
                    ) : (
                        // Back of card (answer)
                        <motion.div
                            key="back"
                            initial={{ rotateY: -180, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: 180, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0"
                        >
                            <Card
                                variant="elevated"
                                className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-secondary-50 to-white"
                            >
                                <h2 className="text-3xl font-bold text-slate-900 text-center mb-2">
                                    {word.translation}
                                </h2>
                                <p className="text-lg text-slate-500 text-center mb-4">
                                    {word.definition}
                                </p>
                                {word.exampleSentence && (
                                    <div className="bg-white/50 rounded-lg p-4 w-full">
                                        <p className="text-sm text-slate-700 italic text-center">
                                            &ldquo;{word.exampleSentence}&rdquo;
                                        </p>
                                        {word.exampleTranslation && (
                                            <p className="text-xs text-slate-500 text-center mt-1">
                                                {word.exampleTranslation}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Review Buttons (shown when flipped) */}
            <AnimatePresence>
                {isFlipped && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="mt-6 space-y-4"
                    >
                        <p className="text-center text-sm text-slate-500">
                            How well did you know this?
                        </p>
                        <div className="flex justify-center gap-3">
                            {reviewOptions.map(({ quality, label, icon: Icon, color }) => (
                                <button
                                    key={quality}
                                    onClick={() => onReview(quality)}
                                    disabled={isSubmitting}
                                    className={cn(
                                        "flex flex-col items-center gap-1 px-4 py-3 rounded-xl text-white transition-all",
                                        "disabled:opacity-50 disabled:cursor-not-allowed",
                                        color
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-xs font-medium">
                                        {label}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={onFlip}
                            className="flex items-center justify-center gap-2 mx-auto text-slate-500 hover:text-slate-700 text-sm"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Flip back
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress indicator */}
            {progress && (
                <div className="mt-4 text-center text-xs text-slate-400">
                    Reviewed {progress.repetitions} times •{" "}
                    {Math.round(
                        (progress.correctCount /
                            (progress.correctCount + progress.incorrectCount || 1)) *
                            100
                    )}
                    % correct
                </div>
            )}
        </div>
    );
}

export default Flashcard;
