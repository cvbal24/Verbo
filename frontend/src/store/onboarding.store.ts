import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ProficiencyLevel } from "@/types/user";

type OnboardingStep =
    | "language_selection"
    | "placement_test"
    | "profile_setup"
    | "completed";

interface OnboardingState {
    currentStep: OnboardingStep;
    selectedLanguage: string | null;
    proficiencyLevel: ProficiencyLevel | null;
    completedSteps: OnboardingStep[];
    placementTestScore: number | null;
    isOnboardingComplete: boolean;
}

interface OnboardingActions {
    setStep: (step: OnboardingStep) => void;
    selectLanguage: (languageCode: string) => void;
    setProficiencyLevel: (level: ProficiencyLevel) => void;
    completeStep: (step: OnboardingStep) => void;
    setPlacementTestScore: (score: number) => void;
    completeOnboarding: () => void;
    reset: () => void;
}

type OnboardingStore = OnboardingState & OnboardingActions;

const initialState: OnboardingState = {
    currentStep: "language_selection",
    selectedLanguage: null,
    proficiencyLevel: null,
    completedSteps: [],
    placementTestScore: null,
    isOnboardingComplete: false,
};

export const useOnboardingStore = create<OnboardingStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            setStep: (step) => {
                set({ currentStep: step });
            },

            selectLanguage: (languageCode) => {
                set({ selectedLanguage: languageCode });
            },

            setProficiencyLevel: (level) => {
                set({ proficiencyLevel: level });
            },

            completeStep: (step) => {
                const { completedSteps } = get();
                if (!completedSteps.includes(step)) {
                    set({
                        completedSteps: [...completedSteps, step],
                    });
                }
            },

            setPlacementTestScore: (score) => {
                set({ placementTestScore: score });
            },

            completeOnboarding: () => {
                set({
                    currentStep: "completed",
                    isOnboardingComplete: true,
                    completedSteps: [
                        "language_selection",
                        "placement_test",
                        "profile_setup",
                        "completed",
                    ],
                });
            },

            reset: () => {
                set(initialState);
            },
        }),
        {
            name: "verbo-onboarding",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                selectedLanguage: state.selectedLanguage,
                proficiencyLevel: state.proficiencyLevel,
                completedSteps: state.completedSteps,
                isOnboardingComplete: state.isOnboardingComplete,
            }),
        }
    )
);

// Selector hooks
export const useSelectedLanguage = () =>
    useOnboardingStore((state) => state.selectedLanguage);

export const useOnboardingComplete = () =>
    useOnboardingStore((state) => state.isOnboardingComplete);

export const useCurrentOnboardingStep = () =>
    useOnboardingStore((state) => state.currentStep);
