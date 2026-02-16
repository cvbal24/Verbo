
import Link from "next/link";
import { Button } from "../ui/Button";

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 z-50">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
                        <span className="text-white font-bold text-xl">V</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-primary-600 transition-colors">
                        Verbo
                    </span>
                </Link>

                <div className="hidden md:flex items-center space-x-10">
                    <NavLink href="#features">Features</NavLink>
                    <NavLink href="#method">Method</NavLink>
                    <NavLink href="#testimonials">Stories</NavLink>
                    <NavLink href="#pricing">Plans</NavLink>
                </div>

                <div className="flex items-center space-x-4">
                    <Link href="/auth/login" className="hidden sm:block">
                        <Button variant="ghost" className="font-medium">
                            Log in
                        </Button>
                    </Link>
                    <Link href="/auth/register">
                        <Button size="md" className="shadow-xl shadow-primary-500/10">Get Started</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-slate-500 hover:text-primary-600 font-medium transition-colors text-base relative group"
        >
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full opacity-50"></span>
        </Link>
    );
}
