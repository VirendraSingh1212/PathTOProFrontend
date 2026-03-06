export const config = {
    baseURL: process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/api`
        : 'https://pathtopro-backend.onrender.com/api',
};
