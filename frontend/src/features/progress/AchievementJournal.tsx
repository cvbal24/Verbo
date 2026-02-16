"use client";

import { motion } from "framer-motion";
import { Trophy, Lock, Star, Calendar, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAchievements, useMilestones, useJournal } from "./progress.hooks";
import { cn } from "@/lib/utils";
import type { Achievement, Milestone, JournalEntry } from "@/types/progress";

export function AchievementJournal() {
    const {
        unlockedAchievements,
        lockedAchievements,
        isLoading: achievementsLoading,
    } = useAchievements();
    const { milestones, isLoading: milestonesLoading } = useMilestones();
    const { entries, isLoading: journalLoading } = useJournal();

    return (
        <div className="space-y-8">
            {/* Achievements */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card variant="elevated">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            Achievements
                            <span className="text-sm font-normal text-slate-500 ml-2">
                                {unlockedAchievements.length} unlocked
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {achievementsLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        height={120}
                                        variant="rounded"
                                    />
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* Unlocked */}
                                {unlockedAchievements.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        {unlockedAchievements.map(
                                            (achievement, index) => (
                                                <AchievementCard
                                                    key={achievement.id}
                                                    achievement={achievement}
                                                    delay={index * 0.05}
                                                />
                                            )
                                        )}
                                    </div>
                                )}

                                {/* Locked */}
                                {lockedAchievements.length > 0 && (
                                    <>
                                        <h4 className="text-sm font-medium text-slate-500 mb-3">
                                            Locked
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {lockedAchievements.map(
                                                (achievement, index) => (
                                                    <AchievementCard
                                                        key={achievement.id}
                                                        achievement={
                                                            achievement
                                                        }
                                                        delay={
                                                            (index +
                                                                unlockedAchievements.length) *
                                                            0.05
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Milestones */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card variant="elevated">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-primary-500" />
                            Milestones
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {milestonesLoading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        height={80}
                                        variant="rounded"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {milestones.map((milestone, index) => (
                                    <MilestoneCard
                                        key={milestone.id}
                                        milestone={milestone}
                                        delay={index * 0.05}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Journal Entries */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card variant="elevated">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            Achievement Journal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {journalLoading ? (
                            <div className="space-y-4">
                                {[...Array(2)].map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        height={100}
                                        variant="rounded"
                                    />
                                ))}
                            </div>
                        ) : entries.length > 0 ? (
                            <div className="space-y-4">
                                {entries.map((entry, index) => (
                                    <JournalEntryCard
                                        key={entry.id}
                                        entry={entry}
                                        delay={index * 0.05}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-slate-500 py-8">
                                Your achievements will appear here as you
                                progress!
                            </p>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

function AchievementCard({
    achievement,
    delay,
}: {
    achievement: Achievement;
    delay: number;
}) {
    const tierColors = {
        bronze: "from-amber-700 to-amber-500",
        silver: "from-slate-400 to-slate-300",
        gold: "from-yellow-500 to-amber-400",
        platinum: "from-cyan-400 to-teal-300",
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            className={cn(
                "relative p-4 rounded-xl border text-center",
                achievement.isUnlocked
                    ? "bg-white border-slate-200"
                    : "bg-slate-50 border-slate-200 opacity-60"
            )}
        >
            {!achievement.isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl">
                    <Lock className="w-6 h-6 text-slate-400" />
                </div>
            )}

            <div
                className={cn(
                    "w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center bg-gradient-to-br",
                    tierColors[achievement.tier]
                )}
            >
                <Trophy className="w-6 h-6 text-white" />
            </div>

            <h4 className="font-medium text-slate-900 text-sm mb-1">
                {achievement.name}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-2">
                {achievement.description}
            </p>

            {!achievement.isUnlocked && (
                <div className="mt-2">
                    <ProgressBar
                        value={achievement.progress}
                        max={achievement.maxProgress}
                        size="sm"
                        color="primary"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                        {achievement.progress}/{achievement.maxProgress}
                    </p>
                </div>
            )}
        </motion.div>
    );
}

function MilestoneCard({
    milestone,
    delay,
}: {
    milestone: Milestone;
    delay: number;
}) {
    const progress = Math.min(
        (milestone.currentValue / milestone.targetValue) * 100,
        100
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className={cn(
                "p-4 rounded-xl border",
                milestone.isCompleted
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-slate-200"
            )}
        >
            <div className="flex items-start gap-4">
                <div
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        milestone.isCompleted
                            ? "bg-green-100"
                            : "bg-primary-100"
                    )}
                >
                    <Star
                        className={cn(
                            "w-5 h-5",
                            milestone.isCompleted
                                ? "text-green-600"
                                : "text-primary-600"
                        )}
                    />
                </div>

                <div className="flex-1">
                    <h4 className="font-medium text-slate-900">
                        {milestone.title}
                    </h4>
                    <p className="text-sm text-slate-500">
                        {milestone.description}
                    </p>

                    {!milestone.isCompleted && (
                        <div className="mt-2">
                            <ProgressBar
                                value={milestone.currentValue}
                                max={milestone.targetValue}
                                size="sm"
                                color="primary"
                                animated
                            />
                            <p className="text-xs text-slate-400 mt-1">
                                {milestone.currentValue}/
                                {milestone.targetValue}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1 text-primary-600">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">
                        +{milestone.xpReward}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

function JournalEntryCard({
    entry,
    delay,
}: {
    entry: JournalEntry;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200"
        >
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h4 className="font-medium text-slate-900">{entry.title}</h4>
                    <p className="text-xs text-slate-500">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
            </div>

            <p className="text-sm text-slate-600 mb-3">{entry.content}</p>

            <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-blue-600">
                    <Zap className="w-4 h-4" />
                    +{entry.stats.xpEarned} XP
                </span>
                <span className="text-slate-500">
                    {entry.stats.wordsLearned} words
                </span>
                <span className="text-slate-500">
                    {entry.stats.studyTime} min
                </span>
            </div>
        </motion.div>
    );
}

export default AchievementJournal;
