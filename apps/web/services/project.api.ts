import { AddProjectMemberInput, CreateProjectInput, UpdateProjectInput, UpdateProjectMemberRoleInput } from "@echolayer/schema";
import { baseApi } from "./base.api";

import type { Project } from "@/types/dashboardType";

export interface ProjectMember {
    userId: string;
    projectId: string;
    role: "ADMIN" | "MEMBER";
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export interface UpdateProjectPayload {
    projectId: string;
    name: string;
}

export const projectApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query<Project[], void>({
            query: () => "/projects",
            providesTags: ["Project"],
        }),

        getProject: builder.query<Project, string>({
            query: (projectId) => `/projects/${projectId}`,
            providesTags: (_result, _err, id) => [{ type: "Project", id }],
        }),

        createProject: builder.mutation<Project, CreateProjectInput>({
            query: (body) => ({
                url: "/projects",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Project", "Stats"],
        }),

        updateProject: builder.mutation<Project, UpdateProjectInput>({
            query: ({ projectId, ...body }) => ({
                url: `/projects/${projectId}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _err, { projectId }) => [
                { type: "Project", id: projectId },
                "Project",
            ],
        }),

        deleteProject: builder.mutation<{ message: string }, string>({
            query: (projectId) => ({
                url: `/projects/${projectId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Project", "Stats"],
        }),

        getProjectMembers: builder.query<ProjectMember[], string>({
            query: (projectId) => `/projects/${projectId}/members`,
            providesTags: (_result, _err, projectId) => [
                { type: "ProjectMembers", id: projectId },
            ],
        }),

        addProjectMember: builder.mutation<
            ProjectMember,
            AddProjectMemberInput
        >({
            query: ({projectId, ...body }) => ({
                url: `/projects/${projectId}/members`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _err, { projectId }) => [
                { type: "ProjectMembers", id: projectId },
            ],
        }),

        updateProjectMemberRole: builder.mutation<
            ProjectMember,
            UpdateProjectMemberRoleInput
        >({
            query: ({ projectId, userId, ...body }) => ({
                url: `/projects/${projectId}/members/${userId}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _err, { projectId }) => [
                { type: "ProjectMembers", id: projectId },
            ],
        }),

        removeProjectMember: builder.mutation<
            { message: string },
            { projectId: string; userId: string }
        >({
            query: ({ projectId, userId }) => ({
                url: `/projects/${projectId}/members/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _err, { projectId }) => [
                { type: "ProjectMembers", id: projectId },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetProjectsQuery,
    useGetProjectQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useGetProjectMembersQuery,
    useAddProjectMemberMutation,
    useUpdateProjectMemberRoleMutation,
    useRemoveProjectMemberMutation,
} = projectApi;