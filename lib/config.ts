const buildApiUrl = (baseUrl: string | undefined): string => {
    if (!baseUrl) return 'https://pathtopro-backend.onrender.com/api';
    const cleanUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

export const config = {
    baseURL: buildApiUrl(process.env.NEXT_PUBLIC_API_URL),
};
