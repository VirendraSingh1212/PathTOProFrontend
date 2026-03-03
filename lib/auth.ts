import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    exp?: number;
    [key: string]: unknown;
}

export const isValidToken = (token: string | null): boolean => {
    if (!token) return false;
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        // Check if the token is expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
};
