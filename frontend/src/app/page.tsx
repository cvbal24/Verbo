
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
    BookOpen,
    Mic,
    MessageCircle,
    BarChart,
    Globe,
    Zap,
    Star,
    CheckCircle,
    Brain,
    Headphones,
    PenTool
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-slate-900 selection:bg-primary-100 selection:text-primary-900">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative px-6 pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-b from-white to-primary-50/50">
                    <div className="container mx-auto max-w-5xl relative z-10 text-center">

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <span className="inline-flex items-center space-x-2 py-2 px-4 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-8 border border-primary-100">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                                </span>
                                <span>Now supporting 4 major languages</span>
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-slate-900 leading-[1.1]"
                        >
                            Master languages the <br className="hidden md:block" />
                            <span className="text-primary-500 relative whitespace-nowrap">
                                neuro-friendly way.
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                            className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
                        >
                            Learn <strong>Spanish, Korean, Japanese, and French</strong> with a platform built for your brain. clear instructions, gentle AI corrections, and zero stress.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link href="/auth/register" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto text-lg shadow-xl shadow-primary-500/20 hover:shadow-primary-500/30">
                                    Start Placement Test
                                </Button>
                            </Link>
                            <div className="flex items-center gap-4 text-sm font-medium text-slate-500 px-4">
                                {/* Language Icons Placeholder */}
                                <div className="flex space-x-2 text-slate-400">
                                    <span title="Spanish">🇪🇸</span>
                                    <span title="French">🇫🇷</span>
                                    <span title="Japanese">🇯🇵</span>
                                    <span title="Korean">🇰🇷</span>
                                </div>
                                <span>Beginner to Intermediate</span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Core Value / Neuro-friendly Focus */}
                <section className="py-24 bg-white relative">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="relative">
                                <div className="relative z-10 bg-primary-500 rounded-3xl p-1 shadow-2xl rotate-2">
                                    <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop" alt="Student learning" className="rounded-2xl" />
                                </div>
                                <div className="absolute inset-0 bg-secondary-300 rounded-3xl -rotate-2 scale-105 opacity-50 blur-xl -z-10"></div>
                            </div>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Designed for <span className="text-primary-500">inclusion.</span></h2>
                                <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                                    Traditional apps can be overstimulating. Verbo helps you focus with features specifically designed for neuro-diverse learners and absolute beginners.
                                </p>
                                <div className="space-y-6">
                                    <ValueItem
                                        title="Neuro-Friendly Instruction Assist"
                                        description="Auto-play demonstrations, specific voice prompts, and step-by-step tours guide you through every task."
                                    />
                                    <ValueItem
                                        title="Mistake Notebook"
                                        description="We automatically track your weak spots so you can review them later without the pressure of failing a quiz."
                                    />
                                    <ValueItem
                                        title="Slow-Mode Audio"
                                        description="Hear every syllable clearly with our specialized slow-mode playback for better pronunciation."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Grid based on PROJECT_GUIDE.md */}
                <section id="features" className="py-24 bg-surface">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="text-center mb-16 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Complete Language Toolset</h2>
                            <p className="text-lg text-slate-500">
                                From your first word to real conversations, we have the tools to support your journey.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<BookOpen className="w-6 h-6 text-primary-600" />}
                                title="Interactive Vocabulary"
                                description="Structured builder with audio pronunciation for every term to build a rock-solid foundation."
                                delay={0.1}
                            />
                            <FeatureCard
                                icon={<MessageCircle className="w-6 h-6 text-secondary-600" />}
                                title="AI Conversation Partner"
                                description="Chat in real-time with an AI that adapts to your level and gives gentle, corrective feedback."
                                delay={0.2}
                            />
                            <FeatureCard
                                icon={<Globe className="w-6 h-6 text-primary-600" />}
                                title="Mini Dialog Missions"
                                description="Practice real-life scenarios like ordering food or asking for directions in a safe environment."
                                delay={0.3}
                            />
                            <FeatureCard
                                icon={<PenTool className="w-6 h-6 text-secondary-600" />}
                                title="Assessment Tools"
                                description="Multiple-choice quizzes, listening tests, and writing tasks to check your comprehension."
                                delay={0.4}
                            />
                            <FeatureCard
                                icon={<Headphones className="w-6 h-6 text-primary-600" />}
                                title="Beginner Voice Recorder"
                                description="Record yourself and compare your audio wave-by-wave with native speaker models."
                                delay={0.5}
                            />
                            <FeatureCard
                                icon={<Brain className="w-6 h-6 text-secondary-600" />}
                                title="Achievement Journal"
                                description="A reflective diary to record your milestones, first spoken sentences, and personal growth."
                                delay={0.6}
                            />
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section id="testimonials" className="py-24 bg-white">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4 text-slate-900">Learner Stories</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <TestimonialCard
                                quote="The neuro-friendly instructions made it so easy for me to start learning Korean without getting overwhelmed."
                                author="Sarah J."
                                role="Learning Korean"
                                delay={0.1}
                            />
                            <TestimonialCard
                                quote="I love the Mistake Notebook. It helps me focus exactly on what I need to fix in my Spanish grammar."
                                author="Miguel R."
                                role="Learning Spanish"
                                delay={0.2}
                            />
                            <TestimonialCard
                                quote="The AI conversation partner helped me practice ordering food in French before my trip to Paris!"
                                author="Elena D."
                                role="Learning French"
                                delay={0.3}
                            />
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-24 bg-surface">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Simple, transparent pricing.</h2>
                            <p className="text-lg text-slate-500">
                                Start for free, upgrade when you're ready for the full immersive experience.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Free Plan */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="p-8 bg-white rounded-3xl border border-slate-200 hover:border-slate-300 transition-colors"
                            >
                                <div className="mb-4">
                                    <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-600 text-xs font-bold tracking-wide uppercase">
                                        Free Forever
                                    </span>
                                </div>
                                <h3 className="text-4xl font-bold text-slate-900 mb-2">$0</h3>
                                <p className="text-slate-500 mb-8">Perfect for casual learners.</p>

                                <ul className="space-y-4 mb-8">
                                    <PricingFeature text="Access to all 4 languages" />
                                    <PricingFeature text="Basic daily lessons" />
                                    <PricingFeature text="Mistake Notebook (Limited)" />
                                    <PricingFeature text="Community support" />
                                </ul>

                                <Link href="/auth/register">
                                    <Button variant="outline" size="lg" className="w-full border-slate-200 hover:bg-slate-50 text-slate-700">
                                        Get Started Free
                                    </Button>
                                </Link>
                            </motion.div>

                            {/* Premium Plan */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="p-8 bg-white rounded-3xl border-2 border-primary-500 relative shadow-2xl shadow-primary-500/10"
                            >
                                <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl rounded-tr-2xl">
                                    RECOMMENDED
                                </div>
                                <div className="mb-4">
                                    <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-700 text-xs font-bold tracking-wide uppercase">
                                        Verbo Plus
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <h3 className="text-4xl font-bold text-slate-900">$12</h3>
                                    <span className="text-slate-500">/month</span>
                                </div>
                                <p className="text-slate-500 mb-8">For serious fluency seekers.</p>

                                <ul className="space-y-4 mb-8">
                                    <PricingFeature text="Unlimited AI Conversations" highlighted />
                                    <PricingFeature text="Full Mistake Notebook Access" />
                                    <PricingFeature text="Advanced Neuro-Friendly Modes" />
                                    <PricingFeature text="Offline Learning Mode" />
                                    <PricingFeature text="Priority Feedback" />
                                </ul>

                                <Link href="/auth/register?plan=premium">
                                    <Button size="lg" className="w-full shadow-lg shadow-primary-500/20">
                                        Try Free for 7 Days
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-surface border-t border-slate-100">
                    <div className="container mx-auto px-6 max-w-4xl text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900">Ready to speak?</h2>
                        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
                            Join learners mastering Spanish, Korean, Japanese, and French today.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/auth/register">
                                <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-primary-500/20">
                                    Start Free Trial
                                </Button>
                            </Link>
                            <Link href="/auth/login">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-200">
                                    Take Placement Test
                                </Button>
                            </Link>
                        </div>
                        <p className="text-sm text-slate-400 mt-8">
                            Multi-language support · Adaptive Difficulty · Neuro-inclusive
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function PricingFeature({ text, highlighted = false }: { text: string, highlighted?: boolean }) {
    return (
        <li className="flex items-start gap-3">
            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${highlighted ? 'bg-primary-500 text-white' : 'bg-primary-50 text-primary-600'}`}>
                <CheckCircle size={12} strokeWidth={3} />
            </div>
            <span className={`text-sm ${highlighted ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>{text}</span>
        </li>
    )
}

function ValueItem({ title, description }: { title: string, description: string }) {
    return (
        <div className="flex gap-4">
            <div className="mt-1 bg-primary-100 rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0">
                <CheckCircle size={14} className="text-primary-600" />
            </div>
            <div>
                <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-slate-500 text-sm">{description}</p>
            </div>
        </div>
    )
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay, duration: 0.5 }}
            className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
            <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center mb-6 text-primary-600">
                {icon}
            </div>
            <h3 className="font-bold text-xl mb-3 text-slate-900">{title}</h3>
            <p className="text-slate-500 leading-relaxed text-sm font-medium">{description}</p>
        </motion.div>
    );
}

interface TestimonialCardProps {
    quote: string;
    author: string;
    role: string;
    delay: number;
}

function TestimonialCard({ quote, author, role, delay }: TestimonialCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay, duration: 0.5 }}
            className="p-8 bg-surface rounded-3xl border-none"
        >
            <div className="mb-6 text-primary-300">
                <Star size={20} fill="currentColor" />
            </div>
            <p className="text-lg text-slate-700 mb-6 leading-relaxed font-medium">"{quote}"</p>
            <div>
                <div className="font-bold text-slate-900">{author}</div>
                <div className="text-sm text-slate-400 uppercase tracking-widest font-semibold text-xs mt-1">{role}</div>
            </div>
        </motion.div>
    );
}
