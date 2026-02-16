"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, type = "text", id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    type={type}
                    className={cn(
                        "w-full h-12 px-4 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400",
                        "transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:border-primary-500",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50",
                        {
                            "border-slate-200 hover:border-slate-300": !error,
                            "border-red-500 focus:ring-red-500 focus:border-red-500":
                                error,
                        },
                        className
                    )}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={
                        error
                            ? `${inputId}-error`
                            : hint
                              ? `${inputId}-hint`
                              : undefined
                    }
                    {...props}
                />
                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="mt-1.5 text-sm text-red-600"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p
                        id={`${inputId}-hint`}
                        className="mt-1.5 text-sm text-slate-500"
                    >
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
