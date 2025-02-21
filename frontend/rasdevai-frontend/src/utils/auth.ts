import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    exp: number;
}

export function isTokenValid(token: string): boolean {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            console.warn("Token истёк");

            return false;
        }
        return true;
    } catch (error) {
        console.error("Ошибка декодирования токена:", error);
        return false;
    }
}
