import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { signIn, signUp } from "../services/authService";
import { SignInData, SignUpData, AuthResponse } from "../types/Auth";

interface AuthState {
    user: {
        id: string;
        username: string;
        email: string;
        auth_provider: string;
        is_active: boolean;
    };
    accessToken: string | null;
    refreshToken: string | null;
    status: "idle" | "loading" | "failed";
    error: string | null;
}

const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem("user") || "null") || {
        id: "",
        username: "",
        email: "",
        auth_provider: "",
        is_active: false,
    },
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    status: "idle",
    error: null,
};

export const loginAsync = createAsyncThunk(
    "auth/login",
    async (data: SignInData) => {
        const response = await signIn(data);
        return response;
    }
);

export const signUpAsync = createAsyncThunk(
    "auth/signUp",
    async (data: SignUpData) => {
        const response = await signUp(data);
        return response;
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = {
                id: "",
                username: "",
                email: "",
                auth_provider: "",
                is_active: false,
            };
            state.accessToken = null;
            state.refreshToken = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(
                loginAsync.fulfilled,
                (state, action: PayloadAction<AuthResponse>) => {
                    state.status = "idle";
                    state.accessToken = action.payload.access_token;
                    state.refreshToken = action.payload.refresh_token;
                    state.user = action.payload.user;

                    localStorage.setItem(
                        "accessToken",
                        action.payload.access_token
                    );

                    localStorage.setItem(
                        "refreshToken",
                        action.payload.refresh_token
                    );

                    localStorage.setItem(
                        "user",
                        JSON.stringify(action.payload.user)
                    );
                }
            )
            .addCase(loginAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to login";
            })
            .addCase(signUpAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(
                signUpAsync.fulfilled,
                (state, action: PayloadAction<AuthResponse>) => {
                    state.status = "idle";
                    state.accessToken = action.payload.access_token;
                    state.refreshToken = action.payload.refresh_token;
                    state.user = action.payload.user;

                    localStorage.setItem(
                        "accessToken",
                        action.payload.access_token
                    );

                    localStorage.setItem(
                        "refreshToken",
                        action.payload.refresh_token
                    );

                    localStorage.setItem(
                        "user",
                        JSON.stringify(action.payload.user)
                    );
                }
            )
            .addCase(signUpAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to sign up";
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
