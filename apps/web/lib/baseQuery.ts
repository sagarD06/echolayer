import {
    fetchBaseQuery,
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { useAuthStore } from "@/store/Auth.store";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include", // sends httpOnly refresh token cookie automatically
    prepareHeaders: (headers) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // attempt silent refresh — httpOnly cookie is sent automatically
        const refreshResult = await rawBaseQuery(
            { url: "/auth/refresh", method: "POST" },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            const { accessToken } = refreshResult.data as { accessToken: string };
            useAuthStore.getState().setToken(accessToken);

            // retry the original request with the new token
            result = await rawBaseQuery(args, api, extraOptions);
        } else {
            // refresh failed — clear auth and let the middleware redirect
            useAuthStore.getState().clearAuth();
        }
    }

    return result;
};