import { api, mockDelay, isMockMode } from "./api";
import type {
    Word,
    VocabularySet,
    FlashcardProgress,
    VocabularyStats,
    VocabularyFilters,
    FlashcardReview,
} from "@/types/vocabulary";
import type { PaginatedResponse } from "@/types/api";

// Mock vocabulary data
const mockWords: Word[] = [
    {
        id: "word_1",
        term: "hola",
        translation: "hello",
        pronunciation: "OH-lah",
        audioUrl: "/audio/hola.mp3",
        partOfSpeech: "interjection",
        definition: "A greeting used when meeting someone",
        exampleSentence: "¡Hola! ¿Cómo estás?",
        exampleTranslation: "Hello! How are you?",
        tags: ["greetings", "basics"],
        difficulty: "A1",
        language: "es",
        createdAt: new Date().toISOString(),
    },
    {
        id: "word_2",
        term: "gracias",
        translation: "thank you",
        pronunciation: "GRAH-see-ahs",
        audioUrl: "/audio/gracias.mp3",
        partOfSpeech: "interjection",
        definition: "An expression of gratitude",
        exampleSentence: "Muchas gracias por tu ayuda.",
        exampleTranslation: "Thank you very much for your help.",
        tags: ["politeness", "basics"],
        difficulty: "A1",
        language: "es",
        createdAt: new Date().toISOString(),
    },
    {
        id: "word_3",
        term: "agua",
        translation: "water",
        pronunciation: "AH-gwah",
        audioUrl: "/audio/agua.mp3",
        partOfSpeech: "noun",
        definition: "A clear liquid essential for life",
        exampleSentence: "¿Puedo tener un vaso de agua?",
        exampleTranslation: "Can I have a glass of water?",
        tags: ["food", "basics", "nouns"],
        difficulty: "A1",
        language: "es",
        createdAt: new Date().toISOString(),
    },
    {
        id: "word_4",
        term: "comer",
        translation: "to eat",
        pronunciation: "koh-MEHR",
        audioUrl: "/audio/comer.mp3",
        partOfSpeech: "verb",
        definition: "To consume food",
        exampleSentence: "Vamos a comer juntos.",
        exampleTranslation: "Let's eat together.",
        tags: ["food", "verbs"],
        difficulty: "A1",
        language: "es",
        createdAt: new Date().toISOString(),
    },
    {
        id: "word_5",
        term: "casa",
        translation: "house",
        pronunciation: "KAH-sah",
        audioUrl: "/audio/casa.mp3",
        partOfSpeech: "noun",
        definition: "A building for human habitation",
        exampleSentence: "Mi casa es tu casa.",
        exampleTranslation: "My house is your house.",
        tags: ["home", "nouns"],
        difficulty: "A1",
        language: "es",
        createdAt: new Date().toISOString(),
    },
    {
        id: "word_6",
        term: "trabajar",
        translation: "to work",
        pronunciation: "trah-bah-HAR",
        audioUrl: "/audio/trabajar.mp3",
        partOfSpeech: "verb",
        definition: "To do work or labor",
        exampleSentence: "Trabajo en una oficina.",
        exampleTranslation: "I work in an office.",
        tags: ["work", "verbs"],
        difficulty: "A2",
        language: "es",
        createdAt: new Date().toISOString(),
    },
];

const mockFlashcardProgress: FlashcardProgress[] = mockWords.map((word, i) => ({
    wordId: word.id,
    userId: "mock_user",
    repetitions: Math.floor(Math.random() * 5),
    easeFactor: 2.5,
    interval: Math.floor(Math.random() * 7) + 1,
    nextReviewDate: new Date(Date.now() + i * 86400000).toISOString(),
    lastReviewDate: new Date(Date.now() - 86400000).toISOString(),
    status: i < 2 ? "mastered" : i < 4 ? "review" : "learning",
    correctCount: Math.floor(Math.random() * 10) + 1,
    incorrectCount: Math.floor(Math.random() * 3),
}));

export const vocabularyService = {
    /**
     * Get vocabulary words with filters
     */
    async getWords(
        filters?: VocabularyFilters,
        page = 1,
        pageSize = 20
    ): Promise<PaginatedResponse<Word>> {
        if (isMockMode()) {
            await mockDelay(600);

            let filteredWords = [...mockWords];

            if (filters?.search) {
                const search = filters.search.toLowerCase();
                filteredWords = filteredWords.filter(
                    (w) =>
                        w.term.toLowerCase().includes(search) ||
                        w.translation.toLowerCase().includes(search)
                );
            }

            if (filters?.difficulty?.length) {
                filteredWords = filteredWords.filter((w) =>
                    filters.difficulty!.includes(w.difficulty)
                );
            }

            if (filters?.partOfSpeech?.length) {
                filteredWords = filteredWords.filter((w) =>
                    filters.partOfSpeech!.includes(w.partOfSpeech)
                );
            }

            return {
                data: filteredWords.slice(
                    (page - 1) * pageSize,
                    page * pageSize
                ),
                pagination: {
                    page,
                    pageSize,
                    totalItems: filteredWords.length,
                    totalPages: Math.ceil(filteredWords.length / pageSize),
                    hasNext: page * pageSize < filteredWords.length,
                    hasPrevious: page > 1,
                },
            };
        }

        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
            ...(filters?.search && { search: filters.search }),
            ...(filters?.language && { language: filters.language }),
        });

        const response = await api.get<PaginatedResponse<Word>>(
            `/vocabulary?${params}`
        );
        return response.data;
    },

    /**
     * Get a single word by ID
     */
    async getWord(id: string): Promise<Word> {
        if (isMockMode()) {
            await mockDelay(300);
            const word = mockWords.find((w) => w.id === id);
            if (!word) {
                throw { message: "Word not found", status: 404 };
            }
            return word;
        }

        const response = await api.get<Word>(`/vocabulary/${id}`);
        return response.data;
    },

    /**
     * Search words
     */
    async searchWords(query: string): Promise<Word[]> {
        if (isMockMode()) {
            await mockDelay(400);
            const search = query.toLowerCase();
            return mockWords.filter(
                (w) =>
                    w.term.toLowerCase().includes(search) ||
                    w.translation.toLowerCase().includes(search)
            );
        }

        const response = await api.get<Word[]>(
            `/vocabulary/search?q=${encodeURIComponent(query)}`
        );
        return response.data;
    },

    /**
     * Get flashcards due for review
     */
    async getDueFlashcards(): Promise<{ word: Word; progress: FlashcardProgress }[]> {
        if (isMockMode()) {
            await mockDelay(500);
            const now = new Date();
            const dueCards = mockFlashcardProgress
                .filter((p) => new Date(p.nextReviewDate) <= now)
                .map((progress) => ({
                    word: mockWords.find((w) => w.id === progress.wordId)!,
                    progress,
                }))
                .filter((c) => c.word);

            // Return some cards even if none are "due" for demo
            if (dueCards.length === 0) {
                return mockWords.slice(0, 3).map((word, i) => ({
                    word,
                    progress: mockFlashcardProgress[i],
                }));
            }

            return dueCards;
        }

        const response = await api.get<{ word: Word; progress: FlashcardProgress }[]>(
            "/vocabulary/flashcards/due"
        );
        return response.data;
    },

    /**
     * Submit flashcard review
     */
    async submitReview(review: FlashcardReview): Promise<FlashcardProgress> {
        if (isMockMode()) {
            await mockDelay(300);
            const progress = mockFlashcardProgress.find(
                (p) => p.wordId === review.wordId
            );
            if (progress) {
                progress.repetitions++;
                progress.lastReviewDate = new Date().toISOString();
                progress.nextReviewDate = new Date(
                    Date.now() + progress.interval * 86400000
                ).toISOString();
                if (review.quality >= 4) {
                    progress.correctCount++;
                    progress.interval = Math.min(progress.interval * 2, 30);
                } else {
                    progress.incorrectCount++;
                    progress.interval = 1;
                }
            }
            return progress || mockFlashcardProgress[0];
        }

        const response = await api.post<FlashcardProgress>(
            "/vocabulary/flashcards/review",
            review
        );
        return response.data;
    },

    /**
     * Mark word as learned
     */
    async markLearned(wordId: string): Promise<void> {
        if (isMockMode()) {
            await mockDelay(300);
            return;
        }

        await api.post(`/vocabulary/${wordId}/learned`);
    },

    /**
     * Get vocabulary stats
     */
    async getStats(): Promise<VocabularyStats> {
        if (isMockMode()) {
            await mockDelay(400);
            return {
                totalWords: mockWords.length,
                wordsLearned: 4,
                wordsMastered: 2,
                wordsToReview: 3,
                newWordsToday: 2,
                reviewsDueToday: 3,
                accuracy: 82,
            };
        }

        const response = await api.get<VocabularyStats>("/vocabulary/stats");
        return response.data;
    },
};

export default vocabularyService;
