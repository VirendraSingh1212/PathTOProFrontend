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
                let token = get().accessToken;

                // Fallback: Check localStorage directly if store is not yet hydrated
                if (!token && typeof window !== 'undefined') {
                    try {
                        const stored = localStorage.getItem('auth-storage');
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            token = parsed?.state?.accessToken;
                            if (token) {
                                set({ accessToken: token, isAuthenticated: true });
                            }
                        }
                    } catch (e) {
                        console.error("Auth hydration fallback failed:", e);
                    }
                }

                if (!token) {
                    set({ authLoading: false, isAuthenticated: false });
                    return;
                }

                try {
                    set({ authLoading: true });
                    const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pathtopro-backend.onrender.com/api';
                    const cleanUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
                    const apiBase = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

                    const res = await fetch(`${apiBase}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        credentials: "include"
                    });

                    if (res.ok) {
                        const data = await res.json();
                        const matchedUser = data.user || data;
                        set({ user: matchedUser, isAuthenticated: true, authLoading: false });
                    } else {
                        // If token is invalid, clear state
                        set({ user: null, isAuthenticated: false, authLoading: false, accessToken: null });
                    }
                } catch (err) {
                    // On network error, keep current local state (optimistic)
                    set({ authLoading: false });
                }
            }
        }),
        {
            name: 'auth-storage', // localStorage key
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated,
                user: state.user,
            }),
        }
    )
);
