import { create } from 'zustand';

export interface Section {
    id: string;
    title: string;
    order_index: number;
    videos: SidebarVideo[];
}

export interface SidebarVideo {
    id: string;
    title: string;
    order_index: number;
    is_locked: boolean;
    is_completed: boolean;
}

interface SidebarState {
    subjectTree: Section[];
    loading: boolean;
    error: string | null;
    completedVideos: Set<string>;
    setSubjectTree: (tree: Section[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    markVideoCompleted: (videoId: string) => void;
    isVideoCompleted: (videoId: string) => boolean;
    initializeCompletedVideos: (completedIds: string[]) => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
    subjectTree: [],
    loading: false,
    error: null,
    completedVideos: new Set(),
    setSubjectTree: (tree) => set({ subjectTree: tree }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    markVideoCompleted: (videoId) => {
        set((state) => {
            const newSet = new Set(state.completedVideos);
            newSet.add(videoId);
            return { completedVideos: newSet };
        });
    },
    isVideoCompleted: (videoId) => get().completedVideos.has(videoId),
    initializeCompletedVideos: (completedIds) => set({ completedVideos: new Set(completedIds) }),
}));
