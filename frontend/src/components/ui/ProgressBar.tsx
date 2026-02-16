"use client";

import { HTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
    color?: "primary" | "secondary" | "success" | "warning" | "error";
    size?: "sm" | "md" | "lg";
    animated?: boolean;
    showLabel?: boolean;
    label?: string;
}

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
    (
        {
            className,
            value,
            max = 100,
            color = "primary",
            size = "md",
            animated = true,
            showLabel = false,
            label,
            ...props
        },
        ref
    ) => {
        const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

        return (
            <div ref={ref} className={cn("w-full", className)} {...props}>
                {(showLabel || label) && (
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-700">
                            {label || "Progress"}
                        </span>
                        <span className="text-sm text-slate-500">
                            {Math.round(percentage)}%
                        </span>
                    </div>
                )}
                <div
                    className={cn(
                        "w-full bg-slate-100 rounded-full overflow-hidden",
                        {
                            "h-1.5": size === "sm",
                            "h-2.5": size === "md",
                            "h-4": size === "lg",
                        }
                    )}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={max}
                    aria-label={label || "Progress"}
                >
                    <motion.div
                        className={cn("h-full rounded-full", {
                            "bg-primary-500": color === "primary",
                            "bg-secondary-500": color === "secondary",
                            "bg-green-500": color === "success",
                            "bg-amber-500": color === "warning",
                            "bg-red-500": color === "error",
                        })}
                        initial={animated ? { width: 0 } : false}
                        animate={{ width: `${percentage}%` }}
                        transition={{
                            duration: animated ? 0.5 : 0,
                            ease: "easeOut",
                        }}
                    />
                </div>
            </div>
        );
    }
);

ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
