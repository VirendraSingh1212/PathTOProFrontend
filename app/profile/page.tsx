'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/common/Spinner';
import {
    UserCircle, LogOut, BookOpen, Clock, PlayCircle, TrendingUp, Award,
    Zap, Target, Star, Trophy, Activity, Camera, Github, Linkedin, Bell,
    ChevronRight, CheckCircle2, Flame, BookMarked
} from 'lucide-react';

// --- MOCK DATA FOR UI OVERHAUL ---
const MOCK_STATS = {
    totalWatchTime: "42 hours",
    lessonsCompleted: 128,
    quizAttempts: 15,
    streak: 5,
};

const MOCK_COURSES = {
    enrolled: 4,
    completed: 1,
    inProgress: 3
};

const MOCK_SKILLS = [
    { name: "React Navigation", level: 85 },
    { name: "Data Structures", level: 60 },
    { name: "UI/UX Design", level: 40 },
    { name: "TypeScript", level: 75 },
];

const MOCK_RECENT_ACTIVITY = [
    { type: "video", title: "Advanced React Context", time: "2 hours ago" },
    { type: "quiz", title: "JavaScript Closures Quiz (90%)", time: "Yesterday" },
    { type: "lesson", title: "Node.js Basics Completed", time: "3 days ago" },
];

const MOCK_BADGES = [
    { title: "First Course", desc: "Completed your first full course", icon: <Trophy className="w-5 h-5" /> },
    { title: "5-Day Streak", desc: "Studied 5 days in a row", icon: <Flame className="w-5 h-5" /> },
    { title: "Quiz Master", desc: "Scored 90%+ on 3 quizzes", icon: <Target className="w-5 h-5" /> },
];

const MOCK_LEADERBOARD = [
    { rank: 1, name: "Alice J.", points: 2450 },
    { rank: 2, name: "David K.", points: 2100 },
    { rank: 3, name: "You", points: 1850 },
    { rank: 4, name: "Sarah W.", points: 1600 },
];

const MOCK_NOTIFICATIONS = [
    { title: "New Course Available", desc: "Fullstack Next.js 14 is now live!", date: "Today" },
    { title: "Upcoming Live Session", desc: "Q&A with Senior Engineers at 5 PM", date: "Tomorrow" },
];

const CSS_ANIMATION = "animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both";

export default function ProfilePage() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating data fetch for UI entrance animations
        const timer = setTimeout(() => {
            setLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/auth/login');
    };

    if (loading) {
        return (
            <div className="flex justify-center flex-col items-center min-h-[60vh] gap-4">
                <Spinner />
                <p className="text-gray-500 font-medium text-sm animate-pulse">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
            {/* Header Section */}
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 ${CSS_ANIMATION}`} style={{ animationDelay: '100ms' }}>
                <div>
                    <h1 className="text-4xl font-extrabold text-black tracking-tight">Your Dashboard</h1>
                    <p className="text-gray-500 mt-2 text-lg">Manage your account, track progress, and achieve your goals.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-gray-200 hover:bg-gray-50 text-black">
                        <Bell className="h-4 w-4 mr-2" />
                        Alerts
                    </Button>
                    <Button variant="outline" onClick={handleLogout} className="text-gray-900 border-gray-200 hover:bg-gray-100 transition-colors">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* --- LEFT COLUMN (Span 4) --- */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Profile Customization */}
                    <Card className={`border-gray-200 shadow-sm ${CSS_ANIMATION}`} style={{ animationDelay: '150ms' }}>
                        <CardContent className="pt-6 pb-6 text-center">
                            <div className="relative inline-block mb-4 group cursor-pointer">
                                <UserCircle className="h-28 w-28 text-gray-200 mx-auto" strokeWidth={1} />
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white h-8 w-8" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-black">{user?.name || 'Virendra Singh'}</h2>
                            <p className="text-gray-500 text-sm mt-1">{user?.email || 'developer@example.com'}</p>

                            <p className="text-sm text-gray-700 mt-4 leading-relaxed font-medium">Aspiring Full-Stack Developer. Passionate about building seamless user experiences.</p>

                            <div className="flex justify-center gap-3 mt-6">
                                <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0 border-gray-200 hover:bg-gray-100">
                                    <Github className="h-4 w-4 text-black" />
                                </Button>
                                <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0 border-gray-200 hover:bg-gray-100">
                                    <Linkedin className="h-4 w-4 text-black" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className={`border-gray-200 shadow-sm ${CSS_ANIMATION}`} style={{ animationDelay: '200ms' }}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3 pb-6">
                            <Button className="w-full bg-black hover:bg-gray-800 text-white text-xs h-12 shadow-sm" onClick={() => router.push('/subjects')}>
                                <PlayCircle className="h-4 w-4 mr-2" /> Resume
                            </Button>
                            <Button variant="outline" className="w-full border-gray-200 text-black hover:bg-gray-50 text-xs h-12" onClick={() => router.push('/subjects')}>
                                <BookOpen className="h-4 w-4 mr-2" /> Courses
                            </Button>
                            <Button variant="outline" className="w-full border-gray-200 text-black hover:bg-gray-50 text-xs h-12">
                                <CheckCircle2 className="h-4 w-4 mr-2" /> Quiz
                            </Button>
                            <Button variant="outline" className="w-full border-gray-200 text-black hover:bg-gray-50 text-xs h-12">
                                <UserCircle className="h-4 w-4 mr-2" /> Mentors
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Courses Summary */}
                    <Card className={`border-gray-200 shadow-sm ${CSS_ANIMATION}`} style={{ animationDelay: '250ms' }}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold">Course Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-6">
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600 font-medium text-sm flex items-center"><BookMarked className="w-4 h-4 mr-2 text-gray-400" />Enrolled</span>
                                <span className="font-bold text-black">{MOCK_COURSES.enrolled}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600 font-medium text-sm flex items-center"><Activity className="w-4 h-4 mr-2 text-gray-400" />In Progress</span>
                                <span className="font-bold text-black">{MOCK_COURSES.inProgress}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3">
                                <span className="text-gray-600 font-medium text-sm flex items-center"><Award className="w-4 h-4 mr-2 text-gray-400" />Completed</span>
                                <span className="font-bold text-black">{MOCK_COURSES.completed}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skills Progress */}
                    <Card className={`border-gray-200 shadow-sm ${CSS_ANIMATION}`} style={{ animationDelay: '300ms' }}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold">Skills Progress</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pb-6 pt-2">
                            {MOCK_SKILLS.map((skill, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                                        <span className="text-gray-900">{skill.name}</span>
                                        <span className="text-gray-500">{skill.level}%</span>
                                    </div>
                                    <Progress value={skill.level} className="h-2 bg-gray-100 [&>div]:bg-black" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* --- RIGHT COLUMN (Span 8) --- */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Welcome & Continue Learning */}
                    <Card className={`border-gray-200 bg-black text-white shadow-xl ${CSS_ANIMATION}`} style={{ animationDelay: '350ms' }}>
                        <CardContent className="p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Keep up the momentum!</h2>
                                <p className="text-gray-400 max-w-lg leading-relaxed">You left off at <span className="text-white font-semibold">"Advanced Design Patterns in Next.js"</span>. You're 80% through this module.</p>
                            </div>
                            <Button className="shrink-0 bg-white text-black hover:bg-gray-200 font-bold py-6 px-8 rounded-xl shadow-md" onClick={() => router.push('/subjects')}>
                                Continue Learning <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Learning Statistics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className={`border-gray-200 shadow-sm p-5 flex flex-col items-center justify-center text-center ${CSS_ANIMATION}`} style={{ animationDelay: '400ms' }}>
                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-black">
                                <Clock className="w-5 h-5" />
                            </div>
                            <p className="text-3xl font-extrabold text-black">{MOCK_STATS.totalWatchTime}</p>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Watch Time</p>
                        </Card>
                        <Card className={`border-gray-200 shadow-sm p-5 flex flex-col items-center justify-center text-center ${CSS_ANIMATION}`} style={{ animationDelay: '450ms' }}>
                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-black">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <p className="text-3xl font-extrabold text-black">{MOCK_STATS.lessonsCompleted}</p>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Lessons Done</p>
                        </Card>
                        <Card className={`border-gray-200 shadow-sm p-5 flex flex-col items-center justify-center text-center ${CSS_ANIMATION}`} style={{ animationDelay: '500ms' }}>
                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-black">
                                <Target className="w-5 h-5" />
                            </div>
                            <p className="text-3xl font-extrabold text-black">{MOCK_STATS.quizAttempts}</p>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Quizzes Taken</p>
                        </Card>
                        <Card className={`border-gray-200 bg-gray-50 shadow-sm p-5 flex flex-col items-center justify-center text-center border-2 border-black/5 relative overflow-hidden ${CSS_ANIMATION}`} style={{ animationDelay: '550ms' }}>
                            <Flame className="w-24 h-24 text-gray-200/50 absolute -right-4 -bottom-4" />
                            <div className="h-10 w-10 bg-black text-white rounded-full flex items-center justify-center mb-3 z-10">
                                <Flame className="w-5 h-5" />
                            </div>
                            <p className="text-3xl font-extrabold text-black z-10">{MOCK_STATS.streak} Days</p>
                            <p className="text-xs font-bold text-black uppercase tracking-widest mt-1 z-10">Current Streak</p>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Achievements & Badges */}
                        <Card className={`border-gray-200 shadow-sm ${CSS_ANIMATION}`} style={{ animationDelay: '600ms' }}>
                            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-bold">Achievements</CardTitle>
                                <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-black hover:bg-gray-100">View All</Button>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="space-y-4">
                                    {MOCK_BADGES.map((badge, idx) => (
                                        <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-black">
                                                {badge.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">{badge.title}</h4>
                                                <p className="text-xs text-gray-500 font-medium">{badge.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card className={`border-gray-200 shadow-sm ${CSS_ANIMATION}`} style={{ animationDelay: '650ms' }}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="relative border-l-2 border-gray-100 ml-3 md:ml-4 space-y-6 pb-2">
                                    {MOCK_RECENT_ACTIVITY.map((activity, idx) => (
                                        <div key={idx} className="relative pl-6">
                                            <div className="absolute w-3 h-3 bg-black rounded-full -left-[7px] top-1.5 ring-4 ring-white" />
                                            <h4 className="font-bold text-gray-900 text-sm">{activity.title}</h4>
                                            <p className="text-xs text-gray-500 font-medium mt-0.5">{activity.time} • {activity.type}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Leaderboard & Notifications Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Leaderboard */}
                        <Card className={`border-gray-200 shadow-sm ${CSS_ANIMATION}`} style={{ animationDelay: '700ms' }}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    Leaderboard <TrendingUp className="w-4 h-4 text-gray-400" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="space-y-2 pb-2">
                                    {MOCK_LEADERBOARD.map((user, idx) => (
                                        <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${user.name === "You" ? "bg-black text-white border-black" : "bg-white border-gray-100"}`}>
                                            <div className="flex items-center gap-3">
                                                <span className={`font-bold w-5 ${user.name === "You" ? "text-gray-300" : "text-gray-400"}`}>#{user.rank}</span>
                                                <span className="font-semibold text-sm">{user.name}</span>
                                            </div>
                                            <span className={`text-xs font-bold ${user.name === "You" ? "text-gray-300" : "text-gray-500"}`}>{user.points} pts</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notifications */}
                        <Card className={`border-gray-200 shadow-sm ${CSS_ANIMATION}`} style={{ animationDelay: '750ms' }}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-bold">Updates</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="space-y-4">
                                    {MOCK_NOTIFICATIONS.map((notif, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="mt-0.5">
                                                <div className="w-2.5 h-2.5 bg-black rounded-full shadow-[0_0_0_4px_rgba(0,0,0,0.1)]"></div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm leading-tight">{notif.title}</h4>
                                                <p className="text-xs text-gray-500 mt-1">{notif.desc}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-2">{notif.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}
