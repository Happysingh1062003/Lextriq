import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, bio, image, currentPassword, newPassword } = body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (bio !== undefined) updateData.bio = bio;
        if (image !== undefined) updateData.image = image;

        // Password change
        if (currentPassword && newPassword) {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
            });

            if (!user?.password) {
                return NextResponse.json(
                    { error: "Cannot change password for OAuth accounts" },
                    { status: 400 }
                );
            }

            const isValid = await bcrypt.compare(currentPassword, user.password);
            if (!isValid) {
                return NextResponse.json(
                    { error: "Current password is incorrect" },
                    { status: 400 }
                );
            }

            updateData.password = await bcrypt.hash(newPassword, 12);
        }

        const updated = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
                role: true,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.user.delete({
            where: { id: session.user.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete account" },
            { status: 500 }
        );
    }
}
