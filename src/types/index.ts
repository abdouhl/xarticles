{/*export interface Tool {
    title: string;
    body: string;
    tag?: string;
    url: string;
    "date-added": string;
    slug?: string;
}

export interface Category {
    category: string;
    title: string;
    content: Tool[];
}

export interface ToolsConfig {
    tools: Category[];
}

export interface MetadataEntry {
    slug: string;
    title?: string | undefined;
    description?: string | undefined;
    ogImage?: string | undefined;
    twitterHandle?: string | undefined;
    githubUrl?: string | undefined;
}

export type MetadataMap = Record<string, MetadataEntry>;

export type SlugMap = Record<string, string[]>;*/}
export interface Article {
    title: string;
    preview_text: string;
    original_img_url?: string;
    id_str: string;
    screen_name: string;
    "date-added": string;
    slug?: string;
}

export interface Category {
    category: string;
    title: string;
    content: Article[];
}

export interface ArticlesConfig {
    articles: Category[];
}

export interface MetadataEntry {
    slug: string;
    title?: string | undefined;
    description?: string | undefined;
    ogImage?: string | undefined;
    twitterHandle?: string | undefined;
    githubUrl?: string | undefined;
}

export type MetadataMap = Record<string, MetadataEntry>;

export type SlugMap = Record<string, string[]>;
