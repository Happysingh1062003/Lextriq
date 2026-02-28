import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
    email: z.string().email("Invalid email"),
});

export async function POST(req: Request) {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            return NextResponse.json(
                { error: "Email service not configured. Add SMTP_USER and SMTP_PASS to .env" },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { email } = schema.parse(body);

        // Check if email already registered
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already in use" },
                { status: 409 }
            );
        }

        // Rate limit: check if OTP was sent in the last 60 seconds
        const recentOtp = await prisma.emailOtp.findFirst({
            where: {
                email,
                createdAt: { gt: new Date(Date.now() - 60 * 1000) },
            },
        });

        if (recentOtp) {
            return NextResponse.json(
                { error: "Please wait 60 seconds before requesting a new code" },
                { status: 429 }
            );
        }

        // Clean up expired/old OTPs for this email to prevent DB bloat
        await prisma.emailOtp.deleteMany({
            where: {
                email,
                OR: [
                    { expires: { lt: new Date() } },
                    { used: true },
                ],
            },
        });

        // Generate 6-digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP (expires in 10 minutes)
        await prisma.emailOtp.create({
            data: {
                email,
                code,
                expires: new Date(Date.now() + 10 * 60 * 1000),
            },
        });

        // Send email — DO NOT swallow errors, propagate to client
        try {
            await sendOtpEmail(email, code);
        } catch (emailErr) {
            console.error("[OTP] Email send failed:", emailErr);
            return NextResponse.json(
                { error: "Failed to send verification email. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: "OTP sent" }, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            );
        }

        console.error("[OTP] Send error:", error);
        return NextResponse.json(
            { error: "Failed to send verification code" },
            { status: 500 }
        );
    }
}
