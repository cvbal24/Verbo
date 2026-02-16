"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "outlined" | "elevated" | "interactive";
    padding?: "none" | "sm" | "md" | "lg";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        { className, variant = "default", padding = "md", children, ...props },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-2xl bg-white",
                    {
                        "border border-slate-200": variant === "default",
                        "border-2 border-slate-200": variant === "outlined",
                        "shadow-lg shadow-slate-200/50": variant === "elevated",
                        "border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer":
                            variant === "interactive",
                    },
                    {
                        "p-0": padding === "none",
                        "p-4": padding === "sm",
                        "p-6": padding === "md",
                        "p-8": padding === "lg",
                    },
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("flex flex-col space-y-1.5", className)}
                {...props}
            />
        );
    }
);

CardHeader.displayName = "CardHeader";

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, ...props }, ref) => {
        return (
            <h3
                ref={ref}
                className={cn(
                    "text-xl font-semibold text-slate-900 leading-tight",
                    className
                )}
                {...props}
            />
        );
    }
);

CardTitle.displayName = "CardTitle";

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ className, ...props }, ref) => {
        return (
            <p
                ref={ref}
                className={cn("text-sm text-slate-500", className)}
                {...props}
            />
        );
    }
);

CardDescription.displayName = "CardDescription";

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, ...props }, ref) => {
        return <div ref={ref} className={cn("", className)} {...props} />;
    }
);

CardContent.displayName = "CardContent";

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("flex items-center pt-4", className)}
                {...props}
            />
        );
    }
);

CardFooter.displayName = "CardFooter";

export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
};
