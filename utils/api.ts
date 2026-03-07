/**
 * API Utilities for PathToPro
 * Centralizes backend URL normalization and endpoints
 */

const getApiBaseUrl = () => {
    // Priority: Env variable or default production backend
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "https://pathtopro-backend.onrender.com";

    // Remove trailing slash if present
    const cleanUrl = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;

    // Ensure it ends with /api
    return cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
};

export const API_BASE = getApiBaseUrl();

export const ENDPOINTS = {
    CHATBOT: `${API_BASE}/chatbot/message`,
    SUBJECTS: (id: string) => `${API_BASE}/subjects/${id}/tree`,
    PROFILE: `${API_BASE}/users/profile`,
    AUTH: {
        LOGIN: `${API_BASE}/auth/login`,
        SIGNUP: `${API_BASE}/auth/signup`,
    }
};
