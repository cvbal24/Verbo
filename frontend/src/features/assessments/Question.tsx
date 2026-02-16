"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { usePlaySound } from "@/hooks/useAudioPlayer";
import { cn } from "@/lib/utils";
import type { Question as QuestionType } from "@/types/assessment";

interface QuestionProps {
    question: QuestionType;
    selectedAnswer: string | null;
    onSelectAnswer: (answer: string) => void;
    disabled?: boolean;
    showCorrect?: boolean;
    correctAnswer?: string;
}

export function Question({
    question,
    selectedAnswer,
    onSelectAnswer,
    disabled = false,
    showCorrect = false,
    correctAnswer,
}: QuestionProps) {
    const { playSound, isPlaying } = usePlaySound();

    const handlePlayAudio = () => {
        if (question.promptAudioUrl) {
            playSound(question.promptAudioUrl);
        }
    };

    return (
        <div className="space-y-6">
            {/* Question Prompt */}
            <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    {question.prompt}
                </h2>

                {question.promptAudioUrl && (
                    <button
                        onClick={handlePlayAudio}
                        className={cn(
                            "p-3 rounded-full transition-colors mx-auto",
                            isPlaying
                                ? "bg-primary-100 text-primary-600"
                                : "bg-slate-100 text-slate-500 hover:bg-primary-50 hover:text-primary-600"
                        )}
                    >
                        <Volume2 className="w-6 h-6" />
                    </button>
                )}

                {question.promptImageUrl && (
                    <img
                        src={question.promptImageUrl}
                        alt="Question"
                        className="max-w-sm mx-auto rounded-xl mt-4"
                    />
                )}
            </div>

            {/* Options */}
            <div className="space-y-3">
                {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === option.id;
                    const isCorrectOption = correctAnswer === option.id;
                    const isWrong =
                        showCorrect && isSelected && !isCorrectOption;

                    return (
                        <motion.button
                            key={option.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onSelectAnswer(option.id)}
                            disabled={disabled}
                            className={cn(
                                "w-full p-4 text-left rounded-xl border-2 transition-all duration-200",
                                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                                "disabled:cursor-not-allowed",
                                {
                                    // Default state
                                    "border-slate-200 bg-white hover:border-primary-300 hover:bg-primary-50":
                                        !isSelected &&
                                        !showCorrect &&
                                        !disabled,
                                    // Selected state
                                    "border-primary-500 bg-primary-50":
                                        isSelected && !showCorrect,
                                    // Correct answer shown
                                    "border-green-500 bg-green-50":
                                        showCorrect && isCorrectOption,
                                    // Wrong answer selected
                                    "border-red-500 bg-red-50": isWrong,
                                    // Disabled unselected
                                    "border-slate-200 bg-slate-50 opacity-50":
                                        disabled &&
                                        !isSelected &&
                                        !isCorrectOption,
                                }
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium uppercase",
                                        {
                                            "bg-slate-100 text-slate-600":
                                                !isSelected && !showCorrect,
                                            "bg-primary-500 text-white":
                                                isSelected && !showCorrect,
                                            "bg-green-500 text-white":
                                                showCorrect && isCorrectOption,
                                            "bg-red-500 text-white": isWrong,
                                        }
                                    )}
                                >
                                    {option.id}
                                </span>
                                <span
                                    className={cn("font-medium", {
                                        "text-slate-900":
                                            !showCorrect ||
                                            (!isWrong && !isCorrectOption),
                                        "text-green-700":
                                            showCorrect && isCorrectOption,
                                        "text-red-700": isWrong,
                                    })}
                                >
                                    {option.text}
                                </span>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

export default Question;
