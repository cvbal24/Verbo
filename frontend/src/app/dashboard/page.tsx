"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    BookOpen,
    Brain,
    Trophy,
    Target,
    Flame,
    Clock,
    ArrowRight,
    Zap,
    TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { progressService } from "@/services/progress.service";
import { useAuthStore } from "@/store/auth.store";
import { ROUTES } from "@/constants/routes";
import { getLanguageName } from "@/constants/languages";
import type { ProgressStats, Achievement } from "@/types/progress";

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<ProgressStats | null>(null);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [statsData, achievementsData] = await Promise.all([
                    progressService.getOverview(),
                    progressService.getAchievements(),
                ]);
                setStats(statsData);
                setAchievements(achievementsData);
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, []);

    const recentAchievements = achievements
        .filter((a) => a.isUnlocked)
        .slice(0, 3);

    const quickActions = [
        {
            title: "Continue Learning",
            description: "Pick up where you left off",
            icon: BookOpen,
            href: ROUTES.DASHBOARD.VOCABULARY,
            color: "bg-primary-500",
        },
        {
            title: "Practice Flashcards",
            description: `${stats?.wordsLearned || 0} words to review`,
            icon: Brain,
            href: ROUTES.DASHBOARD.FLASHCARDS,
            color: "bg-secondary-500",
        },
        {
            title: "Take a Quiz",
            description: "Test your knowledge",
            icon: Target,
            href: ROUTES.DASHBOARD.ASSESSMENTS,
            color: "bg-amber-500",
        },
    ];

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Flame}
                    label="Current Streak"
                    value={`${stats?.currentStreak || 0} days`}
                    subtext={`Best: ${stats?.longestStreak || 0} days`}
                    color="text-orange-500"
                    bgColor="bg-orange-100"
                    delay={0}
                />
                <StatCard
                    icon={Zap}
                    label="Total XP"
                    value={stats?.totalXp?.toLocaleString() || "0"}
                    subtext={`${stats?.xpToNextLevel || 0} to next level`}
                    color="text-primary-500"
                    bgColor="bg-primary-100"
                    delay={0.1}
                />
                <StatCard
                    icon={BookOpen}
                    label="Words Learned"
                    value={stats?.wordsLearned?.toString() || "0"}
                    subtext={`${stats?.wordsMastered || 0} mastered`}
                    color="text-blue-500"
                    bgColor="bg-blue-100"
                    delay={0.2}
                />
                <StatCard
                    icon={Clock}
                    label="Study Time"
                    value={formatStudyTime(stats?.totalStudyTime || 0)}
                    subtext={`Avg. ${stats?.averageSessionTime || 0} min/session`}
                    color="text-purple-500"
                    bgColor="bg-purple-100"
                    delay={0.3}
                />
            </div>

            {/* Progress & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Level Progress */}
                <Card variant="elevated" className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary-500" />
                            Your Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <span className="text-2xl font-bold text-slate-900">
                                        Level {stats?.currentLevel || "A1"}
                                    </span>
                                    <span className="text-slate-500 ml-2">
                                        {getLanguageName(
                                            user?.profile?.targetLanguage || "es"
                                        )}
                                    </span>
                                </div>
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
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-900">
                                    {stats?.lessonsCompleted || 0}
                                </div>
                                <div className="text-sm text-slate-500">
                                    Lessons
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-900">
                                    {stats?.quizzesPassed || 0}
                                </div>
                                <div className="text-sm text-slate-500">
                                    Quizzes Passed
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-900">
                                    {stats?.overallAccuracy || 0}%
                                </div>
                                <div className="text-sm text-slate-500">
                                    Accuracy
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Achievements */}
                <Card variant="elevated">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-amber-500" />
                                Achievements
                            </span>
                            <Link
                                href={ROUTES.DASHBOARD.PROGRESS}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                View all
                            </Link>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentAchievements.length > 0 ? (
                            <div className="space-y-3">
                                {recentAchievements.map((achievement) => (
                                    <div
                                        key={achievement.id}
                                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                            <Trophy className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 truncate">
                                                {achievement.name}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                +{achievement.xpReward} XP
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center py-4">
                                Complete lessons to earn achievements!
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => (
                        <motion.div
                            key={action.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={action.href}>
                                <Card
                                    variant="interactive"
                                    padding="lg"
                                    className="h-full"
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center flex-shrink-0`}
                                        >
                                            <action.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-slate-900">
                                                {action.title}
                                            </h4>
                                            <p className="text-sm text-slate-500 mt-1">
                                                {action.description}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-slate-400" />
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    subtext,
    color,
    bgColor,
    delay,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    subtext: string;
    color: string;
    bgColor: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Card variant="elevated" padding="md">
                <div className="flex items-center gap-4">
                    <div
                        className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}
                    >
                        <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">{label}</p>
                        <p className="text-2xl font-bold text-slate-900">
                            {value}
                        </p>
                        <p className="text-xs text-slate-400">{subtext}</p>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} variant="elevated" padding="md">
                        <div className="flex items-center gap-4">
                            <Skeleton
                                variant="rounded"
                                width={48}
                                height={48}
                            />
                            <div className="space-y-2">
                                <Skeleton width={80} height={16} />
                                <Skeleton width={60} height={24} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function formatStudyTime(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
