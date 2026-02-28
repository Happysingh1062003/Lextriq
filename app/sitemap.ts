import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://lextriq.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${BASE_URL}/login`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/signup`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.4,
        },
        {
            url: `${BASE_URL}/dashboard/discover`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
    ];

    // Dynamic prompt pages
    const prompts = await prisma.prompt.findMany({
        where: { published: true },
        select: { id: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 5000,
    });

    const promptPages: MetadataRoute.Sitemap = prompts.map((prompt) => ({
        url: `${BASE_URL}/dashboard/prompt/${prompt.id}`,
        lastModified: prompt.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    return [...staticPages, ...promptPages];
}
