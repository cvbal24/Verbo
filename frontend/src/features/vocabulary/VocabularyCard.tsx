"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, BookOpen, Tag } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { usePlaySound } from "@/hooks/useAudioPlayer";
import { cn } from "@/lib/utils";
import type { Word } from "@/types/vocabulary";

interface VocabularyCardProps {
    word: Word;
    showDetails?: boolean;
    onClick?: () => void;
}

export function VocabularyCard({
    word,
    showDetails = false,
    onClick,
}: VocabularyCardProps) {
    const { playSound, isPlaying } = usePlaySound();
    const [isHovered, setIsHovered] = useState(false);

    const handlePlayAudio = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (word.audioUrl) {
            playSound(word.audioUrl);
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <Card
                variant={onClick ? "interactive" : "default"}
                padding="md"
                onClick={onClick}
                className={cn("relative overflow-hidden", {
                    "cursor-pointer": onClick,
                })}
            >
                {/* Difficulty badge */}
                <div className="absolute top-3 right-3">
                    <span
                        className={cn(
                            "text-xs font-medium px-2 py-0.5 rounded-full",
                            {
                                "bg-green-100 text-green-700":
                                    word.difficulty === "A1",
                                "bg-blue-100 text-blue-700":
                                    word.difficulty === "A2",
                                "bg-purple-100 text-purple-700":
                                    word.difficulty === "B1",
                                "bg-orange-100 text-orange-700":
                                    word.difficulty === "B2",
                                "bg-red-100 text-red-700":
                                    word.difficulty === "C1" ||
                                    word.difficulty === "C2",
                            }
                        )}
                    >
                        {word.difficulty}
                    </span>
                </div>

                {/* Main content */}
                <div className="space-y-3">
                    {/* Term with audio */}
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900">
                                {word.term}
                            </h3>
                            {word.pronunciation && (
                                <p className="text-sm text-slate-400">
                                    /{word.pronunciation}/
                                </p>
                            )}
                        </div>
                        {word.audioUrl && (
                            <button
                                onClick={handlePlayAudio}
                                className={cn(
                                    "p-2 rounded-full transition-colors",
                                    isPlaying
                                        ? "bg-primary-100 text-primary-600"
                                        : "bg-slate-100 text-slate-500 hover:bg-primary-50 hover:text-primary-600"
                                )}
                            >
                                <Volume2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Translation */}
                    <p className="text-lg text-slate-600">{word.translation}</p>

                    {/* Part of speech */}
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <BookOpen className="w-4 h-4" />
                        <span className="capitalize">{word.partOfSpeech}</span>
                    </div>

                    {/* Details (expanded) */}
                    {showDetails && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="pt-3 border-t border-slate-100 space-y-3"
                        >
                            {/* Definition */}
                            <p className="text-sm text-slate-600">
                                {word.definition}
                            </p>

                            {/* Example */}
                            {word.exampleSentence && (
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-sm font-medium text-slate-900">
                                        &ldquo;{word.exampleSentence}&rdquo;
                                    </p>
                                    {word.exampleTranslation && (
                                        <p className="text-sm text-slate-500 mt-1">
                                            {word.exampleTranslation}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Tags */}
                            {word.tags.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Tag className="w-4 h-4 text-slate-400" />
                                    {word.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}

export default VocabularyCard;
