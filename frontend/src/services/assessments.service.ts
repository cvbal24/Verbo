import { api, mockDelay, isMockMode } from "./api";
import type {
    Quiz,
    Question,
    QuizResult,
    QuizHistory,
    Answer,
} from "@/types/assessment";

// Mock quizzes
const mockQuizzes: Quiz[] = [
    {
        id: "quiz_1",
        title: "Basic Greetings",
        description: "Test your knowledge of common Spanish greetings",
        type: "vocabulary",
        difficulty: "A1",
        language: "es",
        questionCount: 5,
        timeLimit: 300,
        passingScore: 70,
        questions: [],
        category: "Basics",
        createdAt: new Date().toISOString(),
    },
    {
        id: "quiz_2",
        title: "Food & Drinks",
        description: "Vocabulary related to food and beverages",
        type: "vocabulary",
        difficulty: "A1",
        language: "es",
        questionCount: 5,
        timeLimit: 300,
        passingScore: 70,
        questions: [],
        category: "Food",
        createdAt: new Date().toISOString(),
    },
    {
        id: "quiz_3",
        title: "Present Tense Verbs",
        description: "Practice conjugating regular verbs in present tense",
        type: "grammar",
        difficulty: "A2",
        language: "es",
        questionCount: 5,
        timeLimit: 600,
        passingScore: 60,
        questions: [],
        category: "Grammar",
        createdAt: new Date().toISOString(),
    },
];

const mockQuestions: Question[] = [
    {
        id: "q1",
        quizId: "quiz_1",
        type: "multiple_choice",
        prompt: "What does 'Buenos días' mean?",
        options: [
            { id: "a", text: "Good night" },
            { id: "b", text: "Good morning" },
            { id: "c", text: "Goodbye" },
            { id: "d", text: "Good afternoon" },
        ],
        correctAnswer: "b",
        explanation: "'Buenos días' is used in the morning until around noon.",
        points: 10,
        order: 1,
    },
    {
        id: "q2",
        quizId: "quiz_1",
        type: "multiple_choice",
        prompt: "How do you say 'Nice to meet you' in Spanish?",
        options: [
            { id: "a", text: "Mucho gusto" },
            { id: "b", text: "Hasta luego" },
            { id: "c", text: "De nada" },
            { id: "d", text: "Lo siento" },
        ],
        correctAnswer: "a",
        explanation: "'Mucho gusto' literally means 'much pleasure'.",
        points: 10,
        order: 2,
    },
    {
        id: "q3",
        quizId: "quiz_1",
        type: "multiple_choice",
        prompt: "What is the correct response to 'Gracias'?",
        options: [
            { id: "a", text: "Hola" },
            { id: "b", text: "Adiós" },
            { id: "c", text: "De nada" },
            { id: "d", text: "Por favor" },
        ],
        correctAnswer: "c",
        explanation: "'De nada' means 'you're welcome' or 'it's nothing'.",
        points: 10,
        order: 3,
    },
    {
        id: "q4",
        quizId: "quiz_1",
        type: "multiple_choice",
        prompt: "How do you say 'See you later' in Spanish?",
        options: [
            { id: "a", text: "Buenos días" },
            { id: "b", text: "Hasta luego" },
            { id: "c", text: "Buenas noches" },
            { id: "d", text: "Hola" },
        ],
        correctAnswer: "b",
        explanation: "'Hasta luego' is a common way to say goodbye.",
        points: 10,
        order: 4,
    },
    {
        id: "q5",
        quizId: "quiz_1",
        type: "multiple_choice",
        prompt: "What does '¿Cómo estás?' mean?",
        options: [
            { id: "a", text: "What's your name?" },
            { id: "b", text: "Where are you from?" },
            { id: "c", text: "How are you?" },
            { id: "d", text: "How old are you?" },
        ],
        correctAnswer: "c",
        explanation: "'¿Cómo estás?' is an informal way to ask how someone is.",
        points: 10,
        order: 5,
    },
];

export const assessmentsService = {
    /**
     * Get available quizzes
     */
    async getQuizzes(): Promise<Quiz[]> {
        if (isMockMode()) {
            await mockDelay(600);
            return mockQuizzes;
        }

        const response = await api.get<Quiz[]>("/assessments/quizzes");
        return response.data;
    },

    /**
     * Get a specific quiz with questions
     */
    async getQuiz(id: string): Promise<Quiz> {
        if (isMockMode()) {
            await mockDelay(500);
            const quiz = mockQuizzes.find((q) => q.id === id);
            if (!quiz) {
                throw { message: "Quiz not found", status: 404 };
            }
            return {
                ...quiz,
                questions: mockQuestions.filter((q) => q.quizId === id),
            };
        }

        const response = await api.get<Quiz>(`/assessments/quizzes/${id}`);
        return response.data;
    },

    /**
     * Start a quiz attempt
     */
    async startQuiz(quizId: string): Promise<{ attemptId: string; questions: Question[] }> {
        if (isMockMode()) {
            await mockDelay(400);
            return {
                attemptId: `attempt_${Date.now()}`,
                questions: mockQuestions.filter((q) => q.quizId === quizId),
            };
        }

        const response = await api.post<{ attemptId: string; questions: Question[] }>(
            `/assessments/quizzes/${quizId}/start`
        );
        return response.data;
    },

    /**
     * Submit an answer during a quiz
     */
    async submitAnswer(
        attemptId: string,
        questionId: string,
        answer: string
    ): Promise<{ isCorrect: boolean; correctAnswer: string; explanation?: string }> {
        if (isMockMode()) {
            await mockDelay(300);
            const question = mockQuestions.find((q) => q.id === questionId);
            const isCorrect = question?.correctAnswer === answer;
            return {
                isCorrect,
                correctAnswer: question?.correctAnswer as string,
                explanation: question?.explanation,
            };
        }

        const response = await api.post<{
            isCorrect: boolean;
            correctAnswer: string;
            explanation?: string;
        }>(`/assessments/attempts/${attemptId}/answer`, {
            questionId,
            answer,
        });
        return response.data;
    },

    /**
     * Complete a quiz and get results
     */
    async completeQuiz(
        attemptId: string,
        answers: Answer[]
    ): Promise<QuizResult> {
        if (isMockMode()) {
            await mockDelay(600);

            const correctCount = answers.filter((a) => a.isCorrect).length;
            const totalPoints = mockQuestions.length * 10;
            const score = correctCount * 10;

            return {
                id: `result_${Date.now()}`,
                quizId: "quiz_1",
                userId: "mock_user",
                score,
                totalPoints,
                percentage: (score / totalPoints) * 100,
                passed: (score / totalPoints) * 100 >= 70,
                timeSpent: answers.reduce((sum, a) => sum + a.timeSpent, 0),
                answers,
                correctCount,
                incorrectCount: answers.length - correctCount,
                xpEarned: score * 2,
                completedAt: new Date().toISOString(),
                feedback:
                    correctCount >= 4
                        ? "Excellent work!"
                        : correctCount >= 3
                          ? "Good job! Keep practicing."
                          : "Keep studying and try again!",
            };
        }

        const response = await api.post<QuizResult>(
            `/assessments/attempts/${attemptId}/complete`,
            { answers }
        );
        return response.data;
    },

    /**
     * Get quiz history
     */
    async getHistory(): Promise<QuizHistory[]> {
        if (isMockMode()) {
            await mockDelay(500);
            return [
                {
                    quizId: "quiz_1",
                    quizTitle: "Basic Greetings",
                    attempts: 3,
                    bestScore: 90,
                    lastAttemptAt: new Date(Date.now() - 86400000).toISOString(),
                    averageScore: 80,
                },
                {
                    quizId: "quiz_2",
                    quizTitle: "Food & Drinks",
                    attempts: 1,
                    bestScore: 70,
                    lastAttemptAt: new Date(
                        Date.now() - 86400000 * 3
                    ).toISOString(),
                    averageScore: 70,
                },
            ];
        }

        const response = await api.get<QuizHistory[]>("/assessments/history");
        return response.data;
    },
};

export default assessmentsService;
