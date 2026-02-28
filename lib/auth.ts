import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const providers: any[] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    );
}

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    providers.push(
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        })
    );
}

providers.push(
    CredentialsProvider({
        name: "credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
                return null;
            }

            const user = await prisma.user.findUnique({
                where: { email: credentials.email as string },
            });

            if (!user || !user.password) {
                return null;
            }

            const isPasswordValid = await bcrypt.compare(
                credentials.password as string,
                user.password
            );

            if (!isPasswordValid) {
                return null;
            }

            return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                role: user.role,
            };
        },
    })
);

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma) as any,
    providers,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user, trigger, session: updateData }) {
            if (user) {
                token.id = user.id!;
                token.role = user.role;
                token.image = user.image;
            }
            // When session is updated (e.g. after avatar change)
            if (trigger === "update" && updateData) {
                if (updateData.image !== undefined) token.image = updateData.image;
                if (updateData.name !== undefined) token.name = updateData.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.image = (token.image as string) ?? null;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        newUser: "/signup",
    },
    secret: process.env.NEXTAUTH_SECRET,
});
