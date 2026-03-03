import { create } from 'zustand';

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
    setToken: (token: string) => void;
    setUser: (user: User) => void;
    login: (token: string, user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    setToken: (token) => set({ accessToken: token, isAuthenticated: !!token }),
    setUser: (user) => set({ user }),
    login: (token, user) => set({ accessToken: token, user, isAuthenticated: true }),
    logout: () => set({ accessToken: null, user: null, isAuthenticated: false }),
}));
