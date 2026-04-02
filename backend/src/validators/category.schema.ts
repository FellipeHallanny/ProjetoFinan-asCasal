import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  color: z.string().optional()
});

export const updateCategorySchema = createCategorySchema.partial();

export const suggestCategorySchema = z.object({
  description: z.string().min(1)
});
