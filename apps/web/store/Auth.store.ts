import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { IUser } from "@/types/userTypes";

interface AuthState {
    user: IUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;

    /* actions */
    setAuth: (user: IUser, accessToken: string) => void;
    setToken: (accessToken: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,

            setAuth: (user, accessToken) =>
                set({ user, accessToken, isAuthenticated: true }, false, "setAuth"),

            setToken: (accessToken) =>
                set({ accessToken }, false, "setToken"),

            clearAuth: () =>
                set({ user: null, accessToken: null, isAuthenticated: false }, false, "clearAuth"),
        }),
        { name: "AuthStore" }
    )
);