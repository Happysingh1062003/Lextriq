import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Single query: increment views and fetch full data
        const prompt = await prisma.prompt.update({
            where: { id },
            data: { views: { increment: 1 } },
            include: {
                author: { select: { id: true, name: true, image: true, bio: true } },
                results: true,
                upvotes: { select: { userId: true } },
                bookmarks: { select: { userId: true } },
                comments: {
                    include: {
                        user: { select: { id: true, name: true, image: true } },
                    },
                    orderBy: { createdAt: "desc" },
                },
                _count: { select: { upvotes: true, bookmarks: true, comments: true } },
            },
        });

        revalidateTag("prompts", {});

        return NextResponse.json(prompt, { status: 200 });
    } catch (error: any) {
        // Prisma throws when record not found on update
        if (error?.code === "P2025") {
            return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
        }
        return NextResponse.json(
            { error: "Failed to fetch prompt" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const existing = await prisma.prompt.findUnique({ where: { id } });

        if (!existing || existing.authorId !== (session.user as any).id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { title, content, description, category, aiTool, tags, difficulty, published } = body;

        const prompt = await prisma.prompt.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(content && { content }),
                ...(description !== undefined && { description }),
                ...(category && { category }),
                ...(aiTool && { aiTool }),
                ...(tags && { tags }),
                ...(difficulty && { difficulty }),
                ...(published !== undefined && { published }),
            },
            include: {
                author: { select: { id: true, name: true, image: true } },
                results: true,
                _count: { select: { upvotes: true, bookmarks: true, comments: true } },
            },
        });

        return NextResponse.json(prompt);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update prompt" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const existing = await prisma.prompt.findUnique({ where: { id } });

        if (!existing || existing.authorId !== (session.user as any).id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.prompt.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete prompt" },
            { status: 500 }
        );
    }
}
