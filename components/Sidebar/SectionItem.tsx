'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, PlayCircle, Lock, CheckCircle } from 'lucide-react';
import { Section, useSidebarStore } from '@/store/sidebarStore';
import { useVideoStore } from '@/store/videoStore';
import { twMerge } from 'tailwind-merge';

interface SectionItemProps {
    section: Section;
    subjectId: string;
}

export default function SectionItem({ section, subjectId }: SectionItemProps) {
    const [isOpen, setIsOpen] = useState(true);
    const { isVideoCompleted } = useSidebarStore();
    const { currentVideo } = useVideoStore();

    // Ensure videos is an iterable array
    const safeVideos = Array.isArray(section?.videos) ? section.videos : [];
    // Sort videos by order_index
    const sortedVideos = [...safeVideos].sort((a: any, b: any) => a.order_index - b.order_index);

    return (
        <div className="border-b border-gray-100 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center text-left">
                    <span className="font-semibold text-gray-900 text-sm">{section.title}</span>
                </div>
                {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0 ml-2" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0 ml-2" />
                )}
            </button>

            {isOpen && (
                <div className="bg-white">
                    {Array.isArray(sortedVideos) && sortedVideos.map((video: any) => {
                        const isCompleted = isVideoCompleted(video.id);
                        const isCurrent = currentVideo?.id === video.id;
                        const isLocked = video.is_locked;

                        const content = (
                            <div
                                className={twMerge(
                                    'flex items-start p-3 pl-6 transition-colors',
                                    isCurrent ? 'bg-blue-50 border-l-4 border-blue-600 pl-5' : 'border-l-4 border-transparent hover:bg-gray-50',
                                    isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                                )}
                            >
                                <div className="flex-shrink-0 mt-0.5">
                                    {isCompleted ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : isLocked ? (
                                        <Lock className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <PlayCircle className={twMerge('h-4 w-4', isCurrent ? 'text-blue-600' : 'text-gray-400')} />
                                    )}
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className={twMerge(
                                        "text-sm font-medium leading-tight",
                                        isCurrent ? "text-blue-700" : "text-gray-700",
                                        isLocked && "text-gray-500"
                                    )}>
                                        {video.title}
                                    </p>
                                </div>
                            </div>
                        );

                        if (isLocked) {
                            return <div key={video.id}>{content}</div>;
                        }

                        return (
                            <Link key={video.id} href={`/subjects/${subjectId}/video/${video.id}`} className="block">
                                {content}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
