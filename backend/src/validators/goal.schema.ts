import { z } from 'zod';

export const createGoalSchema = z.object({
  name: z.string().min(1),
  targetAmount: z.number().positive(),
  currentAmount: z.number().min(0).default(0),
  deadline: z.string().datetime().optional()
});

export const updateGoalSchema = createGoalSchema.partial();

export const depositGoalSchema = z.object({
  amount: z.number().positive(),
  description: z.string().optional()
});
