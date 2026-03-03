'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { useVideoStore } from '@/store/videoStore';
import { useSidebarStore } from '@/store/sidebarStore';
import { Spinner } from '@/components/common/Spinner';
import VideoPlayer from '@/components/Video/VideoPlayer';
import VideoMeta from '@/components/Video/VideoMeta';
import VideoProgressBar from '@/components/Video/VideoProgressBar';
import { Lock } from 'lucide-react';

export default function VideoPage({ params }: { params: { subjectId: string; videoId: string } }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startPosition, setStartPosition] = useState(0);

    const {
        currentVideo,
        setCurrentVideo,
        setNavigation,
        setLocked,
        locked,
        nextVideoId
    } = useVideoStore();

    const { markVideoCompleted } = useSidebarStore();
    const router = useRouter();

    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                setLoading(true);
                // Fetch Video Details
                const videoRes = await apiClient.get(`/videos/${params.videoId}`);
                const videoData = videoRes.data.video;

                setCurrentVideo(videoData);
                setNavigation(videoRes.data.previous_video_id, videoRes.data.next_video_id);

                // Fetch specific progress for this video
                try {
                    const progRes = await apiClient.get(`/progress/videos/${params.videoId}`);
                    if (progRes.data && progRes.data.last_position_seconds) {
                        setStartPosition(progRes.data.last_position_seconds);
                    }
                    if (progRes.data.is_locked) {
                        setLocked(true);
                    } else {
                        setLocked(false);
                    }
                } catch (e) {
                    // Progress fetch might fail if not started, default to unlocked if not locked by API
                    setLocked(videoData.is_locked || false);
                }

            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load video');
            } finally {
                setLoading(false);
            }
        };

        fetchVideoData();

        return () => {
            // Clean up current video on unmount
            setCurrentVideo(null);
        };
    }, [params.videoId, setCurrentVideo, setNavigation, setLocked]);

    const handleVideoCompletion = () => {
        markVideoCompleted(params.videoId);
        if (nextVideoId) {
            router.push(`/subjects/${params.subjectId}/video/${nextVideoId}`);
        } else {
            // Course completed or section completed
            alert("Congratulations! You have completed this section.");
        }
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (error || !currentVideo) {
        return (
            <div className="p-8 text-center text-red-500">
                <p>{error || 'Video not found'}</p>
            </div>
        );
    }

    if (locked) {
        return (
            <div className="flex flex-col h-[60vh] items-center justify-center bg-gray-100 p-8 text-center rounded-2xl m-6 border border-gray-200 shadow-inner">
                <div className="bg-white p-6 rounded-full shadow-md mb-6">
                    <Lock className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Video Locked</h2>
                <p className="text-gray-500 mt-3 max-w-md">
                    Please complete the previous videos in this section to unlock this content.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video w-full relative group">
                <VideoPlayer
                    videoId={currentVideo.id}
                    youtubeId={currentVideo.youtube_id}
                    startPosition={startPosition}
                    onCompleted={handleVideoCompletion}
                />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <VideoProgressBar videoId={currentVideo.id} />
                <div className="mt-6">
                    <VideoMeta subjectId={params.subjectId} />
                </div>
            </div>
        </div>
    );
}
