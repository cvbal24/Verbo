"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "text" | "circular" | "rectangular" | "rounded";
    width?: string | number;
    height?: string | number;
    animated?: boolean;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
    (
        {
            className,
            variant = "text",
            width,
            height,
            animated = true,
            style,
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-slate-200",
                    {
                        "animate-pulse": animated,
                        "h-4 rounded": variant === "text",
                        "rounded-full aspect-square": variant === "circular",
                        "rounded-none": variant === "rectangular",
                        "rounded-xl": variant === "rounded",
                    },
                    className
                )}
                style={{
                    width:
                        typeof width === "number" ? `${width}px` : width,
                    height:
                        typeof height === "number" ? `${height}px` : height,
                    ...style,
                }}
                aria-hidden="true"
                {...props}
            />
        );
    }
);

Skeleton.displayName = "Skeleton";

// Preset skeleton components for common use cases
function SkeletonText({
    lines = 3,
    className,
}: {
    lines?: number;
    className?: string;
}) {
    return (
        <div className={cn("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    variant="text"
                    className={cn({
                        "w-full": i < lines - 1,
                        "w-3/4": i === lines - 1,
                    })}
                />
            ))}
        </div>
    );
}

SkeletonText.displayName = "SkeletonText";

function SkeletonCard({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "p-6 border border-slate-200 rounded-2xl space-y-4",
                className
            )}
        >
            <Skeleton variant="rounded" height={160} className="w-full" />
            <Skeleton variant="text" className="w-3/4 h-6" />
            <SkeletonText lines={2} />
        </div>
    );
}

SkeletonCard.displayName = "SkeletonCard";

function SkeletonAvatar({
    size = 40,
    className,
}: {
    size?: number;
    className?: string;
}) {
    return (
        <Skeleton
            variant="circular"
            width={size}
            height={size}
            className={className}
        />
    );
}

SkeletonAvatar.displayName = "SkeletonAvatar";

export { Skeleton, SkeletonText, SkeletonCard, SkeletonAvatar };
