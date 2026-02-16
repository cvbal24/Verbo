"use client";

import { useState, useCallback, useEffect } from "react";
import { aiService } from "@/services/ai.service";
import type { Message, Conversation } from "@/services/ai.service";

export function useConversations() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await aiService.getConversations();
            setConversations(data);
        } catch {
            setError("Failed to load conversations");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return { conversations, isLoading, error, reload: load };
}

export function useChat(initialConversationId?: string | null) {
    const [conversationId, setConversationId] = useState<string | null>(
        initialConversationId || null
    );
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadMessages = useCallback(async (convId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await aiService.getMessages(convId);
            setMessages(data);
        } catch {
            setError("Failed to load messages");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const startNewConversation = useCallback(
        async (language: string = "es") => {
            setIsLoading(true);
            setError(null);
            try {
                const { conversation, welcomeMessage } =
                    await aiService.createConversation(language);
                setConversationId(conversation.id);
                setMessages([welcomeMessage]);
                return conversation.id;
            } catch {
                setError("Failed to start conversation");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const sendMessage = useCallback(
        async (content: string, language: string = "es") => {
            setIsSending(true);
            setError(null);
            try {
                const result = await aiService.sendMessage(
                    conversationId,
                    content,
                    language
                );
                setConversationId(result.conversationId);
                setMessages((prev) => [
                    ...prev,
                    result.userMessage,
                    result.aiMessage,
                ]);
                return result;
            } catch {
                setError("Failed to send message");
                return null;
            } finally {
                setIsSending(false);
            }
        },
        [conversationId]
    );

    useEffect(() => {
        if (initialConversationId) {
            loadMessages(initialConversationId);
        }
    }, [initialConversationId, loadMessages]);

    return {
        conversationId,
        messages,
        isLoading,
        isSending,
        error,
        sendMessage,
        startNewConversation,
        loadMessages,
    };
}
