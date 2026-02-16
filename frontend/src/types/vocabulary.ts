import type { ProficiencyLevel } from "./user";

/**
 * A vocabulary word entry
 */
export interface Word {
    id: string;
    term: string;
    translation: string;
    romanization?: string;
    pronunciation?: string;
    audioUrl?: string;
    partOfSpeech: PartOfSpeech;
    definition: string;
    exampleSentence?: string;
    exampleTranslation?: string;
    imageUrl?: string;
    tags: string[];
    difficulty: ProficiencyLevel;
    language: string;
    createdAt: string;
}

/**
 * Parts of speech classification
 */
export type PartOfSpeech =
    | "noun"
    | "verb"
    | "adjective"
    | "adverb"
    | "pronoun"
    | "preposition"
    | "conjunction"
    | "interjection"
    | "article"
    | "particle";

/**
 * A collection of vocabulary words
 */
export interface VocabularySet {
    id: string;
    name: string;
    description: string;
    language: string;
    wordCount: number;
    difficulty: ProficiencyLevel;
    category: string;
    imageUrl?: string;
    words: Word[];
    progress: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * User's progress on a flashcard/word
 */
export interface FlashcardProgress {
    wordId: string;
    userId: string;
    repetitions: number;
    easeFactor: number;
    interval: number;
    nextReviewDate: string;
    lastReviewDate: string;
    status: FlashcardStatus;
    correctCount: number;
    incorrectCount: number;
}

/**
 * Flashcard learning status
 */
export type FlashcardStatus = "new" | "learning" | "review" | "mastered";

/**
 * Flashcard review result
 */
export interface FlashcardReview {
    wordId: string;
    quality: ReviewQuality;
    responseTime: number;
    reviewedAt: string;
}

/**
 * Spaced repetition quality rating (SM-2 algorithm)
 */
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Vocabulary search/filter parameters
 */
export interface VocabularyFilters {
    search?: string;
    language?: string;
    difficulty?: ProficiencyLevel[];
    partOfSpeech?: PartOfSpeech[];
    category?: string;
    status?: FlashcardStatus[];
    tags?: string[];
}

/**
 * Daily vocabulary stats
 */
export interface VocabularyStats {
    totalWords: number;
    wordsLearned: number;
    wordsMastered: number;
    wordsToReview: number;
    newWordsToday: number;
    reviewsDueToday: number;
    accuracy: number;
}
