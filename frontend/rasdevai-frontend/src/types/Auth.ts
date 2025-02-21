export interface SignInData {
    email: string;
    password: string;
}

export interface SignUpData {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user?: any;
}
