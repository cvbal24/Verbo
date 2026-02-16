import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
                <h2 className="text-xl font-semibold text-slate-700 mb-2">
                    Page not found
                </h2>
                <p className="text-slate-500 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
