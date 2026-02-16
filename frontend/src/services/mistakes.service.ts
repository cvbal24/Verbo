import { api, mockDelay, isMockMode } from "./api";

export interface Mistake {
    id: string;
    type: "vocabulary" | "grammar" | "spelling" | "pronunciation";
    originalText: string;
    correctText: string;
    explanation: string;
    context?: string;
    language: string;
    reviewCount: number;
    lastReviewedAt?: string;
    createdAt: string;
    isResolved: boolean;
}

export interface MistakeFilters {
    type?: Mistake["type"][];
    isResolved?: boolean;
    search?: string;
}

const mockMistakes: Mistake[] = [
    {
        id: "mistake_1",
        type: "grammar",
        originalText: "Yo soy comer",
        correctText: "Yo estoy comiendo",
        explanation: "Use 'estar + gerund' for ongoing actions, not 'ser + infinitive'.",
        context: "In a quiz about present continuous",
        language: "es",
        reviewCount: 2,
        lastReviewedAt: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        isResolved: false,
    },
    {
        id: "mistake_2",
        type: "vocabulary",
        originalText: "embarazada",
        correctText: "avergonzada",
        explanation: "'Embarazada' means 'pregnant', not 'embarrassed'. 'Avergonzada' means 'embarrassed'.",
        context: "Translation exercise",
        language: "es",
        reviewCount: 1,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        isResolved: false,
    },
    {
        id: "mistake_3",
        type: "grammar",
        originalText: "Tengo 25 años",
        correctText: "Tengo 25 años",
        explanation: "In Spanish, we use 'tener' (to have) for age, not 'ser' (to be).",
        context: "Introducing yourself",
        language: "es",
        reviewCount: 3,
        lastReviewedAt: new Date(Date.now() - 3600000).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        isResolved: true,
    },
    {
        id: "mistake_4",
        type: "spelling",
        originalText: "habia",
        correctText: "había",
        explanation: "Don't forget the accent mark on 'había' (imperfect tense of 'haber').",
        language: "es",
        reviewCount: 0,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        isResolved: false,
    },
];

export const mistakesService = {
    /**
     * Get all mistakes with optional filters
     */
    async getMistakes(filters?: MistakeFilters): Promise<Mistake[]> {
        if (isMockMode()) {
            await mockDelay(500);

            let result = [...mockMistakes];

            if (filters?.type?.length) {
                result = result.filter((m) => filters.type!.includes(m.type));
            }

            if (filters?.isResolved !== undefined) {
                result = result.filter(
                    (m) => m.isResolved === filters.isResolved
                );
            }

            if (filters?.search) {
                const search = filters.search.toLowerCase();
                result = result.filter(
                    (m) =>
                        m.originalText.toLowerCase().includes(search) ||
                        m.correctText.toLowerCase().includes(search) ||
                        m.explanation.toLowerCase().includes(search)
                );
            }

            return result;
        }

        const params = new URLSearchParams();
        if (filters?.type) {
            filters.type.forEach((t) => params.append("type", t));
        }
        if (filters?.isResolved !== undefined) {
            params.set("isResolved", String(filters.isResolved));
        }
        if (filters?.search) {
            params.set("search", filters.search);
        }

        const response = await api.get<Mistake[]>(`/mistakes?${params}`);
        return response.data;
    },

    /**
     * Get a single mistake by ID
     */
    async getMistake(id: string): Promise<Mistake> {
        if (isMockMode()) {
            await mockDelay(300);
            const mistake = mockMistakes.find((m) => m.id === id);
            if (!mistake) {
                throw { message: "Mistake not found", status: 404 };
            }
            return mistake;
        }

        const response = await api.get<Mistake>(`/mistakes/${id}`);
        return response.data;
    },

    /**
     * Mark a mistake as reviewed
     */
    async markReviewed(id: string): Promise<Mistake> {
        if (isMockMode()) {
            await mockDelay(300);
            const mistake = mockMistakes.find((m) => m.id === id);
            if (mistake) {
                mistake.reviewCount++;
                mistake.lastReviewedAt = new Date().toISOString();
            }
            return mistake || mockMistakes[0];
        }

        const response = await api.post<Mistake>(`/mistakes/${id}/review`);
        return response.data;
    },

    /**
     * Mark a mistake as resolved
     */
    async markResolved(id: string): Promise<Mistake> {
        if (isMockMode()) {
            await mockDelay(300);
            const mistake = mockMistakes.find((m) => m.id === id);
            if (mistake) {
                mistake.isResolved = true;
            }
            return mistake || mockMistakes[0];
        }

        const response = await api.post<Mistake>(`/mistakes/${id}/resolve`);
        return response.data;
    },

    /**
     * Get mistake statistics
     */
    async getStats(): Promise<{
        total: number;
        resolved: number;
        byType: Record<Mistake["type"], number>;
    }> {
        if (isMockMode()) {
            await mockDelay(400);
            return {
                total: mockMistakes.length,
                resolved: mockMistakes.filter((m) => m.isResolved).length,
                byType: {
                    vocabulary: mockMistakes.filter(
                        (m) => m.type === "vocabulary"
                    ).length,
                    grammar: mockMistakes.filter((m) => m.type === "grammar")
                        .length,
                    spelling: mockMistakes.filter((m) => m.type === "spelling")
                        .length,
                    pronunciation: mockMistakes.filter(
                        (m) => m.type === "pronunciation"
                    ).length,
                },
            };
        }

        const response = await api.get<{
            total: number;
            resolved: number;
            byType: Record<Mistake["type"], number>;
        }>("/mistakes/stats");
        return response.data;
    },
};

export default mistakesService;
