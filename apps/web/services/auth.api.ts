import { ForgotPasswordInput, LoginInputType, RegisterInputType, ResetPasswordInput } from "@echolayer/schema";
import { baseApi } from "./base.api";
import { IAuthTokens, IUser } from "@/types/userTypes";
import { useAuthStore } from "@/store/Auth.store";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<{ message: string }, RegisterInputType>({
            query: (body) => ({
                url: "/auth/register",
                method: "POST",
                body
            })
        }),
        login: builder.mutation<{ user: IUser, accessToken: string }, LoginInputType>({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body
            }),
            async onQueryStarted(_args, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    useAuthStore.getState().setAuth(data.user, data.accessToken);
                } catch (error) {
                    console.error(error)
                }
            }
        }),
        logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: "auth/logout",
                method: "POST"
            }),
            async onQueryStarted(_args, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                    useAuthStore.getState().clearAuth();
                    dispatch(baseApi.util.resetApiState())
                } catch {
                    useAuthStore.getState().clearAuth();
                    dispatch(baseApi.util.resetApiState())
                }
            }
        }),
        forgotPassword: builder.mutation<{ message: string }, ForgotPasswordInput>({
            query: (body) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body
            })
        }),
        resetPassword: builder.mutation<{ message: string }, ResetPasswordInput>({
            query: (body) => ({
                url: "auth/reset-password",
                method: "POST",
                body
            })
        }),
        refresh: builder.mutation<IAuthTokens, void>({
            query: () => ({
                url: "auth/refresh",
                method: "POST"
            }),
            async onQueryStarted(_args, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    useAuthStore.getState().setToken(data.accessToken);
                } catch {
                    useAuthStore.getState().clearAuth();
                }
            }
        })
    }),
    overrideExisting: false,
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useRefreshMutation,
} = authApi;