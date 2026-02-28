import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = signupSchema.parse(body);

        // Check email was verified via OTP
        const verifiedOtp = await prisma.emailOtp.findFirst({
            where: {
                email,
                used: true,
                expires: { gt: new Date(Date.now() - 15 * 60 * 1000) },
            },
            orderBy: { createdAt: "desc" },
        });

        if (!verifiedOtp) {
            return NextResponse.json(
                { error: "Email not verified. Please verify your email first." },
                { status: 403 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already in use" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                emailVerified: new Date(),
            },
        });

        // Clean up OTPs for this email
        await prisma.emailOtp.deleteMany({
            where: { email },
        });

        console.log(`[SIGNUP] User created: ${user.email}`);

        return NextResponse.json(
            { user: { id: user.id, name: user.name, email: user.email } },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            );
        }

        console.error("[SIGNUP] Error:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
