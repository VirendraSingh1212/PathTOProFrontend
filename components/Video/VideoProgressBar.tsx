'use client';

import { useEffect, useState } from 'react';
import { useVideoStore } from '@/store/videoStore';

export default function VideoProgressBar({ videoId }: { videoId: string }) {
    const { currentTime, duration } = useVideoStore();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (duration > 0) {
            const percentage = (currentTime / duration) * 100;
            setProgress(Math.min(Math.max(percentage, 0), 100));
        }
    }, [currentTime, duration]);

    return (
        <div className="w-full">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">
                <span>Video Progress</span>
                <span>{Math.round(progress)}% Completed</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200 shadow-inner">
                <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
