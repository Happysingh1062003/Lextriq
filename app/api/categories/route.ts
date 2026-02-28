import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const categories = await prisma.prompt.groupBy({
            by: ["category"],
            _count: true,
            where: { published: true },
            orderBy: { _count: { category: "desc" } },
        });

        return NextResponse.json(categories);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}
