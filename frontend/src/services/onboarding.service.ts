import { api, mockResponse, mockDelay, isMockMode } from "./api";
import type { PlacementTestResult, Question } from "@/types/assessment";
import type { ProficiencyLevel } from "@/types/user";

// Mock placement test questions
const mockPlacementQuestions: Question[] = [
    {
        id: "q1",
        quizId: "placement",
        type: "multiple_choice",
        prompt: "What is 'Hello' in Spanish?",
        options: [
            { id: "a", text: "Hola" },
            { id: "b", text: "Adiós" },
            { id: "c", text: "Gracias" },
            { id: "d", text: "Por favor" },
        ],
        correctAnswer: "a",
        points: 1,
        order: 1,
    },
    {
        id: "q2",
        quizId: "placement",
        type: "multiple_choice",
        prompt: "How do you say 'Thank you' in Spanish?",
        options: [
            { id: "a", text: "De nada" },
            { id: "b", text: "Gracias" },
            { id: "c", text: "Lo siento" },
            { id: "d", text: "Buenos días" },
        ],
        correctAnswer: "b",
        points: 1,
        order: 2,
    },
    {
        id: "q3",
        quizId: "placement",
        type: "multiple_choice",
        prompt: "What does 'Buenos días' mean?",
        options: [
            { id: "a", text: "Good night" },
            { id: "b", text: "Good evening" },
            { id: "c", text: "Good morning" },
            { id: "d", text: "Goodbye" },
        ],
        correctAnswer: "c",
        points: 1,
        order: 3,
    },
    {
        id: "q4",
        quizId: "placement",
        type: "multiple_choice",
        prompt: "Complete the sentence: 'Yo ____ español.'",
        options: [
            { id: "a", text: "hablas" },
            { id: "b", text: "hablo" },
            { id: "c", text: "habla" },
            { id: "d", text: "hablamos" },
        ],
        correctAnswer: "b",
        points: 2,
        order: 4,
    },
    {
        id: "q5",
        quizId: "placement",
        type: "multiple_choice",
        prompt: "What is the correct article for 'casa' (house)?",
        options: [
            { id: "a", text: "el" },
            { id: "b", text: "la" },
            { id: "c", text: "los" },
            { id: "d", text: "las" },
        ],
        correctAnswer: "b",
        points: 2,
        order: 5,
    },
];

export const onboardingService = {
    /**
     * Set the user's target language
     */
    async selectLanguage(languageCode: string): Promise<void> {
        if (isMockMode()) {
            await mockDelay(500);
            return;
        }

        await api.post("/onboarding/language", { language: languageCode });
    },

    /**
     * Get placement test questions
     */
    async getPlacementTest(language: string): Promise<Question[]> {
        if (isMockMode()) {
            await mockDelay(800);
            return mockPlacementQuestions;
        }

        const response = await api.get<Question[]>(
            `/onboarding/placement-test?language=${language}`
        );
        return response.data;
    },

    /**
     * Submit placement test and get result
     */
    async submitPlacementTest(
        language: string,
        answers: { questionId: string; answer: string }[]
    ): Promise<PlacementTestResult> {
        if (isMockMode()) {
            await mockDelay(1000);

            // Calculate score based on mock answers
            let score = 0;
            for (const answer of answers) {
                const question = mockPlacementQuestions.find(
                    (q) => q.id === answer.questionId
                );
                if (question && question.correctAnswer === answer.answer) {
                    score += question.points;
                }
            }

            const totalPoints = mockPlacementQuestions.reduce(
                (sum, q) => sum + q.points,
                0
            );
            const percentage = (score / totalPoints) * 100;

            // Determine level based on score
            let recommendedLevel: ProficiencyLevel;
            if (percentage >= 90) {
                recommendedLevel = "B2";
            } else if (percentage >= 70) {
                recommendedLevel = "B1";
            } else if (percentage >= 50) {
                recommendedLevel = "A2";
            } else {
                recommendedLevel = "A1";
            }

            return {
                userId: "mock_user",
                language,
                recommendedLevel,
                score: percentage,
                strengths:
                    percentage >= 50
                        ? ["Basic vocabulary", "Common phrases"]
                        : [],
                areasToImprove:
                    percentage < 70
                        ? ["Grammar", "Verb conjugation"]
                        : ["Advanced vocabulary"],
                completedAt: new Date().toISOString(),
            };
        }

        const response = await api.post<PlacementTestResult>(
            "/onboarding/placement-test/submit",
            { language, answers }
        );
        return response.data;
    },

    /**
     * Skip placement test and set default level
     */
    async skipPlacementTest(language: string): Promise<PlacementTestResult> {
        if (isMockMode()) {
            await mockDelay(500);
            return {
                userId: "mock_user",
                language,
                recommendedLevel: "A1",
                score: 0,
                strengths: [],
                areasToImprove: ["All areas - starting from beginner level"],
                completedAt: new Date().toISOString(),
            };
        }

        const response = await api.post<PlacementTestResult>(
            "/onboarding/placement-test/skip",
            { language }
        );
        return response.data;
    },

    /**
     * Complete onboarding process
     */
    async completeOnboarding(): Promise<void> {
        if (isMockMode()) {
            await mockDelay(500);
            return;
        }

        await api.post("/onboarding/complete");
    },
};

export default onboardingService;
