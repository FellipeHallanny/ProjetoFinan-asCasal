import { z } from 'zod';

export const createTransactionSchema = z.object({
  description: z.string().min(1),
  amount: z.number().positive(),
  date: z.string().datetime().optional(),
  type: z.enum(['INCOME', 'EXPENSE', 'GOAL_DEPOSIT']),
  categoryId: z.string().optional(),
  paidBy: z.string(),
  status: z.enum(['PENDING', 'PAID']),
  creditCardId: z.string().optional(),
  installments: z.number().int().min(1).optional()
});

export const updateTransactionSchema = createTransactionSchema.partial();
