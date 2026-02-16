"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { VocabularyCard } from "./VocabularyCard";
import { useVocabulary } from "./vocabulary.hooks";
import { cn } from "@/lib/utils";
import type { Word, PartOfSpeech } from "@/types/vocabulary";
import type { ProficiencyLevel } from "@/types/user";

interface VocabularyListProps {
    onWordSelect?: (word: Word) => void;
}

const difficultyOptions: ProficiencyLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const partOfSpeechOptions: PartOfSpeech[] = [
    "noun",
    "verb",
    "adjective",
    "adverb",
];

export function VocabularyList({ onWordSelect }: VocabularyListProps) {
    const [showFilters, setShowFilters] = useState(false);
    const [selectedWord, setSelectedWord] = useState<string | null>(null);

    const {
        words,
        filters,
        page,
        totalPages,
        isLoading,
        error,
        setPage,
        updateFilters,
    } = useVocabulary();

    const handleWordClick = (word: Word) => {
        setSelectedWord(selectedWord === word.id ? null : word.id);
        onWordSelect?.(word);
    };

    const toggleDifficulty = (level: ProficiencyLevel) => {
        const current = filters.difficulty || [];
        const updated = current.includes(level)
            ? current.filter((l) => l !== level)
            : [...current, level];
        updateFilters({ difficulty: updated.length ? updated : undefined });
    };

    const togglePartOfSpeech = (pos: PartOfSpeech) => {
        const current = filters.partOfSpeech || [];
        const updated = current.includes(pos)
            ? current.filter((p) => p !== pos)
            : [...current, pos];
        updateFilters({ partOfSpeech: updated.length ? updated : undefined });
    };

    const clearFilters = () => {
        updateFilters({
            search: undefined,
            difficulty: undefined,
            partOfSpeech: undefined,
        });
    };

    const hasActiveFilters =
        filters.search ||
        (filters.difficulty && filters.difficulty.length > 0) ||
        (filters.partOfSpeech && filters.partOfSpeech.length > 0);

    return (
        <div className="space-y-6">
            {/* Search and Filters */}
            <div className="space-y-4">
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Search words..."
                            value={filters.search || ""}
                            onChange={(e) =>
                                updateFilters({ search: e.target.value })
                            }
                            className="pl-12"
                        />
                    </div>
                    <Button
                        variant={showFilters ? "primary" : "outline"}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="w-5 h-5" />
                    </Button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-50 rounded-xl p-4 space-y-4"
                    >
                        {/* Difficulty */}
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                                Difficulty
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {difficultyOptions.map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => toggleDifficulty(level)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                                            filters.difficulty?.includes(level)
                                                ? "bg-primary-500 text-white"
                                                : "bg-white text-slate-600 hover:bg-slate-100"
                                        )}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Part of Speech */}
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                                Part of Speech
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {partOfSpeechOptions.map((pos) => (
                                    <button
                                        key={pos}
                                        onClick={() => togglePartOfSpeech(pos)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize",
                                            filters.partOfSpeech?.includes(pos)
                                                ? "bg-primary-500 text-white"
                                                : "bg-white text-slate-600 hover:bg-slate-100"
                                        )}
                                    >
                                        {pos}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                            >
                                <X className="w-4 h-4 mr-1" />
                                Clear filters
                            </Button>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    {error}
                </div>
            )}

            {/* Loading */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="p-4 border rounded-xl space-y-3">
                            <Skeleton width="60%" height={24} />
                            <Skeleton width="80%" height={20} />
                            <Skeleton width="40%" height={16} />
                        </div>
                    ))}
                </div>
            ) : words.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-slate-500">No words found</p>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            className="mt-2"
                            onClick={clearFilters}
                        >
                            Clear filters
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    {/* Word Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {words.map((word, index) => (
                            <motion.div
                                key={word.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <VocabularyCard
                                    word={word}
                                    showDetails={selectedWord === word.id}
                                    onClick={() => handleWordClick(word)}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <span className="text-sm text-slate-500 px-4">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default VocabularyList;
