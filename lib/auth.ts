import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    exp?: number;
    [key: string]: unknown;
}

export const isValidToken = (token: string | null): boolean => {
    if (!token) return false;
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        
        // Check if expiration exists and token is expired
        if (decoded.exp !== undefined) {
            // JWT exp is in seconds, convert to milliseconds
            const now = Date.now();
            const expirationTime = decoded.exp * 1000;
            
            // Add 30 second buffer for clock skew
            if (expirationTime < now - 30000) {
                return false;
            }
        }
        
        return true;
    } catch {
        return false;
    }
};
