"use client"
import { useVideos } from "@/hooks/useVideos";
import VideoRow from "@/components/video/VideoRow";

export default function VideoList() {
    const videos = useVideos()
    const videosList = videos.data ?? [];
    console.log("videosList", videosList);
    return (
        <div>
            {videosList.map((video) => (
                <VideoRow key={video.id} video={video} />
            ))}
        </div>
    );
}