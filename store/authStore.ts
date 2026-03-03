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
    isHydrated: boolean;
    setToken: (token: string) => void;
    setUser: (user: User) => void;
    login: (token: string, user: User) => void;
    logout: () => void;
    setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            loading: false,
            isHydrated: false,
            setToken: (token) => set({ accessToken: token, isAuthenticated: !!token }),
            setUser: (user) => set({ user }),
            login: (token, user) => set({ accessToken: token, user, isAuthenticated: true }),
            logout: () => set({ accessToken: null, user: null, isAuthenticated: false }),
            setHydrated: () => set({ isHydrated: true }),
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
            onRehydrateStorage: () => (state, error) => {
                if (!error && state) {
                    // Mark hydration complete after restoring from localStorage
                    state.setHydrated();
                }
            },
        }
    )
);
