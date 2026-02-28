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

        const existing = await prisma.upvote.findUnique({
            where: { userId_promptId: { userId, promptId } },
        });

        if (existing) {
            await prisma.upvote.delete({
                where: { id: existing.id },
            });
            const count = await prisma.upvote.count({ where: { promptId } });
            return NextResponse.json({ upvoted: false, count });
        } else {
            await prisma.upvote.create({
                data: { userId, promptId },
            });
            const count = await prisma.upvote.count({ where: { promptId } });
            return NextResponse.json({ upvoted: true, count });
        }
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to toggle upvote" },
            { status: 500 }
        );
    }
}
