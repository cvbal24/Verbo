"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { ...toast, id }]);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const success = (title: string, message?: string) =>
        addToast({ type: "success", title, message, duration: 4000 });

    const error = (title: string, message?: string) =>
        addToast({ type: "error", title, message, duration: 6000 });

    const warning = (title: string, message?: string) =>
        addToast({ type: "warning", title, message, duration: 5000 });

    const info = (title: string, message?: string) =>
        addToast({ type: "info", title, message, duration: 4000 });

    return (
        <ToastContext.Provider
            value={{
                toasts,
                addToast,
                removeToast,
                success,
                error,
                warning,
                info,
            }}
        >
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({
    toasts,
    removeToast,
}: {
    toasts: Toast[];
    removeToast: (id: string) => void;
}) {
    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence mode="sync">
                {toasts.map((toast) => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onDismiss={() => removeToast(toast.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

function ToastItem({
    toast,
    onDismiss,
}: {
    toast: Toast;
    onDismiss: () => void;
}) {
    const { type, title, message, duration = 4000 } = toast;

    useEffect(() => {
        const timer = setTimeout(onDismiss, duration);
        return () => clearTimeout(timer);
    }, [duration, onDismiss]);

    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        warning: AlertTriangle,
        info: Info,
    };

    const Icon = icons[type];

    const styles = {
        success: {
            bg: "bg-green-50",
            border: "border-green-200",
            icon: "text-green-600",
            title: "text-green-800",
            message: "text-green-700",
        },
        error: {
            bg: "bg-red-50",
            border: "border-red-200",
            icon: "text-red-600",
            title: "text-red-800",
            message: "text-red-700",
        },
        warning: {
            bg: "bg-amber-50",
            border: "border-amber-200",
            icon: "text-amber-600",
            title: "text-amber-800",
            message: "text-amber-700",
        },
        info: {
            bg: "bg-blue-50",
            border: "border-blue-200",
            icon: "text-blue-600",
            title: "text-blue-800",
            message: "text-blue-700",
        },
    };

    const style = styles[type];

    return (
        <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
                "pointer-events-auto flex items-start gap-3 p-4 min-w-[320px] max-w-md rounded-xl border shadow-lg",
                style.bg,
                style.border
            )}
            role="alert"
        >
            <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", style.icon)} />
            <div className="flex-1 min-w-0">
                <h4 className={cn("font-semibold text-sm", style.title)}>
                    {title}
                </h4>
                {message && (
                    <p className={cn("text-sm mt-0.5", style.message)}>
                        {message}
                    </p>
                )}
            </div>
            <button
                onClick={onDismiss}
                className={cn(
                    "p-1 rounded-full flex-shrink-0 transition-colors hover:bg-white/50",
                    style.icon
                )}
                aria-label="Dismiss"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

export { ToastContainer, ToastItem };
