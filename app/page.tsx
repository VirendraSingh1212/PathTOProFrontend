'use client';

import { useAuthStore } from '@/store/authStore';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, TrendingUp, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const handleProtectedNavigation = () => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/subjects');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 4rem)", background: "#f8fafc", display: "flex", flexDirection: "column" }}>

      {/* ── Hero Section ──────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-container">

          {!isAuthenticated ? (
            <>
              <h1 className="hero-title animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
                Welcome to <span>PathToPro</span>
              </h1>

              <p className="hero-subtitle animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 fill-mode-both">
                A structured learning platform built for serious learners.{" "}
                Master industry-ready skills with guided paths and smart progress tracking.
              </p>

              <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0" }}>
                <Link href="/auth/login" className="primary-btn">
                  Start Learning →
                </Link>
                <Link href="/subjects" className="secondary-btn">
                  Explore Courses
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="hero-title animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
                Welcome back, <span>{user?.name?.split(' ')[0] || 'Student'}</span> 👋
              </h1>

              <p className="hero-subtitle animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 fill-mode-both">
                Continue building momentum and complete your learning path.
              </p>

              <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both" style={{ maxWidth: "420px", margin: "0 auto" }}>
                <Card style={{
                  borderRadius: "16px",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.07)",
                  border: "1px solid #f1f5f9",
                  background: "white"
                }}>
                  <CardContent style={{ padding: "24px", textAlign: "left" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#2563eb", letterSpacing: "0.08em", marginBottom: "8px" }}>
                      IN PROGRESS
                    </p>
                    <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#111827", marginBottom: "16px" }}>
                      Full-Stack Development Masterclass
                    </h3>
                    <div style={{ marginBottom: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>
                        <span>Course Progress</span>
                        <span style={{ fontWeight: 600 }}>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <Link href="/subjects">
                      <button className="continue-btn">Continue Learning →</button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Feature Highlights ────────────────────────────────────── */}
      <section className="features-section" style={{ flex: 1 }}>

        {/* Section label */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700 fill-mode-both" style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#2563eb", letterSpacing: "0.1em", marginBottom: "10px" }}>
            WHY PATHTOPRO
          </p>
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#0f172a", marginBottom: "12px" }}>
            Everything you need to level up
          </h2>
          <p style={{ fontSize: "16px", color: "#64748b", maxWidth: "500px", margin: "0 auto" }}>
            Built around how engineers actually learn — structured, progressive, and focused.
          </p>
        </div>

        <div className="features-grid">
          {/* Feature 1 — Structured Courses */}
          <div className="feature-card animate-in fade-in slide-in-from-bottom-8 duration-700 delay-900 fill-mode-both" onClick={handleProtectedNavigation}>
            <div className="feature-icon icon-blue">
              <BookOpen size={24} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "10px" }}>
              Structured Courses
            </h3>
            <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.6 }}>
              Step-by-step learning paths designed by industry professionals to build real skills.
            </p>
          </div>

          {/* Feature 2 — Track Progress */}
          <div className="feature-card animate-in fade-in slide-in-from-bottom-8 duration-700 delay-1000 fill-mode-both" onClick={handleProtectedNavigation}>
            <div className="feature-icon icon-green">
              <TrendingUp size={24} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "10px" }}>
              Track Progress
            </h3>
            <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.6 }}>
              Always know where you are. Resume exactly where you stopped across any device.
            </p>
          </div>

          {/* Feature 3 — Focused Learning */}
          <div className="feature-card animate-in fade-in slide-in-from-bottom-8 duration-700 delay-1100 fill-mode-both" onClick={handleProtectedNavigation}>
            <div className="feature-icon icon-purple">
              <Lock size={24} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "10px" }}>
              Focused Learning
            </h3>
            <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.6 }}>
              Unlock lessons progressively to maintain focus without being overwhelmed.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
