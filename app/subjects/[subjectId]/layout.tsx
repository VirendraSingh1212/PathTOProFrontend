'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSidebarStore } from '@/store/sidebarStore';
import apiClient from '@/lib/apiClient';
import SubjectSidebar from '@/components/Sidebar/SubjectSidebar';
import { Spinner } from '@/components/common/Spinner';
import AuthGuard from '@/components/Auth/AuthGuard';
import AuthInitializer from '@/components/AuthInitializer';
import { BookOpen } from 'lucide-react';

export default function SubjectLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { subjectId: string };
}) {
    const { setSubjectTree, setLoading, setError, loading, error, initializeCompletedVideos } = useSidebarStore();
    const [hasContent, setHasContent] = useState(false);

    useEffect(() => {
        const fetchTree = async () => {
            try {
                setLoading(true);
                setError(null);
                // Load the subject tree: Sections -> Videos
                const treeRes = await apiClient.get(`/subjects/${params.subjectId}/tree`);
                
                // Check if we got valid data with sections/videos
                const hasSections = treeRes.data && 
                    (Array.isArray(treeRes.data.sections) || Array.isArray(treeRes.data));
                
                setHasContent(hasSections);
                setSubjectTree(treeRes.data);

                // Also load completed progress for this subject if available
                try {
                    const progRes = await apiClient.get(`/progress/subjects/${params.subjectId}`);
                    initializeCompletedVideos(progRes.data.completed_video_ids || []);
                } catch (e) {
                    console.error("Progress not loaded", e);
                }
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    // If 404 or no content, don't show error - just set empty state
                    if (err.response?.status === 404) {
                        setHasContent(false);
                        setSubjectTree([]);
                    } else {
                        setError(err.response?.data?.message || 'Failed to load subject content');
                    }
                } else {
                    setError('An unexpected error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTree();
    }, [params.subjectId, setSubjectTree, setLoading, setError, initializeCompletedVideos]);

    return (
        <AuthInitializer>
            <AuthGuard>
                <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
                    <aside className="w-80 flex-shrink-0 border-r bg-white h-full overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <Spinner />
                            </div>
                        ) : error ? (
                            <div className="p-4 text-red-500">{error}</div>
                        ) : !hasContent ? (
                            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-700">Content Coming Soon</h3>
                                <p className="text-sm text-gray-500 mt-2 max-w-xs">
                                    Lessons for this subject have not been added yet. Check back later!
                                </p>
                            </div>
                        ) : (
                            <SubjectSidebar subjectId={params.subjectId} />
                        )}
                    </aside>
                    <main className="flex-1 overflow-y-auto bg-gray-50 relative">
                        {!hasContent && !loading && !error ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                <BookOpen className="h-24 w-24 text-gray-300 mb-6" />
                                <h2 className="text-2xl font-semibold text-gray-700">Content Coming Soon</h2>
                                <p className="text-gray-500 mt-3 text-center max-w-md px-4">
                                    This subject exists but lessons haven&apos;t been added yet. 
                                    We&apos;re working on creating quality content for you!
                                </p>
                            </div>
                        ) : (
                            children
                        )}
                    </main>
                </div>
            </AuthGuard>
        </AuthInitializer>
    );
}