"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    MessageSquare,
    MapPin,
    ShoppingCart,
    Utensils,
    Briefcase,
    Heart,
    ArrowRight,
    Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChatWindow } from "@/features/ai/ChatWindow";
import { cn } from "@/lib/utils";

interface Mission {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    scenario: string;
    color: string;
    bgColor: string;
}

const missions: Mission[] = [
    {
        id: "ordering_food",
        title: "Ordering Food",
        description: "Practice ordering at a restaurant in Spanish",
        icon: Utensils,
        difficulty: "Beginner",
        scenario: "You're at a restaurant in Madrid. Order a meal and interact with the waiter.",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
    },
    {
        id: "asking_directions",
        title: "Asking for Directions",
        description: "Navigate a Spanish city by asking locals for help",
        icon: MapPin,
        difficulty: "Beginner",
        scenario: "You're lost in Barcelona. Ask pedestrians for directions to the nearest metro station.",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
    },
    {
        id: "shopping",
        title: "Going Shopping",
        description: "Buy clothes and negotiate prices at a market",
        icon: ShoppingCart,
        difficulty: "Intermediate",
        scenario: "You're at a market in Mexico City. Browse items, ask about sizes, and negotiate prices.",
        color: "text-green-600",
        bgColor: "bg-green-100",
    },
    {
        id: "job_interview",
        title: "Job Interview",
        description: "Practice professional conversation skills",
        icon: Briefcase,
        difficulty: "Advanced",
        scenario: "You're interviewing for a position at a Spanish company. Present your qualifications.",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
    },
    {
        id: "doctor_visit",
        title: "Doctor Visit",
        description: "Describe symptoms and understand medical advice",
        icon: Heart,
        difficulty: "Intermediate",
        scenario: "You're visiting a doctor in Buenos Aires. Describe your symptoms and ask about treatment.",
        color: "text-red-600",
        bgColor: "bg-red-100",
    },
];

const difficultyColors = {
    Beginner: "bg-green-100 text-green-700",
    Intermediate: "bg-amber-100 text-amber-700",
    Advanced: "bg-red-100 text-red-700",
};

export default function DialogMissionsPage() {
    const [activeMission, setActiveMission] = useState<Mission | null>(null);

    if (activeMission) {
        return (
            <div className="space-y-6">
                {/* Mission Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                activeMission.bgColor
                            )}
                        >
                            <activeMission.icon
                                className={cn("w-5 h-5", activeMission.color)}
                            />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                {activeMission.title}
                            </h1>
                            <p className="text-sm text-slate-500">
                                {activeMission.scenario}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveMission(null)}
                    >
                        Exit Mission
                    </Button>
                </motion.div>

                <ChatWindow language="es" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Dialog Missions
                        </h1>
                        <p className="text-slate-500">
                            Practice real-world conversations through scenarios
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Missions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {missions.map((mission, index) => (
                    <motion.div
                        key={mission.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card
                            variant="interactive"
                            padding="md"
                            className="h-full flex flex-col"
                        >
                            <CardContent className="p-0 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-3">
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center",
                                            mission.bgColor
                                        )}
                                    >
                                        <mission.icon
                                            className={cn(
                                                "w-5 h-5",
                                                mission.color
                                            )}
                                        />
                                    </div>
                                    <span
                                        className={cn(
                                            "px-2 py-0.5 rounded-full text-xs font-medium",
                                            difficultyColors[mission.difficulty]
                                        )}
                                    >
                                        {mission.difficulty}
                                    </span>
                                </div>

                                <h3 className="font-semibold text-slate-900 mb-1">
                                    {mission.title}
                                </h3>
                                <p className="text-sm text-slate-500 mb-4 flex-1">
                                    {mission.description}
                                </p>

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setActiveMission(mission)}
                                >
                                    Start Mission
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
