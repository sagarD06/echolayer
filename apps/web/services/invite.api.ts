import { baseApi } from "./base.api";

export type InviteStatus = "PENDING" | "ACCEPTED" | "CANCELLED" | "EXPIRED";

export interface Invite {
    id: string;
    email: string;
    role: "ADMIN" | "MEMBER";
    projectId: string;
    organizationId: string;
    token: string;
    expiresAt: string;
    status?: InviteStatus;
}

export interface SendInvitePayload {
    projectId: string;
    emails: string[];
    role: "ADMIN" | "MEMBER";
}

export const inviteApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getInvites: builder.query<Invite[], string>({
            query: (projectId) => `/invites/projects/${projectId}/get-invites`,
            providesTags: (_result, _err, projectId) => [
                { type: "Invite", id: projectId },
            ],
        }),

        sendInvites: builder.mutation<{ message: string }, SendInvitePayload>({
            query: ({ projectId, ...body }) => ({
                url: `/invites/projects/${projectId}/send-invites`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _err, { projectId }) => [
                { type: "Invite", id: projectId },
            ],
        }),

        resendInvite: builder.mutation<
            { message: string },
            { projectId: string; inviteId: string }
        >({
            query: ({ projectId, inviteId }) => ({
                url: `/invites/projects/${projectId}/resend-invites/${inviteId}`,
                method: "POST",
            }),
            invalidatesTags: (_result, _err, { projectId }) => [
                { type: "Invite", id: projectId },
            ],
        }),

        cancelInvite: builder.mutation<
            { message: string },
            { projectId: string; inviteId: string }
        >({
            query: ({ projectId, inviteId }) => ({
                url: `/invites/projects/${projectId}/cancel-invites/${inviteId}`,
                method: "POST",
            }),
            invalidatesTags: (_result, _err, { projectId }) => [
                { type: "Invite", id: projectId },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetInvitesQuery,
    useSendInvitesMutation,
    useResendInviteMutation,
    useCancelInviteMutation,
} = inviteApi;