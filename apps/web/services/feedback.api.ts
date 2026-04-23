import { baseApi } from "./base.api";
import { ListFeedbacksInput, UpdateFeedbackStatusInput } from "@echolayer/schema";
import { feedback, feedbackResponse } from "@/types/feedbackType";

export const feedbackApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        listFeedbacks: builder.query<feedbackResponse, ListFeedbacksInput>({
            query: ({ projectId, ...params }) => ({
                url: `/feedbacks/projects/${projectId}`,
                params
            }),
            providesTags: (_result, _err, { projectId }) => [
                { type: "Feedback", id: projectId },
            ],
        }),
        updateFeedbackStatus: builder.mutation<feedback, UpdateFeedbackStatusInput>({
            query: ({ projectId,feedbackId, status }) => ({
                url: `/feedbacks/${projectId}/${feedbackId}/status`,
                method: "PUT",
                body: { status },
            }),
            invalidatesTags: (_result, _err, { projectId }) => [
                { type: "Feedback", id: projectId },
                "Stats",
            ],
        }),
        deleteFeedback: builder.mutation<
            { message: string },
            { projectId: string, feedbackId: string }
        >({
            query: ({ projectId, feedbackId }) => ({
                url: `/feedbacks/${projectId}/${feedbackId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _err, { projectId }) => [
                { type: "Feedback", id: projectId },
                "Stats",
            ],
        }),
        exportFeedbacks: builder.query<Blob, string>({
            query: (projectId) => ({
                url: `/feedbacks/projects/${projectId}/export`,
                responseHandler: (response) => response.blob(),
            }),
        }),
    }),
    overrideExisting: false,
})

export const {
    useListFeedbacksQuery,
    useUpdateFeedbackStatusMutation,
    useDeleteFeedbackMutation,
    useLazyExportFeedbacksQuery,
} = feedbackApi;