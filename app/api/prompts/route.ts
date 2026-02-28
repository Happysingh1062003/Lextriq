import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

import { getPrompts, getUserInteractionState } from "@/lib/queries";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const session = await auth();
        const userId = session?.user?.id;

        const data = await getPrompts({
            category: searchParams.get("category"),
            aiTool: searchParams.get("aiTool"),
            difficulty: searchParams.get("difficulty"),
            sort: searchParams.get("sort"),
            search: searchParams.get("search"),
            page: parseInt(searchParams.get("page") || "1"),
            limit: parseInt(searchParams.get("limit") || "12"),
        });

        const interactionState = await getUserInteractionState(userId, data.prompts.map(p => p.id));

        return NextResponse.json({
            ...data,
            interactionState: {
                upvotedIds: Array.from(interactionState.upvotedIds),
                bookmarkedIds: Array.from(interactionState.bookmarkedIds)
            }
        });
    } catch (error) {
        console.error("Error fetching prompts:", error);
        return NextResponse.json(
            { error: "Failed to fetch prompts" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, content, description, category, aiTool, tags, difficulty, results, published } = body;

        if (!title || !content || !category) {
            return NextResponse.json(
                { error: "Title, content, and category are required" },
                { status: 400 }
            );
        }

        const prompt = await prisma.prompt.create({
            data: {
                title,
                content,
                description,
                category,
                aiTool: aiTool || [],
                tags: tags || [],
                difficulty: difficulty || "BEGINNER",
                published: published !== false,
                authorId: (session.user as any).id,
                results: results
                    ? {
                        create: results.map((r: any) => ({
                            type: r.type,
                            url: r.url || null,
                            content: r.content || null,
                        })),
                    }
                    : undefined,
            },
            include: {
                author: { select: { id: true, name: true, image: true } },
                results: true,
                _count: { select: { upvotes: true, bookmarks: true, comments: true } },
            },
        });

        return NextResponse.json(prompt, { status: 201 });
    } catch (error) {
        console.error("Error creating prompt:", error);
        return NextResponse.json(
            { error: "Failed to create prompt" },
            { status: 500 }
        );
    }
}
