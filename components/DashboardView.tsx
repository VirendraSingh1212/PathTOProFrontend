import React from "react";
import {
    User, Calendar, Clock, BookOpen, CheckCircle, Award,
    Flame, TrendingUp, PlayCircle, Trophy, ArrowRight, Sparkles
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- MOCK DATA ---
const studyData = [
    { name: 'Mon', hours: 1.5 },
    { name: 'Tue', hours: 2.0 },
    { name: 'Wed', hours: 0.5 },
    { name: 'Thu', hours: 3.2 },
    { name: 'Fri', hours: 1.8 },
    { name: 'Sat', hours: 4.5 },
    { name: 'Sun', hours: 2.5 },
];

const recentActivity = [
    { id: 1, type: 'lesson', title: 'Completed Lesson: "CSS Flexbox"', time: '2 hours ago', icon: <CheckCircle className="text-green-500" size={16} /> },
    { id: 2, type: 'quiz', title: 'Started Quiz: "JavaScript Basics"', time: 'Yesterday', icon: <PlayCircle className="text-blue-500" size={16} /> },
    { id: 3, type: 'badge', title: 'Earned Badge: "7 Day Streak"', time: '2 days ago', icon: <Flame className="text-orange-500" size={16} /> },
];

const achievements = [
    { id: 1, title: 'Beginner Learner', icon: '👶', unlocked: true },
    { id: 2, title: '7 Day Streak', icon: '🔥', unlocked: true },
    { id: 3, title: '10 Lessons', icon: '📚', unlocked: false },
    { id: 4, title: 'First Quiz', icon: '🎯', unlocked: true },
];

const recommendations = [
    { id: 1, title: 'Advanced React Patterns', type: 'Course', duration: '4h 30m', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80' },
    { id: 2, title: 'Understanding Next.js App Router', type: 'Lesson', duration: '45m', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80' },
];

export default function DashboardView({ user, subjects }: { user: any, subjects: any[] }) {
    // Stat calculations
    const enrolledCourses = subjects.filter(s => (s.progressPercent || 0) > 0);
    const totalCoursesEnrolled = enrolledCourses.length || subjects.length;
    const totalProgress = subjects.length > 0
        ? Math.round(subjects.reduce((sum, s) => sum + (s.progressPercent || 0), 0) / subjects.length)
        : 0;

    const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "March 2026";

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">

            {/* ── TOP SECTION (Profile & Streaks) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Profile Card */}
                <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm col-span-1 lg:col-span-1 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 w-full h-24 bg-gradient-to-r from-blue-50 to-indigo-50" />
                    <div className="relative z-10 w-20 h-20 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-gray-800 to-black text-white mt-4 mb-4">
                        {user?.name ? user.name.charAt(0).toUpperCase() : <User size={32} />}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Pro Student'}</h2>
                    <p className="text-sm text-gray-500 mb-6">{user?.email || 'Learning Enthusisast'}</p>

                    <div className="w-full grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                        <div>
                            <p className="text-2xl font-black text-gray-900">{totalCoursesEnrolled}</p>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Enrolled</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-900">{totalProgress}%</p>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg Progress</p>
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
                        <Calendar size={14} /> Joined {joinDate}
                    </div>
                </div>

                {/* Streak & Today's Study */}
                <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Streak Card */}
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-[24px] p-6 border border-orange-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 text-orange-500/10 group-hover:scale-110 transition-transform duration-500">
                            <Flame size={140} />
                        </div>
                        <div>
                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                                <Flame size={20} className="fill-current" />
                            </div>
                            <h3 className="text-gray-600 font-medium mb-1">Current Streak</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-gray-900">7</span>
                                <span className="text-gray-500 font-medium">Days</span>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-sm text-orange-700 font-medium bg-white/60 w-fit px-3 py-1.5 rounded-lg border border-orange-200/50">
                            <Trophy size={14} /> Longest Streak: 18 Days
                        </div>
                    </div>

                    {/* Today's Time */}
                    <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                                <Clock size={20} />
                            </div>
                            <h3 className="text-gray-600 font-medium mb-1">Today&apos;s Study Time</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-gray-900">1</span>
                                <span className="text-gray-500 font-medium">h</span>
                                <span className="text-4xl font-black text-gray-900">45</span>
                                <span className="text-gray-500 font-medium">m</span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span>Daily Goal (2h)</span>
                                <span className="font-bold text-gray-900">85%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MIDDLE SECTION (Progress & Charts) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Course Progress List */}
                <div className="col-span-1 lg:col-span-2 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Course Progress</h3>
                            <p className="text-sm text-gray-500">Pick up where you left off</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {enrolledCourses.length > 0 ? enrolledCourses.slice(0, 3).map((course, idx) => (
                            <div key={idx} className="p-4 rounded-2xl border border-gray-100 hover:border-gray-300 transition-colors group">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-gray-900 group-hover:text-black">{course.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                            <PlayCircle size={12} /> Last: Introduction to concepts
                                        </p>
                                    </div>
                                    <button className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
                                        Continue
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                        <div className="bg-black h-1.5 rounded-full" style={{ width: `${course.progressPercent || Math.floor(Math.random() * 80) + 10}%` }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-gray-700 w-8">{course.progressPercent || Math.floor(Math.random() * 80) + 10}%</span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-gray-500 text-sm">No active courses. Explore the roadmap!</div>
                        )}
                    </div>
                </div>

                {/* Study Chart */}
                <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Weekly Study</h3>
                        <p className="text-sm text-gray-500">16 hours total</p>
                    </div>
                    <div className="flex-1 min-h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={studyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#000" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#000" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="hours" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* ── LOWER SECTION (Activity, Achievements, Recommended) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Activity & Achievements */}
                <div className="col-span-1 border border-gray-100 rounded-[24px] bg-white p-6 shadow-sm overflow-hidden flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
                    <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                        {recentActivity.map((act) => (
                            <div key={act.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                    {act.icon}
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-1">
                                    <div className="text-sm font-bold text-slate-900">{act.title}</div>
                                    <div className="text-xs font-medium text-slate-500">{act.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">Achievements</h3>
                    <div className="flex flex-wrap gap-2">
                        {achievements.map((badge) => (
                            <div key={badge.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${badge.unlocked ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-gray-50 border-gray-200 text-gray-400 grayscale opacity-50'}`}>
                                <span>{badge.icon}</span> {badge.title}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommended Learning (Animated) */}
                <div className="col-span-1 lg:col-span-2 bg-black rounded-[32px] p-1 flex flex-col relative overflow-hidden group">
                    {/* Animated gradient background border effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="bg-[#0b0b0b] w-full h-full rounded-[28px] p-6 lg:p-8 relative z-10 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles size={16} className="text-yellow-400" />
                                    <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">AI Recommended</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white tracking-tight">Next steps for you</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                            {recommendations.map(rec => (
                                <div key={rec.id} className="group/item relative rounded-2xl overflow-hidden cursor-pointer">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                                    <img src={rec.image} alt={rec.title} className="w-full h-full object-cover rounded-2xl group-hover/item:scale-110 transition-transform duration-700" style={{ minHeight: '180px' }} />

                                    <div className="absolute inset-x-0 bottom-0 z-20 p-5 translate-y-2 group-hover/item:translate-y-0 transition-transform duration-300">
                                        <span className="text-[10px] font-bold tracking-wider uppercase text-white/70 mb-1 block">{rec.type} • {rec.duration}</span>
                                        <h4 className="text-white font-bold leading-tight mb-2">{rec.title}</h4>
                                        <div className="flex items-center gap-2 text-white/0 group-hover/item:text-white text-xs font-medium transition-colors duration-300">
                                            Start learning <ArrowRight size={12} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
}
