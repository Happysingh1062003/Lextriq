import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const prompts = await prisma.prompt.findMany({
            where: { authorId: (session.user as any).id },
            include: {
                author: { select: { id: true, name: true, image: true } },
                _count: { select: { upvotes: true, bookmarks: true, comments: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(prompts);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch prompts" },
            { status: 500 }
        );
    }
}
