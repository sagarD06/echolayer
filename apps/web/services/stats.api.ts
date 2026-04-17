import { baseApi } from "./base.api";

import type { OrgStats, ProjectStats } from "@/types/dashboardType";

export const statsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrgStats: builder.query<OrgStats, void>({
            query: () => "/stats/org",
            providesTags: ["Stats"],
        }),

        getProjectStats: builder.query<ProjectStats, string>({
            query: (projectId) => `/stats/${projectId}`,
            providesTags: (_result, _err, projectId) => [
                { type: "Stats", id: projectId },
            ],
        }),
    }),
    overrideExisting: false,
});

export const { useGetOrgStatsQuery, useGetProjectStatsQuery } = statsApi;