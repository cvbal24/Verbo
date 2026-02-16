"use client";

import { ReactNode, useCallback, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/auth.store";
import { Bell, Menu, User } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

            {/* Main Content */}
            <div className="md:pl-64 transition-all duration-300">
                {/* Header */}
                <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-3">
                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Welcome back
                                {user?.firstName && `, ${user.firstName}`}
                            </h2>
                            <p className="text-sm text-slate-500 hidden sm:block">
                                Keep up the great work!
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />
                        </button>

                        {/* Profile */}
                        <Link
                            href={ROUTES.DASHBOARD.SETTINGS}
                            className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                                {user?.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.firstName}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-5 h-5 text-primary-600" />
                                )}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-slate-900">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {user?.profile?.proficiencyLevel || "A1"} •{" "}
                                    {user?.profile?.streak || 0} day streak
                                </p>
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}
