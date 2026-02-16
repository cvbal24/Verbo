"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/features/auth/LoginForm";
import { ROUTES } from "@/constants/routes";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link
                        href={ROUTES.HOME}
                        className="inline-flex items-center gap-3 group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-2xl text-slate-900">
                            Verbo
                        </span>
                    </Link>
                </div>

                <Card variant="elevated" padding="lg">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">
                            Welcome back
                        </h1>
                        <p className="text-slate-500">
                            Sign in to continue your learning journey
                        </p>
                    </div>

                    <LoginForm />
                </Card>

                <p className="text-center text-sm text-slate-500 mt-6">
                    By signing in, you agree to our{" "}
                    <Link
                        href="/terms"
                        className="text-primary-600 hover:text-primary-700"
                    >
                        Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy"
                        className="text-primary-600 hover:text-primary-700"
                    >
                        Privacy Policy
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
