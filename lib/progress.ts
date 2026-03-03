import apiClient from './apiClient';

let timeoutId: NodeJS.Timeout | null = null;

export const saveProgressDebounced = (
    videoId: string,
    currentTime: number,
    isCompleted: boolean = false
) => {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
        apiClient
            .post(`/progress/videos/${videoId}`, {
                last_position_seconds: Math.floor(currentTime),
                is_completed: isCompleted,
            })
            .catch((err) => console.error('Failed to save progress', err));
    }, 5000); // 5 seconds debounce
};

export const saveProgressNow = async (
    videoId: string,
    currentTime: number,
    isCompleted: boolean = false
) => {
    if (timeoutId) clearTimeout(timeoutId);
    try {
        await apiClient.post(`/progress/videos/${videoId}`, {
            last_position_seconds: Math.floor(currentTime),
            is_completed: isCompleted,
        });
    } catch (err) {
        console.error('Failed to save progress now', err);
    }
};
