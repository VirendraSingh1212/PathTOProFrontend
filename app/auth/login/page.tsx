'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';
import '../auth.css'; // Add our specific auth styles

const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const registerSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    // Omit confirmPassword from the UI for sleekness, or allow backend to process normally
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function UnifiedAuthPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);

    const [loginError, setLoginError] = useState<string | null>(null);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [registerSuccess, setRegisterSuccess] = useState(false);

    // Sign In Form setup
    const {
        register: loginFormRegister,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors, isSubmitting: isLoginSubmitting }
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    // Sign Up Form setup
    const {
        register: registerFormRegister,
        handleSubmit: handleRegisterSubmit,
        formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting },
        reset: resetRegisterForm
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onLogin = async (data: LoginFormValues) => {
        try {
            setLoginError(null);
            const response = await apiClient.post('/auth/login', data);
            const { accessToken, user } = response.data;
            login(accessToken, user);
            router.push('/subjects');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setLoginError(err.response?.data?.message || 'Failed to login');
            } else {
                setLoginError('An unexpected error occurred');
            }
        }
    };

    const onRegister = async (data: RegisterFormValues) => {
        try {
            setRegisterError(null);
            await apiClient.post('/auth/register', {
                name: data.name,
                email: data.email,
                password: data.password
            });
            setRegisterSuccess(true);
            resetRegisterForm();
            // Wait a moment then slide to login view
            setTimeout(() => {
                setIsRightPanelActive(false);
                setRegisterSuccess(false);
            }, 2000);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setRegisterError(err.response?.data?.message || 'Failed to register');
            } else {
                setRegisterError('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f6f5f7] p-4 font-sans">
            <div
                className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`}
                id="container"
            >
                {/* Sign Up Panel */}
                <div className="form-container sign-up-container">
                    <form className="auth-form" onSubmit={handleRegisterSubmit(onRegister)}>
                        <h1 className="text-2xl font-bold mb-6 text-gray-900">Create Account</h1>

                        {registerError && <p className="text-sm text-red-500 mb-2">{registerError}</p>}
                        {registerSuccess && <p className="text-sm text-green-600 mb-2">Success! Redirecting to login...</p>}

                        <input
                            type="text"
                            className="auth-input"
                            placeholder="Name"
                            {...registerFormRegister('name')}
                        />
                        {registerErrors.name && <p className="text-xs text-red-500 text-left w-full mt-1 mb-1">{registerErrors.name.message}</p>}

                        <input
                            type="email"
                            className="auth-input"
                            placeholder="Email"
                            {...registerFormRegister('email')}
                        />
                        {registerErrors.email && <p className="text-xs text-red-500 text-left w-full mt-1 mb-1">{registerErrors.email.message}</p>}

                        <input
                            type="password"
                            className="auth-input"
                            placeholder="Password"
                            {...registerFormRegister('password')}
                        />
                        {registerErrors.password && <p className="text-xs text-red-500 text-left w-full mt-1 mb-1">{registerErrors.password.message}</p>}

                        <button className="auth-btn" type="submit" disabled={isRegisterSubmitting}>
                            {isRegisterSubmitting ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </form>
                </div>

                {/* Sign In Panel */}
                <div className="form-container sign-in-container">
                    <form className="auth-form" onSubmit={handleLoginSubmit(onLogin)}>
                        <h1 className="text-2xl font-bold mb-6 text-gray-900">Sign in</h1>

                        {loginError && <p className="text-sm text-red-500 mb-2">{loginError}</p>}

                        <input
                            type="email"
                            className="auth-input"
                            placeholder="Email"
                            {...loginFormRegister('email')}
                        />
                        {loginErrors.email && <p className="text-xs text-red-500 text-left w-full mt-1 mb-1">{loginErrors.email.message}</p>}

                        <input
                            type="password"
                            className="auth-input"
                            placeholder="Password"
                            {...loginFormRegister('password')}
                        />
                        {loginErrors.password && <p className="text-xs text-red-500 text-left w-full mt-1 mb-1">{loginErrors.password.message}</p>}

                        <button className="auth-btn mt-6" type="submit" disabled={isLoginSubmitting}>
                            {isLoginSubmitting ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Overlay Container */}
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
                            <p className="text-sm font-light leading-relaxed tracking-wide mb-8">
                                Sign in to continue your learning journey and track your progress.
                            </p>
                            <button
                                className="auth-btn ghost"
                                onClick={() => setIsRightPanelActive(false)}
                                type="button"
                            >
                                Sign In
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1 className="text-3xl font-bold mb-4">Welcome to PathToPro!</h1>
                            <p className="text-sm font-light leading-relaxed tracking-wide mb-8">
                                Start your journey to becoming a pro. Learn, practice, and grow with PathToPro.
                            </p>
                            <button
                                className="auth-btn ghost"
                                onClick={() => setIsRightPanelActive(true)}
                                type="button"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
