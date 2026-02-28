import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://lextriq.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/dashboard/settings", "/dashboard/my-prompts", "/dashboard/saved", "/dashboard/upload"],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
