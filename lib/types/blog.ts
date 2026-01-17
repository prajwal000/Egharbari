export interface BlogData {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    author: {
        _id: string;
        name: string;
        email: string;
    };
    category: string;
    tags: string[];
    isPublished: boolean;
    views: number;
    createdAt: string;
    updatedAt: string;
}

export const BLOG_CATEGORIES = [
    'Real Estate News',
    'Property Tips',
    'Market Trends',
    'Legal Guide',
    'Investment',
    'Home Improvement',
] as const;








