import { baseApi } from "./base.api";

import { IUser } from "@/types/userTypes";
import { useAuthStore } from "@/store/Auth.store";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<IUser, void>({
            query: () => "user/me",
            providesTags: ["User"],
            async onQueryStarted(_args, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const token = useAuthStore.getState().accessToken;

                    if (token) {
                        useAuthStore.getState().setAuth(data, token);
                    }
                } catch {
                    console.log("Failed to fetch user details.")
                }
            }
        })
    }),
    overrideExisting: false,
})

export const { useGetMeQuery } = userApi;