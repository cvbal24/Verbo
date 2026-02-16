"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { registerSchema, type RegisterSchemaType } from "./auth.schema";
import { useRegister, usePasswordStrength } from "./auth.hooks";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register: registerUser, isLoading, error, clearError } = useRegister();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterSchemaType>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            agreedToTerms: false as unknown as true,
        },
    });

    const password = watch("password", "");
    const passwordStrength = usePasswordStrength(password);

    const onSubmit = async (data: RegisterSchemaType) => {
        await registerUser(data);
    };

    const strengthLabels = ["Weak", "Fair", "Good", "Strong", "Excellent"];
    const strengthColors = [
        "bg-red-500",
        "bg-orange-500",
        "bg-yellow-500",
        "bg-green-500",
        "bg-emerald-500",
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
                <ErrorMessage
                    message={error}
                    variant="error"
                    onDismiss={clearError}
                />
            )}

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="First name"
                    placeholder="John"
                    autoComplete="given-name"
                    error={errors.firstName?.message}
                    disabled={isLoading}
                    {...register("firstName")}
                />

                <Input
                    label="Last name"
                    placeholder="Doe"
                    autoComplete="family-name"
                    error={errors.lastName?.message}
                    disabled={isLoading}
                    {...register("lastName")}
                />
            </div>

            <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
                disabled={isLoading}
                {...register("email")}
            />

            <div className="space-y-2">
                <div className="relative">
                    <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        error={errors.password?.message}
                        disabled={isLoading}
                        {...register("password")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {password && (
                    <div className="space-y-2">
                        {/* Strength bar */}
                        <div className="flex gap-1">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "h-1 flex-1 rounded-full transition-colors",
                                        i <= passwordStrength.score
                                            ? strengthColors[passwordStrength.score]
                                            : "bg-slate-200"
                                    )}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-slate-500">
                            Password strength:{" "}
                            <span
                                className={cn("font-medium", {
                                    "text-red-600": passwordStrength.score <= 1,
                                    "text-yellow-600": passwordStrength.score === 2,
                                    "text-green-600": passwordStrength.score >= 3,
                                })}
                            >
                                {strengthLabels[passwordStrength.score]}
                            </span>
                        </p>

                        {/* Password requirements */}
                        <ul className="space-y-1">
                            {[
                                { test: password.length >= 8, text: "At least 8 characters" },
                                { test: /[A-Z]/.test(password), text: "One uppercase letter" },
                                { test: /[a-z]/.test(password), text: "One lowercase letter" },
                                { test: /[0-9]/.test(password), text: "One number" },
                            ].map(({ test, text }) => (
                                <li
                                    key={text}
                                    className={cn(
                                        "flex items-center gap-2 text-xs",
                                        test ? "text-green-600" : "text-slate-400"
                                    )}
                                >
                                    {test ? (
                                        <Check className="w-3.5 h-3.5" />
                                    ) : (
                                        <X className="w-3.5 h-3.5" />
                                    )}
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="relative">
                <Input
                    label="Confirm password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    error={errors.confirmPassword?.message}
                    disabled={isLoading}
                    {...register("confirmPassword")}
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                >
                    {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    className={cn(
                        "w-4 h-4 mt-0.5 rounded border-slate-300 text-primary-500",
                        "focus:ring-primary-500 focus:ring-offset-0"
                    )}
                    {...register("agreedToTerms")}
                />
                <span className="text-sm text-slate-600">
                    I agree to the{" "}
                    <Link
                        href="/terms"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Privacy Policy
                    </Link>
                </span>
            </label>
            {errors.agreedToTerms && (
                <p className="text-sm text-red-600 -mt-3">
                    {errors.agreedToTerms.message}
                </p>
            )}

            <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="w-full"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating account...
                    </>
                ) : (
                    "Create account"
                )}
            </Button>

            <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                    href={ROUTES.AUTH.LOGIN}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                >
                    Sign in
                </Link>
            </p>
        </form>
    );
}

export default RegisterForm;
