"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/lib/apiClient";
import axios from "axios";
import { AcademicCapIcon, CalendarIcon } from "@heroicons/react/24/outline";

export default function HeroLoginLanding() {
    const router = useRouter();
    const { login } = useAuthStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        try {
            setIsLoading(true);
            setError(null);
            const response = await apiClient.post('/auth/login', { email, password });
            const { accessToken, user } = response.data;
            login(accessToken, user);
            router.push("/subjects");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to login');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="hero-grid page-enter">
            {/* ── Left Side: Login Card ── */}
            <div className="login-card-container">
                <div className="login-card">
                    <div className="card-corner"></div>

                    {/* Logo / Header */}
                    <div className="login-header">
                        <div className="login-logo-icon">
                            <AcademicCapIcon width={28} height={28} />
                        </div>
                        <h2>Sign In</h2>
                        <p>Welcome back to PathToPro</p>
                    </div>

                    {error && <div className="login-error-message">{error}</div>}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="forgot-password">
                                <a href="#!">Forgot password?</a>
                            </div>
                        </div>

                        <button type="submit" className="sign-in-button" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    {/* Social Logins */}
                    <div className="social-login-section">
                        <p className="social-divider">
                            <span>Continue with</span>
                        </p>
                        <div className="social-buttons">
                            <button aria-label="Login with Google" className="social-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M23.49 12.275c0-.816-.074-1.636-.214-2.435H12v4.62h6.442a5.532 5.532 0 0 1-2.396 3.638v3.024h3.876c2.269-2.094 3.568-5.185 3.568-8.847z" />
                                    <path fill="#34A853" d="M12 24c3.24 0 5.957-1.076 7.942-2.915l-3.876-3.024c-1.077.725-2.454 1.156-4.066 1.156-3.125 0-5.772-2.115-6.716-4.96H1.28v3.136A11.996 11.996 0 0 0 12 24z" />
                                    <path fill="#FBBC05" d="M5.284 14.257A7.215 7.215 0 0 1 4.908 12c0-.776.136-1.536.376-2.257V6.607H1.28A11.97 11.97 0 0 0 0 12c0 1.936.463 3.774 1.28 5.393l4.004-3.136z" />
                                    <path fill="#4285F4" d="M12 4.783c1.761 0 3.344.608 4.588 1.796l3.447-3.447C17.953 1.192 15.236 0 12 0 7.425 0 3.385 2.662 1.28 6.607l4.004 3.136c.944-2.845 3.591-4.96 6.716-4.96z" />
                                </svg>
                            </button>
                            <button aria-label="Login with GitHub" className="social-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#333">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.372 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.578v-2.035c-3.338.726-4.043-1.611-4.043-1.611-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.814 1.103.814 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                            </button>
                            <button aria-label="Login with Facebook" className="social-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.063 24 12.073z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <p className="register-link">
                        Don't have an account? <a href="/auth/register">Sign up for free</a>
                    </p>
                </div>
            </div>

            {/* ── Right Side: Hero Illustration ── */}
            <div className="hero-illustration-container">
                {/* Placeholder illustration from standard SVG paths or shapes, since we don't have a reliable project image loaded. We'll use a clean geometric placeholder. */}
                <div className="hero-image hero-image-animate" aria-hidden="true">
                    <svg viewBox="0 0 600 500" width="100%" height="auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="50" y="50" width="400" height="300" rx="20" fill="#eef2ff" stroke="#c7d2fe" strokeWidth="4" />
                        <rect x="350" y="150" width="200" height="250" rx="20" fill="#e0e7ff" stroke="#a5b4fc" strokeWidth="4" />
                        <circle cx="250" cy="200" r="60" fill="#818cf8" opacity="0.8" />
                        <circle cx="450" cy="280" r="40" fill="#fbbf24" opacity="0.8" />
                        <path d="M100 350 L500 350" stroke="#c7d2fe" strokeWidth="8" strokeLinecap="round" />
                    </svg>
                </div>

                {/* Floating Stat Badge */}
                <div className="floating-stats-card">
                    <div className="stats-icon">
                        <CalendarIcon width={24} height={24} color="#3b5bdb" />
                    </div>
                    <div className="stats-info">
                        <h4>250K</h4>
                        <p>Assisted Students</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
