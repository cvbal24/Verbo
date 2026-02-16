"use client";

import { motion } from "framer-motion";
import { AlertTriangle, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { MistakeList } from "@/features/mistakes/MistakeList";
import { useMistakeStats } from "@/features/mistakes/mistakes.hooks";

export default function MistakesPage() {
    const { stats, isLoading: statsLoading } = useMistakeStats();

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Mistake Notebook
                        </h1>
                        <p className="text-slate-500">
                            Review and learn from your mistakes
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {statsLoading ? (
                    [1, 2, 3, 4].map((i) => (
                        <Card key={i} variant="elevated" padding="md">
                            <Skeleton width="60%" height={16} />
                            <Skeleton width="40%" height={24} className="mt-2" />
                        </Card>
                    ))
                ) : (
                    <>
                        <StatCard
                            label="Total Mistakes"
                            value={stats?.total || 0}
                            icon={<BarChart3 className="w-5 h-5 text-slate-500" />}
                        />
                        <StatCard
                            label="Resolved"
                            value={stats?.resolved || 0}
                            icon={<BarChart3 className="w-5 h-5 text-green-500" />}
                        />
                        <StatCard
                            label="Active"
                            value={(stats?.total || 0) - (stats?.resolved || 0)}
                            icon={<BarChart3 className="w-5 h-5 text-amber-500" />}
                        />
                        <StatCard
                            label="Grammar"
                            value={stats?.byType?.grammar || 0}
                            icon={<BarChart3 className="w-5 h-5 text-purple-500" />}
                        />
                    </>
                )}
            </motion.div>

            {/* Mistake List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <MistakeList />
            </motion.div>
        </div>
    );
}

function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
}) {
    return (
        <Card variant="elevated" padding="md">
            <CardContent className="flex items-center gap-3 p-0">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="text-xl font-bold text-slate-900">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}
