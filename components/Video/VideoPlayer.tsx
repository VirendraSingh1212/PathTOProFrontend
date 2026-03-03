'use client';

import { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeEvent, YouTubeProps } from 'react-youtube';
import { useVideoStore } from '@/store/videoStore';
import { saveProgressDebounced, saveProgressNow } from '@/lib/progress';

interface VideoPlayerProps {
    videoId: string;
    youtubeId: string;
    startPosition: number;
    onCompleted: () => void;
}

export default function VideoPlayer({ videoId, youtubeId, startPosition, onCompleted }: VideoPlayerProps) {
    const { updateProgress, setPlaying } = useVideoStore();
    const playerRef = useRef<any>(null);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);
    const [isReady, setIsReady] = useState(false);

    const onReady: YouTubeProps['onReady'] = (event: YouTubeEvent) => {
        playerRef.current = event.target;
        setIsReady(true);
        if (startPosition > 0) {
            event.target.seekTo(startPosition, true);
        }
    };

    const onStateChange: YouTubeProps['onStateChange'] = (event: YouTubeEvent) => {
        // 1 = playing, 2 = paused, 0 = ended
        if (event.data === 1) {
            setPlaying(true);
            // Start tracking progress
            progressInterval.current = setInterval(async () => {
                if (playerRef.current) {
                    const currentTime = await playerRef.current.getCurrentTime();
                    updateProgress(currentTime);
                    saveProgressDebounced(videoId, currentTime, false);
                }
            }, 1000);
        } else {
            setPlaying(false);
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }

            if (event.data === 2) {
                // Paused, save progress immediately
                if (playerRef.current) {
                    const currentTime = playerRef.current.getCurrentTime();
                    saveProgressNow(videoId, currentTime, false);
                }
            } else if (event.data === 0) {
                // Ended
                if (playerRef.current) {
                    const duration = playerRef.current.getDuration();
                    updateProgress(duration);
                    saveProgressNow(videoId, duration, true).then(() => {
                        onCompleted();
                    });
                }
            }
        }
    };

    useEffect(() => {
        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
        };
    }, []);

    return (
        <div className="w-full h-full relative">
            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white z-10">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <span>Loading player...</span>
                    </div>
                </div>
            )}
            <YouTube
                videoId={youtubeId}
                className="w-full h-full absolute inset-0"
                iframeClassName="w-full h-full"
                opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: {
                        autoplay: 1,
                        modestbranding: 1,
                        rel: 0,
                        showinfo: 0,
                    },
                }}
                onReady={onReady}
                onStateChange={onStateChange}
            />
        </div>
    );
}
