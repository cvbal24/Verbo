"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { loginSchema, type LoginSchemaType } from "./auth.schema";
import { useLogin } from "./auth.hooks";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error, clearError } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginSchemaType) => {
        await login(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <ErrorMessage
                    message={error}
                    variant="error"
                    onDismiss={clearError}
                />
            )}

            <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
                disabled={isLoading}
                {...register("email")}
            />

            <div className="relative">
                <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
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

            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        className={cn(
                            "w-4 h-4 rounded border-slate-300 text-primary-500",
                            "focus:ring-primary-500 focus:ring-offset-0"
                        )}
                        {...register("rememberMe")}
                    />
                    <span className="text-sm text-slate-600">Remember me</span>
                </label>

                <Link
                    href={ROUTES.AUTH.FORGOT_PASSWORD}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                    Forgot password?
                </Link>
            </div>

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
                        Signing in...
                    </>
                ) : (
                    "Sign in"
                )}
            </Button>

            <p className="text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <Link
                    href={ROUTES.AUTH.REGISTER}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                >
                    Sign up for free
                </Link>
            </p>
        </form>
    );
}

export default LoginForm;
