import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: promptId } = await params;
        const userId = (session.user as any).id;

        const existing = await prisma.bookmark.findUnique({
            where: { userId_promptId: { userId, promptId } },
        });

        if (existing) {
            await prisma.bookmark.delete({
                where: { id: existing.id },
            });
            return NextResponse.json({ bookmarked: false });
        } else {
            await prisma.bookmark.create({
                data: { userId, promptId },
            });
            return NextResponse.json({ bookmarked: true });
        }
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to toggle bookmark" },
            { status: 500 }
        );
    }
}
