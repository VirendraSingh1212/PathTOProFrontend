import { jwtDecode } from 'jwt-decode';

export const isValidToken = (token: string | null): boolean => {
    if (!token) return false;
    try {
        const decoded: any = jwtDecode(token);
        // Check if the token is expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
};
