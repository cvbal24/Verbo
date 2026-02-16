"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TooltipProps {
    content: ReactNode;
    children: ReactNode;
    position?: "top" | "bottom" | "left" | "right";
    delay?: number;
    className?: string;
}

function Tooltip({
    content,
    children,
    position = "top",
    delay = 200,
    className,
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const positionClasses = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    const arrowClasses = {
        top: "top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-x-transparent border-b-transparent",
        bottom:
            "bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-x-transparent border-t-transparent",
        left: "left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-y-transparent border-r-transparent",
        right: "right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-y-transparent border-l-transparent",
    };

    const animationOrigin = {
        top: { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 } },
        bottom: {
            initial: { opacity: 0, y: -4 },
            animate: { opacity: 1, y: 0 },
        },
        left: { initial: { opacity: 0, x: 4 }, animate: { opacity: 1, x: 0 } },
        right: {
            initial: { opacity: 0, x: -4 },
            animate: { opacity: 1, x: 0 },
        },
    };

    return (
        <div
            ref={triggerRef}
            className="relative inline-flex"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={animationOrigin[position].initial}
                        animate={animationOrigin[position].animate}
                        exit={animationOrigin[position].initial}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            "absolute z-50 pointer-events-none",
                            positionClasses[position]
                        )}
                        role="tooltip"
                    >
                        <div
                            className={cn(
                                "px-3 py-1.5 text-sm text-white bg-slate-800 rounded-lg whitespace-nowrap shadow-lg",
                                className
                            )}
                        >
                            {content}
                        </div>
                        {/* Arrow */}
                        <div
                            className={cn(
                                "absolute w-0 h-0 border-4",
                                arrowClasses[position]
                            )}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

Tooltip.displayName = "Tooltip";

export { Tooltip };
