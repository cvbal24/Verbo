"use client";

import { ReactNode } from "react";
import { ToastProvider } from "@/components/feedback/SuccessToast";

export function Providers({ children }: { children: ReactNode }) {
    return <ToastProvider>{children}</ToastProvider>;
}
