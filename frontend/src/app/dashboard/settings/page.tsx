"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    Bell,
    Globe,
    Volume2,
    Moon,
    LogOut,
    ChevronRight,
    Save,
    Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/features/auth/auth.hooks";
import { SUPPORTED_LANGUAGES, PROFICIENCY_LEVELS } from "@/constants/languages";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const { user, updateUser } = useAuthStore();
    const { logout, isLoading: isLoggingOut } = useLogout();
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
    });

    const [preferences, setPreferences] = useState({
        theme: user?.preferences?.theme || "light",
        soundEnabled: user?.preferences?.soundEnabled ?? true,
        notificationsEnabled: user?.preferences?.notificationsEnabled ?? true,
        autoPlayAudio: user?.preferences?.autoPlayAudio ?? true,
        showRomanization: user?.preferences?.showRomanization ?? true,
        fontSize: user?.preferences?.fontSize || "medium",
    });

    const handleSaveProfile = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        updateUser({
            firstName: formData.firstName,
            lastName: formData.lastName,
        });
        setIsSaving(false);
    };

    const handleTogglePreference = (key: keyof typeof preferences) => {
        setPreferences((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    Settings
                </h1>
                <p className="text-slate-500">
                    Manage your account and preferences
                </p>
            </motion.div>

            {/* Profile Settings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card variant="elevated">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-primary-500" />
                            Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                                <User className="w-8 h-8 text-primary-600" />
                            </div>
                            <div>
                                <Button variant="outline" size="sm">
                                    Change Photo
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                value={formData.firstName}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        firstName: e.target.value,
                                    }))
                                }
                            />
                            <Input
                                label="Last Name"
                                value={formData.lastName}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        lastName: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            disabled
                            hint="Contact support to change your email"
                        />

                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Language Settings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card variant="elevated">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary-500" />
                            Language & Learning
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <SettingRow
                                label="Target Language"
                                value={
                                    SUPPORTED_LANGUAGES.find(
                                        (l) =>
                                            l.code ===
                                            user?.profile?.targetLanguage
                                    )?.name || "Spanish"
                                }
                            />
                            <SettingRow
                                label="Current Level"
                                value={
                                    PROFICIENCY_LEVELS.find(
                                        (l) =>
                                            l.level ===
                                            user?.profile?.proficiencyLevel
                                    )?.name ||
                                    user?.profile?.proficiencyLevel ||
                                    "Beginner"
                                }
                            />
                            <SettingRow
                                label="Daily Goal"
                                value={`${user?.profile?.dailyGoalMinutes || 15} minutes`}
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Preferences */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card variant="elevated">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary-500" />
                            Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <ToggleSetting
                                icon={Bell}
                                label="Push Notifications"
                                description="Get reminders to practice"
                                enabled={preferences.notificationsEnabled}
                                onToggle={() =>
                                    handleTogglePreference("notificationsEnabled")
                                }
                            />
                            <ToggleSetting
                                icon={Volume2}
                                label="Sound Effects"
                                description="Play sounds for correct/incorrect answers"
                                enabled={preferences.soundEnabled}
                                onToggle={() =>
                                    handleTogglePreference("soundEnabled")
                                }
                            />
                            <ToggleSetting
                                icon={Volume2}
                                label="Auto-play Audio"
                                description="Automatically play word pronunciations"
                                enabled={preferences.autoPlayAudio}
                                onToggle={() =>
                                    handleTogglePreference("autoPlayAudio")
                                }
                            />
                            <ToggleSetting
                                icon={Globe}
                                label="Show Romanization"
                                description="Display romanized text for non-Latin scripts"
                                enabled={preferences.showRomanization}
                                onToggle={() =>
                                    handleTogglePreference("showRomanization")
                                }
                            />
                            <ToggleSetting
                                icon={Moon}
                                label="Dark Mode"
                                description="Use dark theme"
                                enabled={preferences.theme === "dark"}
                                onToggle={() =>
                                    setPreferences((prev) => ({
                                        ...prev,
                                        theme:
                                            prev.theme === "dark"
                                                ? "light"
                                                : "dark",
                                    }))
                                }
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Logout */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card variant="elevated">
                    <CardContent className="py-4">
                        <button
                            onClick={logout}
                            disabled={isLoggingOut}
                            className="w-full flex items-center justify-between p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <span className="flex items-center gap-3">
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">
                                    {isLoggingOut
                                        ? "Logging out..."
                                        : "Log Out"}
                                </span>
                            </span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

function SettingRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <span className="text-slate-600">{label}</span>
            <span className="font-medium text-slate-900">{value}</span>
        </div>
    );
}

function ToggleSetting({
    icon: Icon,
    label,
    description,
    enabled,
    onToggle,
}: {
    icon: React.ElementType;
    label: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
}) {
    return (
        <button
            onClick={onToggle}
            className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors"
        >
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex-1 text-left">
                <p className="font-medium text-slate-900">{label}</p>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
            <div
                className={cn(
                    "w-11 h-6 rounded-full relative transition-colors",
                    enabled ? "bg-primary-500" : "bg-slate-200"
                )}
            >
                <div
                    className={cn(
                        "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform",
                        enabled ? "translate-x-6" : "translate-x-1"
                    )}
                />
            </div>
        </button>
    );
}
