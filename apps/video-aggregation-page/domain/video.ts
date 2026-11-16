export type Video = {
    id: number;
    title: string;
    description?: string;
    duration: number;
    post_date: string;
    viewCount: number;
    youtubeUrl: string;
    patreonUrl: string;
    thumbnailUrl: string;
    subtitle: boolean;
    voice: boolean;
    // tags: string[];
};

export type VideoRow = {
    id: number;
    title: string;
    description?: string;
    duration: number;
    post_date: string;
    view_count: number;
    youtube_url: string;
    patreon_url: string;
    thumbnail_url: string;
    subtitle: boolean;
    voice: boolean;
    // tags: string[];
};

export type NewVideo = {
    title: string;
    description?: string;
    duration: number;
    post_date: string;
    viewCount: number;
    youtubeUrl: string;
    patreonUrl: string;
    thumbnailUrl: string;
    subtitle: boolean;
    voice: boolean;
    // tags: string[];
};