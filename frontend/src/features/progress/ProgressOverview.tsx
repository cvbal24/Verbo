"use client";

import { motion } from "framer-motion";
import {
    Flame,
    Zap,
    BookOpen,
    Clock,
    Target,
    TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { useProgress, useWeeklyProgress } from "./progress.hooks";
import { cn } from "@/lib/utils";

export function ProgressOverview() {
    const { stats, isLoading: statsLoading } = useProgress();
    const { weekly, isLoading: weeklyLoading } = useWeeklyProgress();

    if (statsLoading) {
        return <ProgressOverviewSkeleton />;
    }

    const statCards = [
        {
            icon: Flame,
            label: "Current Streak",
            value: `${stats?.currentStreak || 0} days`,
            subtext: `Best: ${stats?.longestStreak || 0} days`,
            color: "text-orange-500",
            bgColor: "bg-orange-100",
        },
        {
            icon: Zap,
            label: "Total XP",
            value: stats?.totalXp?.toLocaleString() || "0",
            subtext: `${stats?.xpToNextLevel || 0} to next level`,
            color: "text-primary-500",
            bgColor: "bg-primary-100",
        },
        {
            icon: BookOpen,
            label: "Words Learned",
            value: stats?.wordsLearned?.toString() || "0",
            subtext: `${stats?.wordsMastered || 0} mastered`,
            color: "text-blue-500",
            bgColor: "bg-blue-100",
        },
        {
            icon: Clock,
            label: "Study Time",
            value: formatTime(stats?.totalStudyTime || 0),
            subtext: `Avg. ${stats?.averageSessionTime || 0} min/session`,
            color: "text-purple-500",
            bgColor: "bg-purple-100",
        },
        {
            icon: Target,
            label: "Accuracy",
            value: `${stats?.overallAccuracy || 0}%`,
            subtext: "Overall score",
            color: "text-green-500",
            bgColor: "bg-green-100",
        },
        {
            icon: TrendingUp,
            label: "Quizzes Passed",
            value: stats?.quizzesPassed?.toString() || "0",
            subtext: `${stats?.lessonsCompleted || 0} lessons`,
            color: "text-amber-500",
            bgColor: "bg-amber-100",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card variant="elevated" padding="md">
                            <CardContent className="flex items-center gap-3 p-0">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center",
                                        stat.bgColor
                                    )}
                                >
                                    <stat.icon
                                        className={cn("w-5 h-5", stat.color)}
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm text-slate-500 truncate">
                                        {stat.label}
                                    </p>
                                    <p className="text-xl font-bold text-slate-900">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate">
                                        {stat.subtext}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Weekly Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card variant="elevated">
                    <CardHeader>
                        <CardTitle>This Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {weeklyLoading ? (
                            <div className="space-y-3">
                                <Skeleton height={60} variant="rounded" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Day bars */}
                                <div className="flex justify-between items-end h-32 gap-2">
                                    {weekly?.dailyActivities.map(
                                        (day, index) => {
                                            const maxMinutes = Math.max(
                                                ...weekly.dailyActivities.map(
                                                    (d) => d.studyTimeMinutes
                                                ),
                                                1
                                            );
                                            const height =
                                                (day.studyTimeMinutes /
                                                    maxMinutes) *
                                                100;

                                            return (
                                                <div
                                                    key={day.date}
                                                    className="flex-1 flex flex-col items-center gap-2"
                                                >
                                                    <div className="w-full bg-slate-100 rounded-t-md relative h-24">
                                                        <motion.div
                                                            initial={{
                                                                height: 0,
                                                            }}
                                                            animate={{
                                                                height: `${height}%`,
                                                            }}
                                                            transition={{
                                                                delay:
                                                                    index *
                                                                    0.1,
                                                                duration: 0.5,
                                                            }}
                                                            className={cn(
                                                                "absolute bottom-0 left-0 right-0 rounded-t-md",
                                                                day.streakMaintained
                                                                    ? "bg-primary-500"
                                                                    : "bg-slate-300"
                                                            )}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-slate-500">
                                                        {new Date(
                                                            day.date
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            { weekday: "short" }
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>

                                {/* Summary */}
                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-900">
                                            {formatTime(
                                                weekly?.totalStudyTime || 0
                                            )}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Study Time
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-900">
                                            {weekly?.totalWordsLearned || 0}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Words
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-primary-600">
                                            +{weekly?.totalXpEarned || 0}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            XP Earned
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Level Progress */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card variant="elevated">
                    <CardHeader>
                        <CardTitle>Level Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl font-bold text-slate-900">
                                Level {stats?.currentLevel || "A1"}
                            </span>
                            <span className="text-sm text-slate-500">
                                {stats?.xpToNextLevel || 0} XP to next level
                            </span>
                        </div>
                        <ProgressBar
                            value={
                                ((stats?.totalXp || 0) %
                                    ((stats?.totalXp || 0) +
                                        (stats?.xpToNextLevel || 500))) *
                                100
                            }
                            max={100}
                            color="primary"
                            size="lg"
                            animated
                        />
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

function ProgressOverviewSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} variant="elevated" padding="md">
                        <div className="flex items-center gap-3">
                            <Skeleton
                                variant="rounded"
                                width={40}
                                height={40}
                            />
                            <div className="space-y-2">
                                <Skeleton width={60} height={14} />
                                <Skeleton width={80} height={20} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function formatTime(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export default ProgressOverview;
