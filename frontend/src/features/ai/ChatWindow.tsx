"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { MessageBubble } from "./MessageBubble";
import { useChat } from "./ai.hooks";

interface ChatWindowProps {
    conversationId?: string | null;
    language?: string;
}

export function ChatWindow({
    conversationId: initialConversationId,
    language = "es",
}: ChatWindowProps) {
    const {
        messages,
        isLoading,
        isSending,
        error,
        sendMessage,
        startNewConversation,
        conversationId,
    } = useChat(initialConversationId);

    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Start a new conversation if none provided
    useEffect(() => {
        if (!initialConversationId && !conversationId && !isLoading) {
            startNewConversation(language);
        }
    }, [initialConversationId, conversationId, isLoading, startNewConversation, language]);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || isSending) return;

        setInput("");
        await sendMessage(trimmed, language);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleNewConversation = () => {
        startNewConversation(language);
        setInput("");
    };

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                    <h3 className="font-semibold text-slate-900">
                        AI Conversation Partner
                    </h3>
                    <p className="text-sm text-slate-500">
                        Practice your language skills
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNewConversation}
                >
                    <Plus className="w-4 h-4 mr-1" />
                    New Chat
                </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`flex gap-3 ${i % 2 === 0 ? "flex-row-reverse" : ""}`}
                            >
                                <Skeleton variant="circular" width={32} height={32} />
                                <Skeleton
                                    variant="rounded"
                                    width={240}
                                    height={60}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <AnimatePresence>
                        {messages.map((message) => (
                            <MessageBubble key={message.id} message={message} />
                        ))}
                    </AnimatePresence>
                )}

                {/* Typing indicator */}
                {isSending && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
                        </div>
                        <div className="px-4 py-3 bg-slate-50 rounded-2xl rounded-bl-md">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                                <span
                                    className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.1s" }}
                                />
                                <span
                                    className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
                    >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-100 px-6 py-4">
                <div className="flex items-end gap-3">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        rows={1}
                        className="flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-slate-400 max-h-32"
                        style={{
                            height: "auto",
                            minHeight: "44px",
                        }}
                        disabled={isSending || isLoading}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim() || isSending || isLoading}
                        className="shrink-0"
                    >
                        {isSending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </Button>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}

export default ChatWindow;
