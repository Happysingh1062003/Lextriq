"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import {
    User,
    KeyRound,
    Trash2,
    Camera,
    Save,
    Loader2,
    AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { UserAvatar } from "@/components/UserAvatar";
import { ConfirmModal } from "@/components/ConfirmModal";
import { toast } from "sonner";

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                const res = await fetch("/api/users/me");
                const data = await res.json();
                setName(data.name || "");
                setBio(data.bio || "");
                if (data.image) setAvatarUrl(data.image);
            } catch {
                toast.error("Failed to load profile");
            }
        }
        loadProfile();
    }, []);

    const saveProfile = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/users/me", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, bio }),
            });
            if (!res.ok) throw new Error();
            await update({ name });
            toast.success("Profile updated!");
        } catch {
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be under 2MB");
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        setIsUploadingAvatar(true);
        try {
            // Convert to base64 data URL and save directly
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const imageDataUrl = reader.result as string;

                    // Save to profile via API
                    const res = await fetch("/api/users/me", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ image: imageDataUrl }),
                    });

                    if (!res.ok) throw new Error();
                    setAvatarUrl(imageDataUrl);
                    await update({ image: imageDataUrl });
                    toast.success("Profile photo updated!");
                } catch {
                    toast.error("Failed to save profile photo");
                } finally {
                    setIsUploadingAvatar(false);
                }
            };
            reader.readAsDataURL(file);
        } catch {
            toast.error("Failed to upload photo");
            setIsUploadingAvatar(false);
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const changePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setIsChangingPassword(true);
        try {
            const res = await fetch("/api/users/me", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            toast.success("Password changed!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to change password";
            toast.error(message);
        } finally {
            setIsChangingPassword(false);
        }
    };

    const deleteAccount = async () => {
        setIsDeletingAccount(true);
        try {
            const res = await fetch("/api/users/me", { method: "DELETE" });
            if (!res.ok) throw new Error();
            toast.success("Account deleted");
            await signOut({ callbackUrl: "/" });
        } catch {
            toast.error("Failed to delete account");
            setIsDeletingAccount(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h2 className="text-xl font-semibold text-zinc-900 font-[family-name:var(--font-bricolage)]">
                    Settings
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                    Manage your profile and account preferences.
                </p>
            </div>

            {/* Profile Section */}
            <GlassCard hover={false}>
                <div className="flex items-center gap-2 mb-6">
                    <User className="w-4 h-4 text-pv-primary" />
                    <h3 className="text-lg font-semibold text-pv-text font-[family-name:var(--font-bricolage)]">
                        Profile
                    </h3>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-5 mb-8 p-4 bg-zinc-50/80 rounded-xl">
                    <div className="relative shrink-0">
                        <UserAvatar
                            name={session?.user?.name}
                            image={avatarUrl || session?.user?.image}
                            className="w-20 h-20 text-xl"
                        />
                        {isUploadingAvatar && (
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                            </div>
                        )}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingAvatar}
                            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-zinc-900 border-2 border-white flex items-center justify-center text-white hover:bg-zinc-700 transition-colors disabled:opacity-50"
                        >
                            <Camera className="w-3.5 h-3.5" />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-900">
                            {session?.user?.name}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">{session?.user?.email}</p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingAvatar}
                            className="text-xs text-pv-primary hover:underline mt-2 font-medium disabled:opacity-50"
                        >
                            {isUploadingAvatar ? "Uploading..." : "Change photo"}
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-pv-muted mb-1.5 block">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200 transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-pv-muted mb-1.5 block">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200 transition-all resize-none"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    <Button
                        onClick={saveProfile}
                        disabled={isSaving}
                        className="bg-pv-primary hover:bg-pv-primary-2 text-white glow-button"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Changes
                    </Button>
                </div>
            </GlassCard>

            {/* Password Section */}
            <GlassCard hover={false}>
                <div className="flex items-center gap-2 mb-6">
                    <KeyRound className="w-4 h-4 text-pv-primary" />
                    <h3 className="text-lg font-semibold text-pv-text font-[family-name:var(--font-bricolage)]">
                        Change Password
                    </h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-pv-muted mb-1.5 block">
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-pv-muted mb-1.5 block">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200 transition-all"
                            placeholder="Min 8 characters"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-pv-muted mb-1.5 block">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200 transition-all"
                            placeholder="Re-enter new password"
                        />
                    </div>

                    <Button
                        onClick={changePassword}
                        disabled={isChangingPassword || !currentPassword || !newPassword}
                        variant="outline"
                        className="border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                    >
                        {isChangingPassword ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <KeyRound className="w-4 h-4 mr-2" />
                        )}
                        Update Password
                    </Button>
                </div>
            </GlassCard>

            {/* Danger Zone */}
            <GlassCard hover={false} className="border-red-500/20">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <h3 className="text-lg font-semibold text-red-400 font-[family-name:var(--font-bricolage)]">
                        Danger Zone
                    </h3>
                </div>
                <p className="text-sm text-pv-muted mb-4">
                    Permanently delete your account and all associated data. This cannot
                    be undone.
                </p>
                <Button
                    variant="outline"
                    onClick={() => setShowDeleteModal(true)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                </Button>
            </GlassCard>

            <ConfirmModal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deleteAccount}
                title="Delete Account"
                description="All your data including prompts, comments, and bookmarks will be permanently deleted. This action cannot be undone."
                confirmLabel="Delete My Account"
                variant="destructive"
                isLoading={isDeletingAccount}
            />
        </div>
    );
}
