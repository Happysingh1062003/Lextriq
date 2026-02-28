import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;

        const [totalPrompts, totalUpvotes, totalViews] = await Promise.all([
            prisma.prompt.count({ where: { authorId: userId } }),
            prisma.upvote.count({
                where: { prompt: { authorId: userId } },
            }),
            prisma.prompt
                .aggregate({
                    where: { authorId: userId },
                    _sum: { views: true },
                })
                .then((r: any) => r._sum.views || 0),
        ]);

        return NextResponse.json({ totalPrompts, totalUpvotes, totalViews });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
