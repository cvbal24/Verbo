"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, User, Languages, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@/services/ai.service";

interface MessageBubbleProps {
    message: Message;
    showTranslation?: boolean;
}

export function MessageBubble({ message, showTranslation = true }: MessageBubbleProps) {
    const [isTranslationVisible, setIsTranslationVisible] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const isUser = message.role === "user";

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
        >
            {/* Avatar */}
            <div
                className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    isUser ? "bg-primary-100" : "bg-slate-100"
                )}
            >
                {isUser ? (
                    <User className="w-4 h-4 text-primary-600" />
                ) : (
                    <Bot className="w-4 h-4 text-slate-600" />
                )}
            </div>

            {/* Message Content */}
            <div
                className={cn(
                    "max-w-[75%] space-y-1",
                    isUser ? "items-end" : "items-start"
                )}
            >
                <div
                    className={cn(
                        "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                        isUser
                            ? "bg-primary-500 text-white rounded-br-md"
                            : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
                    )}
                >
                    {message.content}
                </div>

                {/* Translation toggle */}
                {!isUser && message.translation && showTranslation && (
                    <>
                        {isTranslationVisible && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700"
                            >
                                {message.translation}
                            </motion.div>
                        )}
                    </>
                )}

                {/* Actions */}
                <div
                    className={cn(
                        "flex items-center gap-2 px-1",
                        isUser ? "justify-end" : "justify-start"
                    )}
                >
                    <span className="text-[10px] text-slate-400">
                        {new Date(message.timestamp).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                        })}
                    </span>

                    {!isUser && message.translation && showTranslation && (
                        <button
                            onClick={() => setIsTranslationVisible(!isTranslationVisible)}
                            className={cn(
                                "p-1 rounded hover:bg-slate-100 transition-colors",
                                isTranslationVisible
                                    ? "text-blue-500"
                                    : "text-slate-400"
                            )}
                            title="Toggle translation"
                        >
                            <Languages className="w-3.5 h-3.5" />
                        </button>
                    )}

                    <button
                        onClick={handleCopy}
                        className="p-1 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                        title="Copy message"
                    >
                        {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                            <Copy className="w-3.5 h-3.5" />
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default MessageBubble;
