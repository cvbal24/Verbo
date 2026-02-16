"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { ChatWindow } from "@/features/ai/ChatWindow";

export default function AIChatPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            AI Chat
                        </h1>
                        <p className="text-slate-500">
                            Practice conversations with your AI tutor
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Chat Window */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <ChatWindow language="es" />
            </motion.div>
        </div>
    );
}
