import {z} from "zod";
import { FeedbackStatusSchema } from "./createFeedback.schema";

export const UpdateFeedbackSchema = z.object({
    feedbackId: z.cuid(),
    status: FeedbackStatusSchema
})