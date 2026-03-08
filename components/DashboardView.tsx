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
        <div className="space-y-10 pb-12">

            {/* ── TOP SECTION (Profile & Streaks) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Profile Card */}
                <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] col-span-1 flex flex-col items-center text-center relative overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                    <div className="absolute top-0 w-full h-32 bg-gradient-to-br from-blue-50/50 to-indigo-50/50" />
                    <div className="relative z-10 w-24 h-24 bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center text-3xl font-black bg-gradient-to-br from-slate-900 to-slate-800 text-white mt-4 mb-6 ring-4 ring-blue-50">
                        {user?.name ? user.name.charAt(0).toUpperCase() : <User size={40} />}
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user?.name || 'Pro Student'}</h2>
                        <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{user?.email || 'Ultimate Tier'}</p>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-6 mt-10 pt-8 border-t border-slate-50">
                        <div className="group cursor-default">
                            <p className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase">{totalCoursesEnrolled}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Courses</p>
                        </div>
                        <div className="group cursor-default">
                            <p className="text-3xl font-black text-slate-900 group-hover:text-emerald-500 transition-colors uppercase">{totalProgress}%</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Avg progress</p>
                        </div>
                    </div>
                </div>

                {/* Stats Container */}
                <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {/* Streak Card */}
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-[32px] p-8 border border-orange-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden group animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                        <div className="absolute -right-8 -top-8 text-orange-500/10 group-hover:scale-110 transition-transform duration-700 rotate-12">
                            <Flame size={180} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-white text-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-orange-100">
                                <Flame size={28} className="fill-current" />
                            </div>
                            <h3 className="text-slate-500 font-black text-xs uppercase tracking-widest mb-2">Learning Streak</h3>
                            <div className="flex items-baseline gap-3">
                                <span className="text-5xl font-black text-slate-900 tracking-tighter">7</span>
                                <span className="text-slate-400 font-black uppercase text-xs tracking-widest">Ongoing Days</span>
                            </div>
                        </div>
                        <div className="mt-8 flex items-center gap-2 text-xs text-orange-700 font-black uppercase tracking-widest bg-white/80 w-fit px-4 py-2.5 rounded-2xl border border-orange-200/50 shadow-sm transition-all group-hover:bg-white">
                            <Trophy size={14} /> Record: 18 Days
                        </div>
                    </div>

                    {/* Today's Time Card */}
                    <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden group animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                        <div className="absolute -right-8 -top-8 text-blue-500/5 group-hover:scale-110 transition-transform duration-700 -rotate-12">
                            <Clock size={180} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
                                <Clock size={28} />
                            </div>
                            <h3 className="text-slate-500 font-black text-xs uppercase tracking-widest mb-2">Daily Focus</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-slate-900 tracking-tighter">1</span>
                                <span className="text-slate-400 font-black text-xs uppercase tracking-widest">h</span>
                                <span className="text-5xl font-black text-slate-900 tracking-tighter ml-1">45</span>
                                <span className="text-slate-400 font-black text-xs uppercase tracking-widest">m</span>
                            </div>
                        </div>
                        <div className="mt-8 relative z-10">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                                <span>Session Goal (2h)</span>
                                <span className="text-blue-600">85% Ready</span>
                            </div>
                            <div className="w-full bg-slate-50 rounded-full h-3 border border-slate-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MIDDLE SECTION (Progress & Charts) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Course Progress List */}
                <div className="col-span-1 lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-400">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Learning Path</h3>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Pick up where you left off</p>
                        </div>
                        <button className="text-blue-600 text-xs font-black uppercase tracking-widest hover:text-blue-800 transition-colors">See Statistics</button>
                    </div>

                    <div className="space-y-4">
                        {enrolledCourses.length > 0 ? enrolledCourses.slice(0, 3).map((course, idx) => (
                            <div key={idx} className="p-5 rounded-3xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/20 transition-all duration-300 group cursor-pointer">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-900 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                            <BookOpen size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 tracking-tight text-lg group-hover:text-blue-600 transition-colors uppercase">{course.title}</h4>
                                            <p className="text-[10px] font-black text-slate-400 mt-0.5 flex items-center gap-1.5 uppercase tracking-widest">
                                                <PlayCircle size={10} className="text-blue-500" /> Current: {idx === 0 ? "Deep Dive" : "Modules"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-black text-slate-900 whitespace-nowrap">{course.progressPercent || 25}%</span>
                                        <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${course.progressPercent || 25}%` }}></div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-12 text-slate-400 font-black uppercase tracking-widest text-xs border-2 border-dashed border-slate-50 rounded-3xl">No active streams found. Browse subjects.</div>
                        )}
                    </div>
                </div>

                {/* Study Chart */}
                <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
                    <div className="mb-8">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Flow Performance</h3>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">16.4 hours this week</p>
                    </div>
                    <div className="flex-1 min-h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={studyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#cbd5e1' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#cbd5e1' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px', fontSize: '10px', fontWeight: 'bold' }}
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorHours)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* ── LOWER SECTION (Activity, Achievements, Recommended) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Activity & Achievements */}
                <div className="col-span-1 border border-slate-100 rounded-[32px] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-700 delay-600">
                    <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight uppercase text-xs tracking-widest">Feed</h3>
                    <div className="space-y-6 relative">
                        {recentActivity.map((act) => (
                            <div key={act.id} className="relative flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 z-10 group-hover:bg-blue-50 transition-colors">
                                    {act.icon}
                                </div>
                                <div>
                                    <div className="text-xs font-black text-slate-900 uppercase leading-snug">{act.title}</div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{act.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mt-10 mb-6 tracking-tight uppercase text-xs tracking-widest">Medals</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {achievements.map((badge) => (
                            <div key={badge.id} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${badge.unlocked ? 'bg-amber-50/50 border-amber-100 text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-300 opacity-60 grayscale'}`}>
                                <span className="text-xl">{badge.icon}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest leading-tight">{badge.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommended Learning (Animated) */}
                <div className="col-span-1 lg:col-span-2 bg-slate-900 rounded-[40px] p-1.5 flex flex-col relative overflow-hidden group animate-in fade-in slide-in-from-bottom-6 duration-700 delay-700">
                    {/* Animated gradient background border effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                    <div className="bg-[#0b0b0b] w-full h-full rounded-[36px] p-10 relative z-10 flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles size={14} className="text-blue-400 animate-pulse" />
                                    <span className="text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase">AI Recommendations</span>
                                </div>
                                <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Forge your career path</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                            {recommendations.map(rec => (
                                <div key={rec.id} className="group/item relative rounded-[24px] overflow-hidden cursor-pointer shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />
                                    <img src={rec.image} alt={rec.title} className="w-full h-full object-cover rounded-[24px] group-hover/item:scale-110 transition-transform duration-1000" style={{ minHeight: '220px' }} />

                                    <div className="absolute inset-x-0 bottom-0 z-20 p-6 translate-y-3 group-hover/item:translate-y-0 transition-transform duration-500">
                                        <span className="text-[10px] font-black tracking-[0.1em] uppercase text-blue-400 mb-2 block">{rec.type} • {rec.duration}</span>
                                        <h4 className="text-xl font-black text-white leading-tight mb-4 uppercase tracking-tight">{rec.title}</h4>
                                        <div className="flex items-center gap-2 text-white/0 group-hover/item:text-white text-xs font-black uppercase tracking-widest transition-all duration-300">
                                            Initiate Module <ArrowRight size={14} className="group-hover/item:translate-x-1 transition-transform" />
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
