"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface StepIndicatorProps {
    steps: string[];
    currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    return (
        <div className="flex items-center justify-center gap-0 mb-8">
            {steps.map((step, index) => (
                <div key={step} className="flex items-center">
                    {/* Step circle */}
                    <div className="flex flex-col items-center gap-2">
                        <motion.div
                            className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all",
                                index < currentStep
                                    ? "bg-pv-primary border-pv-primary text-white"
                                    : index === currentStep
                                        ? "border-pv-primary text-pv-primary bg-pv-primary/10"
                                        : "border-zinc-200 text-zinc-400 bg-transparent"
                            )}
                            animate={
                                index === currentStep
                                    ? {
                                        boxShadow: [
                                            "0 0 0 0 rgba(124, 58, 237, 0.4)",
                                            "0 0 0 8px rgba(124, 58, 237, 0)",
                                        ],
                                    }
                                    : {}
                            }
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            {index < currentStep ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                index + 1
                            )}
                        </motion.div>
                        <span
                            className={cn(
                                "text-xs whitespace-nowrap",
                                index <= currentStep ? "text-pv-text" : "text-pv-muted"
                            )}
                        >
                            {step}
                        </span>
                    </div>

                    {/* Connector line */}
                    {index < steps.length - 1 && (
                        <div
                            className={cn(
                                "w-16 h-0.5 mx-2 mt-[-1.25rem]",
                                index < currentStep ? "bg-pv-primary" : "bg-zinc-200"
                            )}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
