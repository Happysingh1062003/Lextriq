"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Github, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("That email/password combo didn't work. Try again or reset your password.");
                setIsLoading(false);
                return;
            }

            toast.success("Welcome back!");
            router.push("/dashboard");
            router.refresh();
        } catch {
            setError("Oops — something broke on our end. Try again in a moment.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12 relative">
            {/* Home button */}
            <Link
                href="/"
                className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Home
            </Link>

            {/* Logo */}
            <div className="mb-10">
                <Link href="/" className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-zinc-900 font-[family-name:var(--font-bricolage)]">
                    <Image src="/logo.svg" alt="Lextriq" width={34} height={34} />
                    Lextriq
                </Link>
            </div>

            {/* Card */}
            <div className="w-full max-w-[400px]">
                <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
                    <h1
                        className="text-2xl font-semibold text-zinc-900 mb-1 tracking-tight"
                        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                    >
                        Welcome back
                    </h1>
                    <p className="text-sm text-zinc-500 mb-7">Sign in to your account</p>

                    {/* OAuth */}
                    <div className="space-y-2.5 mb-6">
                        <button
                            onClick={() => signIn("google", { redirectTo: "/dashboard" })}
                            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                        <button
                            onClick={() => signIn("github", { redirectTo: "/dashboard" })}
                            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                        >
                            <Github className="w-4 h-4" />
                            Continue with GitHub
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-zinc-200" />
                        <span className="text-xs text-zinc-400 uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-zinc-200" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium text-zinc-700 mb-1.5 block">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200 transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-sm font-medium text-zinc-700">Password</label>
                                <button type="button" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200 transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-zinc-900 text-white hover:bg-zinc-800 rounded-full py-5 text-sm font-medium cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-zinc-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-zinc-900 font-medium hover:underline">
                        Sign up →
                    </Link>
                </p>
            </div>
        </div>
    );
}
