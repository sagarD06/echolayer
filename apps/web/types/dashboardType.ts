import type { IUser } from "./userTypes";

export type { IUser };

export interface Organisation {
    id: string;
    name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Project {
    id: string;
    name: string;
    organisationId: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export type FeedbackStatus = "OPEN" | "PLANNED" | "IN_PROGRESS" | "COMPLETED";
export type FeedbackType = "IDEA" | "SUGGESTION" | "PROBLEM" | "QUESTION" | "PRAISE";

export interface Feedback {
    id: string;
    title: string;
    content: string;
    type: FeedbackType;
    status: FeedbackStatus;
    projectId: string;
    organisationId: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrgStats {
    totalFeedbacks: number,
    totalMembers: number,
    totalProjects: number,
    feedbackByType: Record<string, number>,
    feedbackByStatus: Record<string, number>,
    mostActiveProjects: {
        id: string;
        name: string;
        count: number;
    }[],
    feedbackTrend: {
        date: string | undefined;
        count: number;
    }[],
}

export interface ProjectStats {
    totalFeedbacks: number;
    openFeedbacks: number;
    resolvedFeedbacks: number;
    feedbacksByType: Record<FeedbackType, number>;
    feedbacksByStatus: Record<FeedbackStatus, number>;
}