'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/apiClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common/Spinner';
import { UserCircle, LogOut, BookOpen, Clock } from 'lucide-react';

interface ProfileStats {
    completed_videos: number;
    total_videos: number;
    last_watched?: {
        title: string;
        subject_id: string;
        video_id: string;
    };
}

export default function ProfilePage() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ProfileStats | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                // Attempt to fetch profile stats
                const res = await apiClient.get('/profile/stats');
                setStats(res.data);
            } catch (err: unknown) {
                console.error('Failed to load profile stats', err);
                // Fallback or empty stats
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/auth/login');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Profile</h1>
                    <p className="text-gray-500 mt-2">Manage your account and track your progress.</p>
                </div>
                <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 shadow-sm border-gray-100 bg-white/70 backdrop-blur-md">
                    <CardHeader className="text-center pb-2">
                        <UserCircle className="h-24 w-24 text-gray-300 mx-auto" />
                        <CardTitle className="mt-4 text-xl">{user?.name || 'Student'}</CardTitle>
                        <CardDescription>{user?.email || 'student@example.com'}</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="md:col-span-2 shadow-sm border-gray-100 bg-white/70 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle>Learning Statistics</CardTitle>
                        <CardDescription>Your overall progress across all subjects</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center">
                                    <span className="text-3xl font-bold text-blue-700">{stats.completed_videos || 0}</span>
                                    <span className="text-sm font-medium text-blue-600 mt-1">Completed Videos</span>
                                </div>
                                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col items-center justify-center text-center">
                                    <span className="text-3xl font-bold text-green-700">{stats.total_videos ? Math.round((stats.completed_videos / stats.total_videos) * 100) : 0}%</span>
                                    <span className="text-sm font-medium text-green-600 mt-1">Overall Progress</span>
                                </div>
                                {stats.last_watched && (
                                    <div className="col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200 mt-2 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Clock className="h-5 w-5 text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Last Watched</p>
                                                <p className="text-xs text-gray-500">{stats.last_watched?.title}</p>
                                            </div>
                                        </div>
                                        <Button variant="link" onClick={() => router.push(`/subjects/${stats.last_watched?.subject_id}/video/${stats.last_watched?.video_id}`)}>
                                            Resume
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <BookOpen className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium text-sm">No statistics available yet.</p>
                                <p className="text-gray-400 text-xs mt-1">Start watching videos to see your progress here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
