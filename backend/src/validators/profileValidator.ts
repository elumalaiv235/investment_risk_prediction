import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional().nullable(),
  age: z.coerce.number().min(18).max(120).optional().nullable(),
  country: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  preferredCurrency: z.string().optional().nullable(),
  monthlyIncome: z.coerce.number().min(0, 'Income must be positive').optional().nullable(),
  monthlyExpenses: z.coerce.number().min(0, 'Expenses must be positive').optional().nullable(),
  monthlySavings: z.coerce.number().min(0, 'Savings must be positive').optional().nullable(),
  emergencyFund: z.coerce.number().min(0, 'Emergency fund must be positive').optional().nullable(),
  existingDebt: z.coerce.number().min(0, 'Existing debt must be positive').optional().nullable(),
  existingInvestments: z.coerce.number().min(0, 'Investments must be positive').optional().nullable(),
  investmentGoal: z.string().optional().nullable(),
  investmentHorizon: z.string().optional().nullable(),
  knowledgeLevel: z.string().optional().nullable(),
  volatilityTolerance: z.string().optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
