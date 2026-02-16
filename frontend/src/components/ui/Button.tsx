
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "neuro";
    size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
                    {
                        "bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg shadow-primary-500/20": variant === "primary",
                        "bg-secondary-100 text-secondary-700 hover:bg-secondary-200": variant === "secondary",
                        "border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700": variant === "outline",
                        "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900": variant === "ghost",
                        "h-10 px-6 text-sm": size === "sm",
                        "h-12 px-8 text-base": size === "md",
                        "h-14 px-10 text-lg": size === "lg",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
