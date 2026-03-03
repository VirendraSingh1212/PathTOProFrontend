'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/common/Spinner';
import { BookOpen, ChevronRight } from 'lucide-react';

interface Subject {
    id: string;
    title: string;
    description: string;
    thumbnail_url?: string;
}

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoading(true);
                const res = await apiClient.get('/subjects');
                setSubjects(res.data);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.message || 'Failed to load subjects');
                } else {
                    setError('An unexpected error occurred');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Subjects</h1>
                <p className="text-gray-500 mt-2">Select a subject to continue learning.</p>
            </div>

            {(!Array.isArray(subjects) || subjects.length === 0) ? (
                <div className="text-center py-12 border rounded-lg bg-white">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No subjects</h3>
                    <p className="mt-1 text-sm text-gray-500">You are not enrolled in any subjects yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(subjects) && subjects.map((subject) => (
                        <Link key={subject.id} href={`/subjects/${subject.id}`}>
                            <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden border border-gray-100 shadow-sm bg-white/70 backdrop-blur-md hover:translate-y-[-2px]">
                                {subject.thumbnail_url && (
                                    <div className="w-full h-40 bg-gray-200 overflow-hidden">
                                        <Image
                                            src={subject.thumbnail_url}
                                            alt={subject.title}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                )}
                                {!subject.thumbnail_url && (
                                    <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                                        <BookOpen className="h-10 w-10 text-blue-200" />
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-xl">{subject.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="line-clamp-2 text-gray-600">
                                        {subject.description}
                                    </CardDescription>
                                    <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                                        Continue Learning
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
