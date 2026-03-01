export interface PromptWithRelations {
    id: string;
    title: string;
    content: string;
    description: string | null;
    category: string;
    aiTool: string[];
    tags: string[];
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    views: number;
    copyCount: number;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    author: {
        id: string;
        name: string | null;
        image: string | null;
        bio?: string | null;
    };
    results: ResultType[];
    _count: {
        upvotes: number;
        bookmarks: number;
        comments: number;
    };
    upvotes?: { userId: string }[];
    bookmarks?: { userId: string }[];
}

export interface ResultType {
    id: string;
    type: string;
    url: string | null;
    content: string | null;
}

export interface CommentWithUser {
    id: string;
    content: string;
    createdAt: string;
    userId: string;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

export interface UserProfile {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    bio: string | null;
    role: "USER" | "ADMIN";
    createdAt: string;
}

export interface UserStats {
    totalPrompts: number;
    totalUpvotes: number;
    totalViews: number;
    totalCopies: number;
}

export interface CategoryCount {
    category: string;
    _count: number;
}

export const CATEGORIES = [
    "Coding",
    "Developing",
    "Debugging",
    "UI/UX",
    "Designing",
    "Creative",
    "Writing",
    "Marketing",
    "Data Analysis",
    "Education",
    "Business",
    "Productivity",
    "Other",
] as const;

export const AI_TOOLS = [
    // OpenAI
    "GPT-5",
    "GPT-4.5",
    "GPT-4o",
    "GPT-4o Mini",
    "GPT-4 Turbo",
    "o3",
    "o3 Mini",
    "o1",
    "o1 Mini",
    "ChatGPT",
    "DALL-E 3",
    "Sora",
    // Anthropic
    "Claude Opus 4.6",
    "Claude Sonnet 4.6",
    "Claude Sonnet 4.5",
    "Claude Haiku 4.5",
    "Claude 4 Opus",
    "Claude 3.5 Sonnet",
    "Claude 3.5 Haiku",
    "Claude 3 Opus",
    "Claude",
    // Google
    "Gemini 2.5 Pro",
    "Gemini 2.5 Flash",
    "Gemini 2.0 Pro",
    "Gemini 2.0 Flash",
    "Gemini 1.5 Pro",
    "Gemini 1.5 Flash",
    "Gemini",
    // xAI
    "Grok 3",
    "Grok 2",
    // Meta
    "Llama 4",
    "Llama 3.1",
    "Llama 3",
    // DeepSeek & Chinese Models
    "DeepSeek R1",
    "DeepSeek V3",
    "DeepSeek Coder",
    "Qwen 3",
    "Qwen 2.5 Max",
    "Qwen 2.5",
    // Mistral
    "Mistral Large",
    "Mistral Medium",
    "Pixtral",
    "Mistral",
    // Coding Tools
    "GitHub Copilot",
    "Cursor",
    "Codeium",
    "Windsurf",
    "Tabnine",
    // Image Generation
    "Midjourney v7",
    "Midjourney v6",
    "Midjourney",
    "Stable Diffusion 3",
    "Stable Diffusion",
    "Leonardo AI",
    "Ideogram",
    "Flux",
    "Adobe Firefly",
    // Video Generation
    "Runway Gen-3",
    "Luma Dream Machine",
    "Kling",
    "Hailuo",
    "Pika",
    "Veo 2",
    // Audio Generation
    "ElevenLabs",
    "Suno",
    "Udio",
    // Search & Research
    "SearchGPT",
    "Perplexity",
    "Cohere",
    // Other
    "Other",
] as const;

export const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export const SORT_OPTIONS = [
    { value: "trending", label: "Trending" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "upvotes", label: "Most Upvoted" },
    { value: "saved", label: "Most Saved" },
    { value: "views", label: "Most Viewed" },
    { value: "copies", label: "Most Copied" },
] as const;
