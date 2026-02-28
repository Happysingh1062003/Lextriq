import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: promptId } = await params;

        const comments = await prisma.comment.findMany({
            where: { promptId },
            include: {
                user: { select: { id: true, name: true, image: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(comments);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        );
    }
}

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
        const { content } = await req.json();

        if (!content?.trim()) {
            return NextResponse.json(
                { error: "Comment content is required" },
                { status: 400 }
            );
        }

        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                userId: (session.user as any).id,
                promptId,
            },
            include: {
                user: { select: { id: true, name: true, image: true } },
            },
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create comment" },
            { status: 500 }
        );
    }
}
