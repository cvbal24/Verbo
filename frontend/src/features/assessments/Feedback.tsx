"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface FeedbackProps {
    isCorrect: boolean;
    correctAnswer?: string;
    explanation?: string;
    onContinue: () => void;
    isLastQuestion?: boolean;
}

export function Feedback({
    isCorrect,
    correctAnswer,
    explanation,
    onContinue,
    isLastQuestion = false,
}: FeedbackProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "rounded-xl p-6 border-2",
                isCorrect
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
            )}
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                    className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                        isCorrect ? "bg-green-100" : "bg-red-100"
                    )}
                >
                    {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h3
                        className={cn(
                            "text-lg font-semibold mb-1",
                            isCorrect ? "text-green-800" : "text-red-800"
                        )}
                    >
                        {isCorrect ? "Correct!" : "Incorrect"}
                    </h3>

                    {!isCorrect && correctAnswer && (
                        <p
                            className={cn(
                                "text-sm mb-3",
                                isCorrect ? "text-green-700" : "text-red-700"
                            )}
                        >
                            The correct answer was:{" "}
                            <span className="font-medium">{correctAnswer}</span>
                        </p>
                    )}

                    {explanation && (
                        <div className="flex items-start gap-2 mt-3 p-3 bg-white/50 rounded-lg">
                            <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-600">
                                {explanation}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Continue Button */}
            <div className="mt-6 flex justify-end">
                <Button onClick={onContinue} variant={isCorrect ? "primary" : "outline"}>
                    {isLastQuestion ? "See Results" : "Continue"}
                </Button>
            </div>
        </motion.div>
    );
}

export default Feedback;
