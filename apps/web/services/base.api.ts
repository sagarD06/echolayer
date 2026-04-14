import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/baseQuery";

export const baseApi = createApi({
    reducerPath: "api/v1",
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        "User",
        "Organisation",
        "OrganisationMembers",
        "Project",
        "ProjectMembers",
        "Feedback",
        "Invite",
        "Stats",
    ],
    endpoints: () => ({}),
});