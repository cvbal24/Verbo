"use client";

import { HTMLAttributes, forwardRef } from "react";
import { AlertCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
    message: string;
    variant?: "error" | "warning" | "info";
    title?: string;
    onDismiss?: () => void;
    showIcon?: boolean;
}

const ErrorMessage = forwardRef<HTMLDivElement, ErrorMessageProps>(
    (
        {
            className,
            message,
            variant = "error",
            title,
            onDismiss,
            showIcon = true,
            ...props
        },
        ref
    ) => {
        const icons = {
            error: AlertCircle,
            warning: AlertTriangle,
            info: Info,
        };

        const Icon = icons[variant];

        return (
            <div
                ref={ref}
                role="alert"
                className={cn(
                    "flex items-start gap-3 p-4 rounded-xl",
                    {
                        "bg-red-50 border border-red-200": variant === "error",
                        "bg-amber-50 border border-amber-200":
                            variant === "warning",
                        "bg-blue-50 border border-blue-200": variant === "info",
                    },
                    className
                )}
                {...props}
            >
                {showIcon && (
                    <Icon
                        className={cn("w-5 h-5 flex-shrink-0 mt-0.5", {
                            "text-red-600": variant === "error",
                            "text-amber-600": variant === "warning",
                            "text-blue-600": variant === "info",
                        })}
                    />
                )}
                <div className="flex-1 min-w-0">
                    {title && (
                        <h4
                            className={cn("font-semibold text-sm mb-1", {
                                "text-red-800": variant === "error",
                                "text-amber-800": variant === "warning",
                                "text-blue-800": variant === "info",
                            })}
                        >
                            {title}
                        </h4>
                    )}
                    <p
                        className={cn("text-sm", {
                            "text-red-700": variant === "error",
                            "text-amber-700": variant === "warning",
                            "text-blue-700": variant === "info",
                        })}
                    >
                        {message}
                    </p>
                </div>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className={cn(
                            "p-1 rounded-full flex-shrink-0 transition-colors",
                            {
                                "hover:bg-red-100 text-red-600":
                                    variant === "error",
                                "hover:bg-amber-100 text-amber-600":
                                    variant === "warning",
                                "hover:bg-blue-100 text-blue-600":
                                    variant === "info",
                            }
                        )}
                        aria-label="Dismiss"
                    >
                        <XCircle className="w-4 h-4" />
                    </button>
                )}
            </div>
        );
    }
);

ErrorMessage.displayName = "ErrorMessage";

// Inline error for form fields
function InlineError({
    message,
    className,
}: {
    message?: string;
    className?: string;
}) {
    if (!message) return null;

    return (
        <p className={cn("text-sm text-red-600 mt-1", className)} role="alert">
            {message}
        </p>
    );
}

InlineError.displayName = "InlineError";

export { ErrorMessage, InlineError };
