import { FeedbackStatus, FeedbackType } from "@echolayer/schema";

export interface feedbackResponse {
    items: {
        type: FeedbackType;
        title: string;
        content: string;
        id: string;
        status: FeedbackStatus;
        createdAt: Date;
        updatedAt: Date;
    }[];
    nextCursor: string | null | undefined;
    hasNextPage: boolean;
}

export interface feedback {
    title: string;
    id: string;
    status: FeedbackStatus;
    updatedAt: Date;
}