import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.prompt.update({
            where: { id },
            data: { copyCount: { increment: 1 } },
        });

        revalidateTag("prompts", {});

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to track copy" },
            { status: 500 }
        );
    }
}
