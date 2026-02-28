"use client";

import { AlertTriangle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    onClose?: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    variant?: "destructive" | "default";
    isLoading?: boolean;
}

export function ConfirmModal({
    open,
    onOpenChange,
    onClose,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    variant = "default",
    isLoading,
}: ConfirmModalProps) {
    const handleOpenChange = (val: boolean) => {
        if (onOpenChange) onOpenChange(val);
        if (!val && onClose) onClose();
    };

    const isDestructive = variant === "destructive";

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="bg-white border-zinc-200 shadow-2xl rounded-2xl max-w-sm mx-auto p-0 gap-0 overflow-hidden"
                showCloseButton={false}
            >
                <div className="p-6 pb-5">
                    <DialogHeader className="gap-3">
                        {/* Icon */}
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mx-auto sm:mx-0 ${isDestructive ? "bg-red-50" : "bg-zinc-100"}`}>
                            <AlertTriangle className={`w-5 h-5 ${isDestructive ? "text-red-500" : "text-zinc-600"}`} strokeWidth={2} />
                        </div>
                        <DialogTitle className="text-zinc-900 text-[17px] font-semibold tracking-tight text-center sm:text-left">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 text-[13.5px] leading-relaxed text-center sm:text-left">
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <DialogFooter className="bg-zinc-50/80 border-t border-zinc-100 px-6 py-4 gap-2 sm:gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        className="flex-1 sm:flex-none border-zinc-200 text-zinc-700 hover:bg-white rounded-xl h-10 text-[13px] font-medium"
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 sm:flex-none rounded-xl h-10 text-[13px] font-medium ${isDestructive
                            ? "bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-200"
                            : "bg-zinc-900 hover:bg-zinc-800 text-white"
                            }`}
                    >
                        {isLoading ? "Deleting..." : confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
