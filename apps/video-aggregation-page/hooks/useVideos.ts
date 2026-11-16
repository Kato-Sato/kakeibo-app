"use client";
import { fetchVideos } from "@/repositories/videos";
import { useAsync } from "./useAsync";

export function useVideos() {
    return useAsync(
        () => fetchVideos(),
        []
    );
}