import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { cache } from "react";
import { unstable_cache } from "next/cache";

export type GetPromptsParams = {
    category?: string | null;
    aiTool?: string | null;
    difficulty?: string | null;
    sort?: string | null;
    search?: string | null;
    page?: number;
    limit?: number;
};

// We wrap the DB query in Next.js unstable_cache so the feed hits the cache, not the DB.
const getCachedPrompts = unstable_cache(
    async (params: GetPromptsParams) => {
        const { category, aiTool, difficulty, sort = "trending", search, page = 1, limit = 12 } = params;

        const where: Prisma.PromptWhereInput = { published: true };

        if (category) {
            const categories = category.split(",");
            where.category = { in: categories };
        }

        if (aiTool) {
            const tools = aiTool.split(",");
            where.aiTool = { hasSome: tools };
        }

        if (difficulty) {
            where.difficulty = difficulty as Prisma.EnumDifficultyFilter;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
                { tags: { hasSome: [search] } },
            ];
        }

        let orderBy: Prisma.PromptOrderByWithRelationInput | Prisma.PromptOrderByWithRelationInput[] = { createdAt: "desc" };
        if (sort === "trending") {
            orderBy = [{ upvotes: { _count: "desc" } }, { createdAt: "desc" }];
        } else if (sort === "upvotes") {
            orderBy = { upvotes: { _count: "desc" } };
        } else if (sort === "saved") {
            orderBy = { bookmarks: { _count: "desc" } };
        } else if (sort === "newest") {
            orderBy = { createdAt: "desc" };
        }

        const [prompts, total] = await Promise.all([
            prisma.prompt.findMany({
                where,
                include: {
                    author: { select: { id: true, name: true, image: true } },
                    _count: { select: { upvotes: true, bookmarks: true, comments: true } },
                },
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.prompt.count({ where }),
        ]);

        return {
            prompts,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    },
    ['prompts-feed'], // Cache key
    { revalidate: 60, tags: ['prompts'] } // Revalidate every 60 seconds
);

export const getPrompts = cache(async (params: GetPromptsParams) => {
    return getCachedPrompts(params);
});

export const getUserInteractionState = cache(async (userId: string | null | undefined, promptIds: string[]) => {
    if (!userId || promptIds.length === 0) {
        return { upvotedIds: new Set<string>(), bookmarkedIds: new Set<string>() };
    }

    const [upvotes, bookmarks] = await Promise.all([
        prisma.upvote.findMany({
            where: { userId, promptId: { in: promptIds } },
            select: { promptId: true }
        }),
        prisma.bookmark.findMany({
            where: { userId, promptId: { in: promptIds } },
            select: { promptId: true }
        })
    ]);

    return {
        upvotedIds: new Set(upvotes.map(u => u.promptId)),
        bookmarkedIds: new Set(bookmarks.map(b => b.promptId))
    };
});

export const getUserPrompts = cache(async (userId: string) => {
    if (!userId) return [];

    return prisma.prompt.findMany({
        where: { authorId: userId },
        include: {
            author: { select: { id: true, name: true, image: true } },
            _count: { select: { upvotes: true, bookmarks: true, comments: true } },
            upvotes: { where: { userId }, select: { userId: true } },
            bookmarks: { where: { userId }, select: { userId: true } },
        },
        orderBy: { createdAt: "desc" },
    });
});

export const getUserBookmarks = cache(async (userId: string) => {
    if (!userId) return [];

    const bookmarks = await prisma.bookmark.findMany({
        where: { userId },
        include: {
            prompt: {
                include: {
                    author: { select: { id: true, name: true, image: true } },
                    upvotes: { where: { userId }, select: { userId: true } },
                    bookmarks: { where: { userId }, select: { userId: true } },
                    _count: { select: { upvotes: true, bookmarks: true, comments: true } },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return bookmarks.map((b) => b.prompt);
});

export const getUserStats = cache(async (userId: string) => {
    if (!userId) return { totalPrompts: 0, totalUpvotes: 0, totalViews: 0, totalCopies: 0 };

    const prompts = await prisma.prompt.findMany({
        where: { authorId: userId },
        select: {
            views: true,
            copyCount: true,
            _count: { select: { upvotes: true } },
        },
    });

    const totalPrompts = prompts.length;
    const totalViews = prompts.reduce((sum, p) => sum + p.views, 0);
    const totalUpvotes = prompts.reduce((sum, p) => sum + p._count.upvotes, 0);
    const totalCopies = prompts.reduce((sum, p) => sum + (p.copyCount || 0), 0);

    return { totalPrompts, totalUpvotes, totalViews, totalCopies };
});

export const getPromptById = cache(async (id: string, userId?: string | null) => {
    if (!id) return null;

    return prisma.prompt.findUnique({
        where: { id },
        include: {
            author: { select: { id: true, name: true, image: true, bio: true } },
            results: true,
            // Fetch interaction state cleanly based on current user
            ...(userId ? {
                upvotes: { where: { userId }, select: { userId: true } },
                bookmarks: { where: { userId }, select: { userId: true } },
            } : {
                upvotes: { take: 0, select: { userId: true } },
                bookmarks: { take: 0, select: { userId: true } },
            }),
            comments: {
                include: {
                    user: { select: { id: true, name: true, image: true } },
                },
                orderBy: { createdAt: "desc" },
            },
            _count: { select: { upvotes: true, bookmarks: true, comments: true } },
        },
    });
});

export async function incrementViews(id: string) {
    if (!id) return;
    return prisma.prompt.update({
        where: { id },
        data: { views: { increment: 1 } },
        select: { id: true },
    });
}
