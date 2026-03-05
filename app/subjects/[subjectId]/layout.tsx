'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useSidebarStore } from '@/store/sidebarStore';
import apiClient from '@/lib/apiClient';
import SubjectSidebar from '@/components/Sidebar/SubjectSidebar';
import { Spinner } from '@/components/common/Spinner';
import AuthGuard from '@/components/Auth/AuthGuard';
import AuthInitializer from '@/components/AuthInitializer';

export default function SubjectLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { subjectId: string };
}) {
    const { setSubjectTree, setLoading, setError, loading, error, initializeCompletedVideos } = useSidebarStore();

    useEffect(() => {
        const fetchTree = async () => {
            try {
                setLoading(true);
                setError(null);
                // Load the subject tree: Sections -> Videos
                const treeRes = await apiClient.get(`/subjects/${params.subjectId}/tree`);
                
                console.log('Subject tree response:', treeRes.data);
                
                // Store the tree data in the store for sidebar to use
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
                    console.error('Failed to load subject tree:', err.response?.status, err.response?.data);
                    // If 404 or no content, don't show error - just set empty state
                    if (err.response?.status === 404) {
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
                        ) : (
                            <SubjectSidebar subjectId={params.subjectId} />
                        )}
                    </aside>
                    <main className="flex-1 overflow-y-auto bg-gray-50 relative">
                        {children}
                    </main>
                </div>
            </AuthGuard>
        </AuthInitializer>
    );
}
