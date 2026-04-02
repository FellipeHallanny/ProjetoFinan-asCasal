import { z } from 'zod';

export const createFamilySchema = z.object({
  familyName: z.string().min(2, "Family name must be at least 2 characters"),
});

export const joinFamilySchema = z.object({
  inviteCode: z.string().min(5, "Invalid invite code"),
});
