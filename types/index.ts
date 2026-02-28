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
    "GPT-4o",
    "GPT-4o Mini",
    "GPT-4 Turbo",
    "o1",
    "o1 Mini",
    "o3 Mini",
    "ChatGPT",
    "DALL-E 3",
    "Sora",
    // Anthropic
    "Claude Sonnet 4.6",
    "Claude Sonnet 4.5",
    "Claude Haiku 4.5",
    "Claude 3.5 Sonnet",
    "Claude 3.5 Haiku",
    "Claude 3 Opus",
    "Claude",
    // Google
    "Gemini 2.5 Pro",
    "Gemini 2.5 Flash",
    "Gemini 2.0 Flash",
    "Gemini 1.5 Pro",
    "Gemini 1.5 Flash",
    "Gemini",
    // xAI
    "Grok 3",
    "Grok 2",
    // Meta
    "Llama 3.1",
    "Llama 3",
    // DeepSeek
    "DeepSeek R1",
    "DeepSeek V3",
    "DeepSeek Coder",
    // Mistral
    "Mistral Large",
    "Mistral Medium",
    "Mistral",
    // Coding Tools
    "GitHub Copilot",
    "Cursor",
    "Codeium",
    "Windsurf",
    "Tabnine",
    // Image Generation
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
    "Pika",
    "Kling",
    "Veo 2",
    // Search & Research
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
