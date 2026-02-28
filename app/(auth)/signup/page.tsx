"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Github, Loader2, Check, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

function getPasswordStrength(password: string) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 1) return { label: "Weak", class: "strength-weak", color: "text-red-500" };
    if (score <= 2) return { label: "Fair", class: "strength-fair", color: "text-amber-500" };
    if (score <= 3) return { label: "Strong", class: "strength-strong", color: "text-emerald-500" };
    return { label: "Very Strong", class: "strength-very-strong", color: "text-cyan-500" };
}

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState<"form" | "otp">("form");

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // OTP state
    const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
    const [otpError, setOtpError] = useState("");
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

    // Cooldown timer
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    // Auto-focus first OTP input
    useEffect(() => {
        if (step === "otp") {
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
    }, [step]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = "We need your name to personalize your experience";
        if (!email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "That doesn't look like a valid email";
        if (password.length < 8) newErrors.password = "Almost there — just need 8+ characters for security";
        if (!agreed) newErrors.agreed = "One more tap — agree to our terms to get started";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const sendOtp = async () => {
        setIsSendingOtp(true);
        setOtpError("");
        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 409) {
                    setErrors({ email: data.error });
                    setIsSendingOtp(false);
                    return false;
                }
                toast.error(data.error || "Failed to send code");
                setErrors({ email: data.error || "Failed to send verification code" });
                setIsSendingOtp(false);
                return false;
            }
            setCooldown(60);
            toast.success("Verification code sent to your email!");
            setIsSendingOtp(false);
            return true;
        } catch {
            toast.error("Failed to send verification code");
            setErrors({ email: "Failed to send verification code" });
            setIsSendingOtp(false);
            return false;
        }
    };

    const handleContinue = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const sent = await sendOtp();
        if (sent) {
            setStep("otp");
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newDigits = [...otpDigits];

        if (value.length > 1) {
            // Handle paste
            const digits = value.slice(0, 6).split("");
            digits.forEach((d, i) => {
                if (index + i < 6) newDigits[index + i] = d;
            });
            setOtpDigits(newDigits);
            const nextIndex = Math.min(index + digits.length, 5);
            inputRefs.current[nextIndex]?.focus();
        } else {
            newDigits[index] = value;
            setOtpDigits(newDigits);
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const verifyAndSignup = async () => {
        const code = otpDigits.join("");
        if (code.length !== 6) {
            setOtpError("Please enter the full 6-digit code");
            return;
        }

        setIsVerifying(true);
        setOtpError("");

        try {
            // Verify OTP
            const verifyRes = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            });
            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
                setOtpError(verifyData.error || "Invalid code");
                setIsVerifying(false);
                return;
            }

            setIsVerifying(false);
            setIsCreating(true);

            // Create account
            const signupRes = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const signupData = await signupRes.json();

            if (!signupRes.ok) {
                setOtpError(signupData.error || "Signup failed");
                setIsCreating(false);
                return;
            }

            // Auto sign in
            await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            toast.success("Welcome to Lextriq! 🎉");
            router.push("/dashboard");
            router.refresh();
        } catch {
            setOtpError("Something went wrong");
            setIsVerifying(false);
            setIsCreating(false);
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
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-10"
            >
                <Link href="/" className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-zinc-900 font-[family-name:var(--font-bricolage)]">
                    <Image src="/logo.svg" alt="Lextriq" width={34} height={34} />
                    Lextriq
                </Link>
            </motion.div>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full max-w-[400px]"
            >
                <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
                    <AnimatePresence mode="wait">
                        {step === "form" ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h1
                                    className="text-2xl font-semibold text-zinc-900 mb-1 tracking-tight"
                                    style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                                >
                                    Create your account
                                </h1>
                                <p className="text-sm text-zinc-500 mb-7">Join the Lextriq prompt community</p>

                                {/* OAuth */}
                                <div className="space-y-2.5 mb-6">
                                    <button
                                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
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
                                        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
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
                                <form onSubmit={handleContinue} className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-zinc-700 mb-1.5 block">Full Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200 transition-all"
                                            placeholder="John Doe"
                                        />
                                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-zinc-700 mb-1.5 block">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200 transition-all"
                                            placeholder="you@example.com"
                                        />
                                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-zinc-700 mb-1.5 block">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200 transition-all"
                                                placeholder="Min 8 characters"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {password && (
                                            <div className="mt-2">
                                                <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
                                                    <div className={`strength-meter ${passwordStrength.class}`} />
                                                </div>
                                                <p className={`text-xs mt-1 ${passwordStrength.color}`}>
                                                    {passwordStrength.label}
                                                </p>
                                            </div>
                                        )}
                                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                                    </div>


                                    <div className="flex items-start gap-2.5 pt-1">
                                        <Checkbox
                                            id="terms"
                                            checked={agreed}
                                            onCheckedChange={(checked) => setAgreed(checked as boolean)}
                                            className="mt-0.5 border-zinc-300 data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900"
                                        />
                                        <label htmlFor="terms" className="text-sm text-zinc-500 leading-snug">
                                            I agree to the{" "}
                                            <span className="text-zinc-900 hover:underline cursor-pointer">Terms of Service</span>{" "}
                                            and{" "}
                                            <span className="text-zinc-900 hover:underline cursor-pointer">Privacy Policy</span>
                                        </label>
                                    </div>
                                    {errors.agreed && <p className="text-xs text-red-500">{errors.agreed}</p>}

                                    <Button
                                        type="submit"
                                        disabled={isSendingOtp}
                                        className="w-full bg-zinc-900 text-white hover:bg-zinc-800 rounded-full py-5 text-sm font-medium cursor-pointer"
                                    >
                                        {isSendingOtp ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Sending code...
                                            </>
                                        ) : (
                                            "Continue"
                                        )}
                                    </Button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                            >
                                <button
                                    onClick={() => { setStep("form"); setOtpDigits(["", "", "", "", "", ""]); setOtpError(""); }}
                                    className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-600 transition-colors mb-5 cursor-pointer"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </button>

                                <div className="flex items-center justify-center w-12 h-12 bg-zinc-100 rounded-full mb-5 mx-auto">
                                    <Mail className="w-5 h-5 text-zinc-600" />
                                </div>

                                <h1
                                    className="text-2xl font-semibold text-zinc-900 mb-1 tracking-tight text-center"
                                    style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                                >
                                    Check your email
                                </h1>
                                <p className="text-sm text-zinc-500 mb-7 text-center">
                                    We sent a 6-digit code to <span className="font-medium text-zinc-700">{email}</span>
                                </p>

                                {/* OTP Input */}
                                <div className="flex justify-center gap-2.5 mb-5">
                                    {otpDigits.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={(el) => { inputRefs.current[i] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={i === 0 ? 6 : 1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                            className="w-11 h-12 text-center text-lg font-semibold bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200 transition-all"
                                        />
                                    ))}
                                </div>

                                {otpError && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-sm text-red-500 text-center mb-4"
                                    >
                                        {otpError}
                                    </motion.p>
                                )}

                                <Button
                                    onClick={verifyAndSignup}
                                    disabled={isVerifying || isCreating || otpDigits.join("").length !== 6}
                                    className="w-full bg-zinc-900 text-white hover:bg-zinc-800 rounded-full py-5 text-sm font-medium cursor-pointer mb-4"
                                >
                                    {isVerifying ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : isCreating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        "Verify & Create Account"
                                    )}
                                </Button>

                                <p className="text-center text-sm text-zinc-400">
                                    Didn&apos;t get the code?{" "}
                                    {cooldown > 0 ? (
                                        <span className="text-zinc-500">Resend in {cooldown}s</span>
                                    ) : (
                                        <button
                                            onClick={sendOtp}
                                            disabled={isSendingOtp}
                                            className="text-zinc-900 font-medium hover:underline cursor-pointer"
                                        >
                                            Resend
                                        </button>
                                    )}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {step === "form" && (
                    <p className="mt-6 text-center text-sm text-zinc-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-zinc-900 font-medium hover:underline">
                            Sign in →
                        </Link>
                    </p>
                )}
            </motion.div>
        </div>
    );
}
