import { z } from "zod";

export const createTeamSchema = z.object({
  description: z.string().max(500).optional(),
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "INVALID_SLUG_FORMAT"),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
