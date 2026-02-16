"use client";

import { motion } from "framer-motion";
import { BookOpen, Brain, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { VocabularyList } from "@/features/vocabulary/VocabularyList";
import { useVocabularyStats } from "@/features/vocabulary/vocabulary.hooks";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

export default function VocabularyPage() {
    const { stats, isLoading } = useVocabularyStats();

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Vocabulary
                    </h1>
                    <p className="text-slate-500">
                        Browse and learn new words
                    </p>
                </div>
                <Link href={ROUTES.DASHBOARD.FLASHCARDS}>
                    <Button>
                        <Brain className="w-5 h-5 mr-2" />
                        Practice Flashcards
                    </Button>
                </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                <StatCard
                    icon={BookOpen}
                    label="Total Words"
                    value={stats?.totalWords || 0}
                    color="bg-blue-100 text-blue-600"
                    isLoading={isLoading}
                />
                <StatCard
                    icon={TrendingUp}
                    label="Learned"
                    value={stats?.wordsLearned || 0}
                    color="bg-green-100 text-green-600"
                    isLoading={isLoading}
                />
                <StatCard
                    icon={Brain}
                    label="To Review"
                    value={stats?.wordsToReview || 0}
                    color="bg-amber-100 text-amber-600"
                    isLoading={isLoading}
                />
                <StatCard
                    icon={TrendingUp}
                    label="Accuracy"
                    value={`${stats?.accuracy || 0}%`}
                    color="bg-purple-100 text-purple-600"
                    isLoading={isLoading}
                />
            </motion.div>

            {/* Vocabulary List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <VocabularyList />
            </motion.div>
        </div>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    color,
    isLoading,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color: string;
    isLoading: boolean;
}) {
    return (
        <Card variant="elevated" padding="md">
            <CardContent className="flex items-center gap-3 p-0">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="text-xl font-bold text-slate-900">
                        {isLoading ? "-" : value}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
