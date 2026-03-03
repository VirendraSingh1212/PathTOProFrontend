'use client';

import { useRouter } from 'next/navigation';
import { useVideoStore } from '@/store/videoStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function VideoMeta({ subjectId }: { subjectId: string }) {
    const { currentVideo, previousVideoId, nextVideoId } = useVideoStore();
    const router = useRouter();

    if (!currentVideo) return null;

    const handleNavigation = (videoId: string) => {
        router.push(`/subjects/${subjectId}/video/${videoId}`);
    };

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{currentVideo.title}</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Duration: {formatDuration(currentVideo.duration_seconds)}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!previousVideoId}
                        onClick={() => previousVideoId && handleNavigation(previousVideoId)}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!nextVideoId}
                        onClick={() => nextVideoId && handleNavigation(nextVideoId)}
                    >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{currentVideo.description}</p>
            </div>
        </div>
    );
}
