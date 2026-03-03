import axios from 'axios';
import { config } from './config';
import { useAuthStore } from '@/store/authStore';

const apiClient = axios.create({
    baseURL: config.baseURL,
    withCredentials: true, // Needed for HTTP-only refresh cookie
});

// Request Interceptor: Attach access token
apiClient.interceptors.request.use(
    (reqConfig) => {
        const token = useAuthStore.getState().accessToken;
        if (token && reqConfig.headers) {
            reqConfig.headers.Authorization = `Bearer ${token}`;
        }
        return reqConfig;
    },
    (error) => Promise.reject(error)
);

// Variables for refresh token queue management
let isRefreshing = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let failedQueue: any[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response Interceptor: Handle 401s
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Use standard axios to avoid interceptor loop
                const { data } = await axios.post(
                    `${config.baseURL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newToken = data.accessToken;
                useAuthStore.getState().setToken(newToken);

                processQueue(null, newToken);
                originalRequest.headers['Authorization'] = 'Bearer ' + newToken;

                return apiClient(originalRequest);
            } catch (err) {
                processQueue(err, null);
                useAuthStore.getState().logout();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
