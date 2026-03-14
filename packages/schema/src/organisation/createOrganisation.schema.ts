import { z } from 'zod';

export const CreateOrganisationSchema = z.object({
    name: z.string().min(2).max(150)
})

export type CreateOrganisationInputType = z.infer<typeof CreateOrganisationSchema>