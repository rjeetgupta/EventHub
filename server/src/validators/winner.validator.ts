import { z } from "zod";

export const declareWinnersSchema = z.object({
  winners: z.array(
    z.object({
      userId: z.string().uuid(),
      position: z.number().int().positive(),
    })
  ).min(1),
});
