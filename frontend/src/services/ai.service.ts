import { api, mockDelay, isMockMode } from "./api";

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
    translation?: string;
}

export interface Conversation {
    id: string;
    title: string;
    language: string;
    createdAt: string;
    updatedAt: string;
    messageCount: number;
}

// Mock conversation responses
const mockResponses: Record<string, string[]> = {
    default: [
        "¡Hola! ¿Cómo puedo ayudarte hoy?",
        "¡Muy bien! ¿Qué te gustaría practicar?",
        "Eso es correcto. ¡Muy buen trabajo!",
        "Interesante pregunta. Déjame explicarte...",
    ],
    greeting: [
        "¡Hola! ¿Cómo estás?",
        "¡Buenos días! ¿Qué tal?",
        "¡Buenas tardes! ¿Cómo te va?",
    ],
};

export const aiService = {
    /**
     * Get all conversations
     */
    async getConversations(): Promise<Conversation[]> {
        if (isMockMode()) {
            await mockDelay(500);
            return [
                {
                    id: "conv_1",
                    title: "Práctica de saludos",
                    language: "es",
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    updatedAt: new Date(Date.now() - 3600000).toISOString(),
                    messageCount: 8,
                },
                {
                    id: "conv_2",
                    title: "En el restaurante",
                    language: "es",
                    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
                    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                    messageCount: 12,
                },
            ];
        }

        const response = await api.get<Conversation[]>("/ai/conversations");
        return response.data;
    },

    /**
     * Get messages for a conversation
     */
    async getMessages(conversationId: string): Promise<Message[]> {
        if (isMockMode()) {
            await mockDelay(400);
            return [
                {
                    id: "msg_1",
                    role: "assistant",
                    content: "¡Hola! Soy tu asistente de aprendizaje. ¿Cómo puedo ayudarte hoy?",
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    translation: "Hello! I'm your learning assistant. How can I help you today?",
                },
                {
                    id: "msg_2",
                    role: "user",
                    content: "Hola, quiero practicar español",
                    timestamp: new Date(Date.now() - 3500000).toISOString(),
                },
                {
                    id: "msg_3",
                    role: "assistant",
                    content: "¡Perfecto! ¿Qué te gustaría practicar? Podemos hablar de cualquier tema.",
                    timestamp: new Date(Date.now() - 3400000).toISOString(),
                    translation: "Perfect! What would you like to practice? We can talk about any topic.",
                },
            ];
        }

        const response = await api.get<Message[]>(
            `/ai/conversations/${conversationId}/messages`
        );
        return response.data;
    },

    /**
     * Send a message and get AI response
     */
    async sendMessage(
        conversationId: string | null,
        content: string,
        language: string = "es"
    ): Promise<{ conversationId: string; userMessage: Message; aiMessage: Message }> {
        if (isMockMode()) {
            await mockDelay(1000);

            const convId = conversationId || `conv_${Date.now()}`;
            const now = new Date().toISOString();

            // Select a random response
            const responses = mockResponses.default;
            const aiContent = responses[Math.floor(Math.random() * responses.length)];

            return {
                conversationId: convId,
                userMessage: {
                    id: `msg_${Date.now()}_user`,
                    role: "user",
                    content,
                    timestamp: now,
                },
                aiMessage: {
                    id: `msg_${Date.now()}_ai`,
                    role: "assistant",
                    content: aiContent,
                    timestamp: new Date(Date.now() + 100).toISOString(),
                    translation: translateMock(aiContent),
                },
            };
        }

        const response = await api.post<{
            conversationId: string;
            userMessage: Message;
            aiMessage: Message;
        }>(`/ai/chat`, {
            conversationId,
            content,
            language,
        });
        return response.data;
    },

    /**
     * Create a new conversation
     */
    async createConversation(
        language: string
    ): Promise<{ conversation: Conversation; welcomeMessage: Message }> {
        if (isMockMode()) {
            await mockDelay(500);
            const conversation: Conversation = {
                id: `conv_${Date.now()}`,
                title: "Nueva conversación",
                language,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                messageCount: 1,
            };

            const welcomeMessage: Message = {
                id: `msg_${Date.now()}`,
                role: "assistant",
                content: "¡Hola! Soy tu asistente de aprendizaje. ¿Cómo puedo ayudarte hoy?",
                timestamp: new Date().toISOString(),
                translation: "Hello! I'm your learning assistant. How can I help you today?",
            };

            return { conversation, welcomeMessage };
        }

        const response = await api.post<{
            conversation: Conversation;
            welcomeMessage: Message;
        }>("/ai/conversations", { language });
        return response.data;
    },
};

function translateMock(spanish: string): string {
    const translations: Record<string, string> = {
        "¡Hola! ¿Cómo puedo ayudarte hoy?": "Hello! How can I help you today?",
        "¡Muy bien! ¿Qué te gustaría practicar?": "Very good! What would you like to practice?",
        "Eso es correcto. ¡Muy buen trabajo!": "That's correct. Great job!",
        "Interesante pregunta. Déjame explicarte...": "Interesting question. Let me explain...",
    };
    return translations[spanish] || "Translation not available";
}

export default aiService;
