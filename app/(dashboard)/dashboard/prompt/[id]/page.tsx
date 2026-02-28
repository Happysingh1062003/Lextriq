import { Metadata } from 'next';
import { getPromptById, incrementViews } from '@/lib/queries';
import { PromptDetailClient } from '@/components/PromptDetailClient';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata(
    { params }: PageProps
): Promise<Metadata> {
    const { id } = await params;
    const prompt = await getPromptById(id);

    if (!prompt) {
        return {
            title: 'Prompt Not Found',
            description: 'This prompt could not be found or has been deleted.'
        };
    }

    const title = `${prompt.title} | Lextriq`;
    const description = prompt.description || prompt.content.slice(0, 160) + '...';

    // Create rich meta tags
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            url: `https://lextriq.com/dashboard/prompt/${id}`,
            siteName: 'Lextriq',
            publishedTime: prompt.createdAt.toISOString(),
            authors: [prompt.author.name || 'Anonymous'],
            images: [
                {
                    url: `https://lextriq.com/api/og?title=${encodeURIComponent(prompt.title)}&category=${encodeURIComponent(prompt.category)}&author=${encodeURIComponent(prompt.author.name || 'Anonymous')}&upvotes=${prompt._count.upvotes}`,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

export default async function PromptDetailPageServer({
    params,
}: PageProps) {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id;

    // Server fetch Data right here
    const prompt = await getPromptById(id, userId);

    if (!prompt) {
        notFound();
    }

    // Increment views separately — only here, not in generateMetadata
    incrementViews(id);

    // JSON-LD structured data for SEO rich snippets
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: prompt.title,
        author: {
            "@type": "Person",
            name: prompt.author.name || "Anonymous",
        },
        datePublished: prompt.createdAt.toISOString(),
        dateModified: prompt.updatedAt.toISOString(),
        description: prompt.description || prompt.content.slice(0, 160),
        interactionStatistic: [
            {
                "@type": "InteractionCounter",
                interactionType: "https://schema.org/LikeAction",
                userInteractionCount: prompt._count.upvotes,
            },
            {
                "@type": "InteractionCounter",
                interactionType: "https://schema.org/CommentAction",
                userInteractionCount: prompt._count.comments,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PromptDetailClient prompt={prompt} />
        </>
    );
}
