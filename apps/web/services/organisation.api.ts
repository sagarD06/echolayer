import { baseApi } from "./base.api";

import type { Organisation } from "@/types/dashboardType";

export interface OrgMember {
    id: string;
    name: string;
    email: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
    lastLoginAt: string | null;
    createdAt: string;
}

export const organisationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrganisation: builder.query<Organisation, void>({
            query: () => "/organisation",
            providesTags: ["Organisation"],
        }),

        getOrganisationMembers: builder.query<OrgMember[], void>({
            query: () => "/organisation/members",
            providesTags: ["OrganisationMembers"],
        }),

        removeOrganisationMember: builder.mutation<{ message: string }, string>({
            query: (userId) => ({
                url: `/organisation/members/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["OrganisationMembers"],
        }),

        deleteOrganisation: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: "/organisation",
                method: "DELETE",
            }),
            invalidatesTags: ["Organisation"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetOrganisationQuery,
    useGetOrganisationMembersQuery,
    useRemoveOrganisationMemberMutation,
    useDeleteOrganisationMutation,
} = organisationApi;