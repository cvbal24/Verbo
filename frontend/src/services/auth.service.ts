import { api, setAuthTokens, clearAuthTokens, mockResponse, mockDelay, isMockMode } from "./api";
import type { LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth";
import type { User } from "@/types/user";

// Mock user for frontend development
const mockUser: User = {
    id: "user_mock_123",
    email: "demo@verbo.app",
    firstName: "Demo",
    lastName: "User",
    avatarUrl: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isEmailVerified: true,
    profile: {
        targetLanguage: "es",
        nativeLanguage: "en",
        proficiencyLevel: "A1",
        learningGoal: "Travel",
        dailyGoalMinutes: 15,
        streak: 5,
        totalXp: 1250,
        joinedAt: new Date().toISOString(),
        timezone: "America/New_York",
    },
    preferences: {
        theme: "light",
        soundEnabled: true,
        notificationsEnabled: true,
        dailyReminderTime: "09:00",
        fontSize: "medium",
        autoPlayAudio: true,
        showRomanization: true,
        difficultyMode: "adaptive",
    },
};

const mockTokens = {
    accessToken: "mock_access_token_xyz",
    refreshToken: "mock_refresh_token_xyz",
    expiresAt: Date.now() + 3600000, // 1 hour from now
};

export const authService = {
    /**
     * Login with email and password
     */
    async login(data: LoginRequest): Promise<AuthResponse> {
        if (isMockMode()) {
            await mockDelay(800);

            // Simulate validation
            if (!data.email || !data.password) {
                throw {
                    message: "Email and password are required",
                    code: "VALIDATION_ERROR",
                    status: 400,
                };
            }

            // Simulate wrong password
            if (data.password === "wrongpassword") {
                throw {
                    message: "Invalid email or password",
                    code: "INVALID_CREDENTIALS",
                    status: 401,
                };
            }

            setAuthTokens(mockTokens.accessToken, mockTokens.refreshToken);
            return { user: mockUser, tokens: mockTokens };
        }

        const response = await api.post<AuthResponse>("/auth/login", data);
        const { user, tokens } = response.data;
        setAuthTokens(tokens.accessToken, tokens.refreshToken);
        return { user, tokens };
    },

    /**
     * Register a new user
     */
    async register(data: RegisterRequest): Promise<AuthResponse> {
        if (isMockMode()) {
            await mockDelay(1000);

            // Simulate email already exists
            if (data.email === "existing@example.com") {
                throw {
                    message: "An account with this email already exists",
                    code: "EMAIL_EXISTS",
                    status: 409,
                };
            }

            const newUser: User = {
                ...mockUser,
                id: `user_${Date.now()}`,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                createdAt: new Date().toISOString(),
                profile: {
                    ...mockUser.profile,
                    streak: 0,
                    totalXp: 0,
                },
            };

            setAuthTokens(mockTokens.accessToken, mockTokens.refreshToken);
            return { user: newUser, tokens: mockTokens };
        }

        const response = await api.post<AuthResponse>("/auth/register", data);
        const { user, tokens } = response.data;
        setAuthTokens(tokens.accessToken, tokens.refreshToken);
        return { user, tokens };
    },

    /**
     * Logout current user
     */
    async logout(): Promise<void> {
        if (isMockMode()) {
            await mockDelay(300);
            clearAuthTokens();
            return;
        }

        try {
            await api.post("/auth/logout");
        } finally {
            clearAuthTokens();
        }
    },

    /**
     * Get current user profile
     */
    async getCurrentUser(): Promise<User> {
        if (isMockMode()) {
            await mockDelay(500);
            return mockUser;
        }

        const response = await api.get<User>("/auth/me");
        return response.data;
    },

    /**
     * Refresh access token
     */
    async refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: number }> {
        if (isMockMode()) {
            await mockDelay(300);
            const newToken = {
                accessToken: `mock_access_token_${Date.now()}`,
                expiresAt: Date.now() + 3600000,
            };
            setAuthTokens(newToken.accessToken, refreshToken);
            return newToken;
        }

        const response = await api.post<{ accessToken: string; expiresAt: number }>(
            "/auth/refresh",
            { refreshToken }
        );
        setAuthTokens(response.data.accessToken, refreshToken);
        return response.data;
    },

    /**
     * Request password reset email
     */
    async forgotPassword(email: string): Promise<void> {
        if (isMockMode()) {
            await mockDelay(800);
            return;
        }

        await api.post("/auth/forgot-password", { email });
    },

    /**
     * Reset password with token
     */
    async resetPassword(token: string, newPassword: string): Promise<void> {
        if (isMockMode()) {
            await mockDelay(800);
            return;
        }

        await api.post("/auth/reset-password", { token, newPassword });
    },
};

export default authService;
