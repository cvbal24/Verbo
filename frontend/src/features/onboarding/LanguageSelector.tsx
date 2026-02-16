"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";
import { useLanguageSelect } from "./onboarding.hooks";

export function LanguageSelector() {
    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const { selectLanguage, isLoading, error } = useLanguageSelect();

    const handleContinue = () => {
        if (selectedCode) {
            selectLanguage(selectedCode);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">
                    What language do you want to learn?
                </h1>
                <p className="text-slate-500 text-lg">
                    Choose your target language to get started
                </p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                {SUPPORTED_LANGUAGES.map((language, index) => (
                    <motion.button
                        key={language.code}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedCode(language.code)}
                        disabled={isLoading}
                        className={cn(
                            "relative p-6 rounded-2xl border-2 transition-all duration-200 text-left group",
                            "hover:border-primary-300 hover:shadow-md",
                            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            {
                                "border-primary-500 bg-primary-50 shadow-md":
                                    selectedCode === language.code,
                                "border-slate-200 bg-white":
                                    selectedCode !== language.code,
                            }
                        )}
                    >
                        {selectedCode === language.code && (
                            <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                        )}

                        <span className="text-4xl mb-3 block">
                            {language.flag}
                        </span>

                        <h3 className="font-semibold text-slate-900 text-lg">
                            {language.name}
                        </h3>

                        <p className="text-slate-500 text-sm mt-1">
                            {language.nativeName}
                        </p>

                        {language.hasRomanization && (
                            <span className="inline-block mt-2 px-2 py-0.5 bg-secondary-100 text-secondary-700 text-xs rounded-full">
                                Romanization available
                            </span>
                        )}
                    </motion.button>
                ))}
            </div>

            <div className="flex justify-center pt-4">
                <Button
                    onClick={handleContinue}
                    disabled={!selectedCode || isLoading}
                    size="lg"
                    className="min-w-[200px]"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Setting up...
                        </>
                    ) : (
                        "Continue"
                    )}
                </Button>
            </div>
        </div>
    );
}

export default LanguageSelector;
