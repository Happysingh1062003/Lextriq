import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const bookmarks = await prisma.bookmark.findMany({
            where: { userId: (session.user as any).id },
            include: {
                prompt: {
                    include: {
                        author: { select: { id: true, name: true, image: true } },
                        upvotes: { where: { userId: (session.user as any).id }, select: { userId: true } },
                        bookmarks: { where: { userId: (session.user as any).id }, select: { userId: true } },
                        _count: { select: { upvotes: true, bookmarks: true, comments: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(bookmarks.map((b: any) => b.prompt));
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch bookmarks" },
            { status: 500 }
        );
    }
}
