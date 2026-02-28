import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
    email: z.string().email(),
    code: z.string().length(6, "Code must be 6 digits"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, code } = schema.parse(body);

        // Find the most recent unused OTP for this email
        const otp = await prisma.emailOtp.findFirst({
            where: {
                email,
                code,
                used: false,
                expires: { gt: new Date() },
            },
            orderBy: { createdAt: "desc" },
        });

        if (!otp) {
            return NextResponse.json(
                { error: "Invalid or expired code" },
                { status: 400 }
            );
        }

        // Mark as used
        await prisma.emailOtp.update({
            where: { id: otp.id },
            data: { used: true },
        });

        return NextResponse.json(
            { verified: true },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            );
        }

        console.error("[OTP-VERIFY] Error:", error);
        return NextResponse.json(
            { error: "Verification failed" },
            { status: 500 }
        );
    }
}
