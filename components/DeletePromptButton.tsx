"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/ConfirmModal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeletePromptButtonProps {
    promptId: string;
}

export function DeletePromptButton({ promptId }: DeletePromptButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/prompts/${promptId}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            toast.success("Prompt deleted");
            router.refresh();
        } catch {
            toast.error("Failed to delete");
        } finally {
            setIsDeleting(false);
            setIsOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(true);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 z-10"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>
            <ConfirmModal
                open={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleDelete}
                title="Delete Prompt"
                description="This action is irreversible. Your prompt and all its comments will be permanently deleted."
                confirmLabel="Delete"
                variant="destructive"
                isLoading={isDeleting}
            />
        </>
    );
}
