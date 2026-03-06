import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    authLoading: boolean;
    setToken: (token: string) => void;
    setUser: (user: User) => void;
    login: (token: string, user: User) => void;
    logout: () => void;
    hydrateAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            loading: false,
            authLoading: true,
            setToken: (token) => set({ accessToken: token, isAuthenticated: !!token }),
            setUser: (user) => set({ user }),
            login: (token, user) => set({ accessToken: token, user, isAuthenticated: true }),
            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                }
                set({ accessToken: null, user: null, isAuthenticated: false });
            },
            hydrateAuth: async () => {
                try {
                    set({ authLoading: true });
                    const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pathtopro-backend.onrender.com/api';
                    const cleanUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
                    const apiBase = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

                    const res = await fetch(`${apiBase}/auth/me`, {
                        credentials: "include"
                    });

                    if (res.ok) {
                        const data = await res.json();
                        const matchedUser = data.user || data;
                        set({ user: matchedUser, isAuthenticated: true, authLoading: false });
                    } else {
                        set({ user: null, isAuthenticated: false, authLoading: false });
                    }
                } catch (err) {
                    set({ user: null, isAuthenticated: false, authLoading: false });
                }
            }
        }),
        {
            name: 'auth-storage', // localStorage key
            storage: createJSONStorage(() => ({
                getItem: (name: string) => {
                    if (typeof window === 'undefined') return null;
                    try {
                        return JSON.parse(localStorage.getItem(name) || 'null');
                    } catch {
                        return null;
                    }
                },
                setItem: (name: string, value: string) => {
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(name, value);
                    }
                },
                removeItem: (name: string) => {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem(name);
                    }
                },
            })),
            partialize: (state) => ({
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated,
                user: state.user,
            }),
        }
    )
);
