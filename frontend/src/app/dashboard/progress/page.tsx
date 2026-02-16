"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressOverview } from "@/features/progress/ProgressOverview";
import { AchievementJournal } from "@/features/progress/AchievementJournal";
import { cn } from "@/lib/utils";

type Tab = "overview" | "achievements";

export default function ProgressPage() {
    const [activeTab, setActiveTab] = useState<Tab>("overview");

    const tabs = [
        { id: "overview" as const, label: "Overview", icon: TrendingUp },
        { id: "achievements" as const, label: "Achievements", icon: Trophy },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    Progress
                </h1>
                <p className="text-slate-500">
                    Track your learning journey and achievements
                </p>
            </motion.div>

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex gap-2"
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                            activeTab === tab.id
                                ? "bg-primary-500 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </motion.div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                {activeTab === "overview" && <ProgressOverview />}
                {activeTab === "achievements" && <AchievementJournal />}
            </motion.div>
        </div>
    );
}
