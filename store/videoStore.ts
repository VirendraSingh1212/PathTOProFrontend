import { create } from 'zustand';

export interface Video {
    id: string;
    title: string;
    description: string;
    youtube_id: string;
    duration_seconds: number;
}

interface VideoState {
    currentVideo: Video | null;
    duration: number;
    currentTime: number;
    isPlaying: boolean;
    previousVideoId: string | null;
    nextVideoId: string | null;
    locked: boolean;
    setCurrentVideo: (video: Video | null) => void;
    updateProgress: (time: number) => void;
    setNavigation: (prev: string | null, next: string | null) => void;
    setLocked: (locked: boolean) => void;
    setPlaying: (playing: boolean) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
    currentVideo: null,
    duration: 0,
    currentTime: 0,
    isPlaying: false,
    previousVideoId: null,
    nextVideoId: null,
    locked: false,
    setCurrentVideo: (video) => set({ currentVideo: video, duration: video?.duration_seconds || 0 }),
    updateProgress: (currentTime) => set({ currentTime }),
    setNavigation: (previousVideoId, nextVideoId) => set({ previousVideoId, nextVideoId }),
    setLocked: (locked) => set({ locked }),
    setPlaying: (isPlaying) => set({ isPlaying }),
}));
