import { z } from 'zod';

export const riskAssessmentSchema = z.object({
  // Section A - Personal Information
  age: z.coerce.number().min(18, 'Age must be at least 18').max(120, 'Age must be valid'),
  employmentStatus: z.string().default('Employed Full-Time'),
  income: z.coerce.number().min(0, 'Monthly income must be greater than or equal to 0'),
  expenses: z.coerce.number().min(0, 'Monthly expenses must be greater than or equal to 0'),
  savings: z.coerce.number().min(0, 'Monthly savings must be greater than or equal to 0'),

  // Section B - Financial Capacity
  emergencyFund: z.coerce.number().min(0, 'Emergency fund must be greater than or equal to 0'),
  debt: z.coerce.number().min(0, 'Existing debt must be greater than or equal to 0'),
  totalInvestments: z.coerce.number().min(0, 'Total investments must be greater than or equal to 0'),
  investmentAmount: z.coerce.number().min(1, 'Planned investment amount must be greater than 0'),
  percentageIncomeToInvest: z.coerce.number().min(0).max(100).optional().default(15),

  // Section C - Investment Goal
  investmentGoal: z.string().min(1, 'Investment goal is required'),

  // Section D - Investment Horizon
  investmentHorizon: z.string().min(1, 'Investment horizon is required'),

  // Section E - Investment Knowledge
  knowledgeLevel: z.string().min(1, 'Investment knowledge level is required'),

  // Section F - Volatility & Behavioral Tolerance
  volatilityTolerance: z.string().min(1, 'Volatility comfort rating is required'),
  marketDownturnAction: z.string().min(1, 'Downturn scenario reaction is required'),
  investmentExperience: z.string().optional().default('1-2 years'),
  capitalPreservationScore: z.coerce.number().min(1).max(10).optional().default(5),
  maxDownturnDuration: z.string().optional().default('1-3 years'),
  priorInvestmentExperience: z.boolean().optional().default(true),
});

export type RiskAssessmentInput = z.infer<typeof riskAssessmentSchema>;
