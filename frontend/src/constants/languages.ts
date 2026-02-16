/**
 * Supported language configuration
 */
export interface Language {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
    direction: "ltr" | "rtl";
    hasRomanization: boolean;
}

/**
 * Supported target languages for learning
 */
export const SUPPORTED_LANGUAGES: Language[] = [
    {
        code: "es",
        name: "Spanish",
        nativeName: "Español",
        flag: "🇪🇸",
        direction: "ltr",
        hasRomanization: false,
    },
    {
        code: "ko",
        name: "Korean",
        nativeName: "한국어",
        flag: "🇰🇷",
        direction: "ltr",
        hasRomanization: true,
    },
    {
        code: "ja",
        name: "Japanese",
        nativeName: "日本語",
        flag: "🇯🇵",
        direction: "ltr",
        hasRomanization: true,
    },
    {
        code: "fr",
        name: "French",
        nativeName: "Français",
        flag: "🇫🇷",
        direction: "ltr",
        hasRomanization: false,
    },
] as const;

/**
 * Language codes as a union type
 */
export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

/**
 * Get language by code
 */
export function getLanguageByCode(code: string): Language | undefined {
    return SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
}

/**
 * Get language name by code
 */
export function getLanguageName(code: string): string {
    return getLanguageByCode(code)?.name ?? code;
}

/**
 * CEFR proficiency levels with descriptions
 */
export const PROFICIENCY_LEVELS = [
    {
        level: "A1",
        name: "Beginner",
        description: "Can understand and use familiar everyday expressions",
    },
    {
        level: "A2",
        name: "Elementary",
        description: "Can communicate in simple and routine tasks",
    },
    {
        level: "B1",
        name: "Intermediate",
        description: "Can deal with most situations while traveling",
    },
    {
        level: "B2",
        name: "Upper Intermediate",
        description: "Can interact with fluency and spontaneity",
    },
    {
        level: "C1",
        name: "Advanced",
        description: "Can express ideas fluently and spontaneously",
    },
    {
        level: "C2",
        name: "Proficient",
        description: "Can understand virtually everything heard or read",
    },
] as const;

/**
 * Default native language (English)
 */
export const DEFAULT_NATIVE_LANGUAGE = {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    direction: "ltr" as const,
    hasRomanization: false,
};
