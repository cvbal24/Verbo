"use client";

import { motion } from "framer-motion";
import {
    AlertTriangle,
    CheckCircle,
    Eye,
    Search,
    Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useMistakes, useReviewMistake } from "./mistakes.hooks";
import { cn } from "@/lib/utils";
import type { Mistake } from "@/services/mistakes.service";

const typeConfig: Record<
    Mistake["type"],
    { label: string; color: string; bg: string }
> = {
    grammar: { label: "Grammar", color: "text-purple-700", bg: "bg-purple-100" },
    vocabulary: { label: "Vocabulary", color: "text-blue-700", bg: "bg-blue-100" },
    spelling: { label: "Spelling", color: "text-amber-700", bg: "bg-amber-100" },
    pronunciation: {
        label: "Pronunciation",
        color: "text-green-700",
        bg: "bg-green-100",
    },
};

export function MistakeList() {
    const { mistakes, filters, isLoading, error, updateFilters } = useMistakes();
    const { markReviewed, markResolved, isSubmitting } = useReviewMistake();

    const handleReview = async (id: string) => {
        await markReviewed(id);
        updateFilters({}); // trigger reload
    };

    const handleResolve = async (id: string) => {
        await markResolved(id);
        updateFilters({}); // trigger reload
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search mistakes..."
                        value={filters.search || ""}
                        onChange={(e) => updateFilters({ search: e.target.value })}
                        className="pl-10"
                    />
                </div>

                <div className="flex gap-2">
                    {/* Type filters */}
                    {(
                        ["grammar", "vocabulary", "spelling", "pronunciation"] as const
                    ).map((type) => {
                        const config = typeConfig[type];
                        const isActive = filters.type?.includes(type);
                        return (
                            <button
                                key={type}
                                onClick={() => {
                                    const current = filters.type || [];
                                    const next = isActive
                                        ? current.filter((t) => t !== type)
                                        : [...current, type];
                                    updateFilters({
                                        type: next.length > 0 ? next : undefined,
                                    });
                                }}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                                    isActive
                                        ? `${config.bg} ${config.color}`
                                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                )}
                            >
                                {config.label}
                            </button>
                        );
                    })}

                    {/* Resolved filter */}
                    <button
                        onClick={() =>
                            updateFilters({
                                isResolved:
                                    filters.isResolved === undefined
                                        ? false
                                        : filters.isResolved === false
                                          ? true
                                          : undefined,
                            })
                        }
                        className={cn(
                            "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                            filters.isResolved !== undefined
                                ? "bg-primary-100 text-primary-700"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        )}
                    >
                        <Filter className="w-3 h-3" />
                        {filters.isResolved === undefined
                            ? "All"
                            : filters.isResolved
                              ? "Resolved"
                              : "Active"}
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Loading */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} variant="elevated" padding="md">
                            <div className="space-y-3">
                                <Skeleton width="30%" height={20} />
                                <Skeleton width="80%" height={16} />
                                <Skeleton width="60%" height={16} />
                            </div>
                        </Card>
                    ))}
                </div>
            ) : mistakes.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        No mistakes found
                    </h3>
                    <p className="text-slate-500">
                        {filters.search || filters.type?.length
                            ? "Try adjusting your filters"
                            : "Keep practicing to track your mistakes!"}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {mistakes.map((mistake, index) => (
                        <MistakeCard
                            key={mistake.id}
                            mistake={mistake}
                            delay={index * 0.05}
                            onReview={handleReview}
                            onResolve={handleResolve}
                            isSubmitting={isSubmitting}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function MistakeCard({
    mistake,
    delay,
    onReview,
    onResolve,
    isSubmitting,
}: {
    mistake: Mistake;
    delay: number;
    onReview: (id: string) => void;
    onResolve: (id: string) => void;
    isSubmitting: boolean;
}) {
    const config = typeConfig[mistake.type];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Card
                variant="elevated"
                padding="md"
                className={cn(mistake.isResolved && "opacity-60")}
            >
                <CardContent className="p-0 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <span
                                className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                    config.bg,
                                    config.color
                                )}
                            >
                                {config.label}
                            </span>
                            {mistake.isResolved && (
                                <span className="flex items-center gap-1 text-xs text-green-600">
                                    <CheckCircle className="w-3 h-3" />
                                    Resolved
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-slate-400">
                            Reviewed {mistake.reviewCount} time
                            {mistake.reviewCount !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* Correction */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
                            <p className="text-xs text-red-500 mb-0.5">Original</p>
                            <p className="text-sm font-medium text-red-700">
                                {mistake.originalText}
                            </p>
                        </div>
                        <AlertTriangle className="w-4 h-4 text-slate-300 shrink-0" />
                        <div className="flex-1 px-3 py-2 bg-green-50 border border-green-100 rounded-lg">
                            <p className="text-xs text-green-500 mb-0.5">Correct</p>
                            <p className="text-sm font-medium text-green-700">
                                {mistake.correctText}
                            </p>
                        </div>
                    </div>

                    {/* Explanation */}
                    <p className="text-sm text-slate-600">{mistake.explanation}</p>

                    {/* Context */}
                    {mistake.context && (
                        <p className="text-xs text-slate-400 italic">
                            Context: {mistake.context}
                        </p>
                    )}

                    {/* Actions */}
                    {!mistake.isResolved && (
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onReview(mistake.id)}
                                disabled={isSubmitting}
                            >
                                <Eye className="w-4 h-4 mr-1" />
                                Mark Reviewed
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onResolve(mistake.id)}
                                disabled={isSubmitting}
                            >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Resolve
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default MistakeList;
