'use client';

import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, TrendingUp, Lock } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-24 px-4 text-center overflow-hidden">
        {/* Subtle radial gradient background */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-gray-50 to-gray-50 opacity-80 pointer-events-none" />

        <div className="relative z-10 max-w-4xl w-full mx-auto flex flex-col items-center">
          {!isAuthenticated ? (
            <>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                Welcome to PathToPro
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-10">
                A structured learning platform built for serious learners. <br className="hidden sm:block" />
                Master industry-ready skills with guided paths and smart progress tracking.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="h-12 px-8 text-lg rounded-full hover:scale-105 transition-transform">
                    Start Learning →
                  </Button>
                </Link>
                <Link href="/subjects">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full hover:shadow-lg transition-shadow bg-white/50 backdrop-blur-sm">
                    Explore Courses
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                Welcome back, {user?.name?.split(' ')[0] || 'Student'} 👋
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10">
                Continue building momentum and complete your learning path.
              </p>

              <div className="max-w-md w-full mx-auto">
                <Card className="rounded-xl shadow-sm border-gray-200 bg-white hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6 text-left">
                    <p className="text-xs font-bold text-blue-600 mb-2 tracking-wider mt-1">IN PROGRESS</p>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-1">
                      Full-Stack Development Masterclass
                    </h3>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm text-gray-500 font-medium tracking-wide">
                        <span>Course Progress</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <Link href="/subjects" className="block mt-2">
                      <Button className="w-full rounded-lg shadow-sm">
                        Continue Learning →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-20 px-4 bg-white border-t border-gray-100 flex-1">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <BookOpen className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Structured Courses</h3>
              <p className="text-gray-500 leading-relaxed max-w-xs">
                Step-by-step learning paths.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-14 w-14 rounded-full bg-green-50 flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
              <p className="text-gray-500 leading-relaxed max-w-xs">
                Resume exactly where you stopped.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-14 w-14 rounded-full bg-purple-50 flex items-center justify-center mb-6">
                <Lock className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Focused Learning</h3>
              <p className="text-gray-500 leading-relaxed max-w-xs">
                Unlock lessons progressively.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
