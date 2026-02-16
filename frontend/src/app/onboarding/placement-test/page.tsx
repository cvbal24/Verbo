"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Globe, GraduationCap } from "lucide-react";
import { PlacementTest } from "@/features/onboarding/PlacementTest";
import { ROUTES } from "@/constants/routes";

export default function PlacementTestPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm border-b border-slate-100 z-50">
                <Link
                    href={ROUTES.HOME}
                    className="flex items-center gap-2 group"
                >
                    <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl text-slate-900">
                        Verbo
                    </span>
                </Link>
            </header>

            {/* Main Content */}
            <main className="pt-32 pb-16 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mx-auto"
                >
                    {/* Step Indicator */}
                    <div className="flex items-center justify-center gap-2 mb-12">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                <Globe className="w-4 h-4 text-primary-600" />
                            </div>
                            <span className="text-sm text-slate-400">
                                Language
                            </span>
                        </div>
                        <div className="w-12 h-0.5 bg-primary-200" />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                                <GraduationCap className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-primary-600">
                                Placement Test
                            </span>
                        </div>
                    </div>

                    {/* Test Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-slate-900 mb-3">
                            Let&apos;s find your level
                        </h1>
                        <p className="text-slate-500 text-lg max-w-md mx-auto">
                            Answer a few questions so we can personalize your
                            learning experience
                        </p>
                    </div>

                    <PlacementTest />
                </motion.div>
            </main>
        </div>
    );
}
