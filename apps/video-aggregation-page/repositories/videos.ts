import { supabase } from "@/lib/supabase/client";
import { unwrap } from "@/lib/errors";
import type { Video, VideoRow, NewVideo } from "@/domain/video";

export async function fetchVideos(): Promise<Video[]>{
    const rows = unwrap(await supabase
        .from("videos")
        .select("id, title, description, duration, view_count, youtube_url, patreon_url, thumbnail_url, subtitle, voice")
        // .rpc("fetch_videos")
    ) as VideoRow[];
    return rows.map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        duration: row.duration,
        post_date: row.post_date,
        viewCount: row.view_count,
        youtubeUrl: row.youtube_url,
        patreonUrl: row.patreon_url,
        thumbnailUrl: row.thumbnail_url,
        subtitle: row.subtitle,
        voice: row.voice
    }));
}


export async function addVideo(input: NewVideo): Promise<number> {
    return unwrap(
        await supabase
            .rpc("add_video", {
                title: input.title,
                description: input.description,
                duration: input.duration,
                post_date: input.post_date,
                view_count: input.viewCount,
                youtube_url: input.youtubeUrl,
                patreon_url: input.patreonUrl,
                thumbnail_url: input.thumbnailUrl,
                subtitle: input.subtitle,
                voice: input.voice
            })
    );
}