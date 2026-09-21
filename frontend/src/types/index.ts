export type RiskCategory = 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK' | 'VERY HIGH RISK';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
  profile?: Profile | null;
}

export interface Profile {
  id?: string;
  userId?: string;
  age?: number | null;
  country?: string | null;
  occupation?: string | null;
  preferredCurrency?: string | null;
  monthlyIncome?: number | null;
  monthlyExpenses?: number | null;
  monthlySavings?: number | null;
  emergencyFund?: number | null;
  existingDebt?: number | null;
  existingInvestments?: number | null;
  investmentGoal?: string | null;
  investmentHorizon?: string | null;
  knowledgeLevel?: string | null;
  volatilityTolerance?: string | null;
  updatedAt?: string;
}

export interface RiskFactor {
  id?: string;
  assessmentId?: string;
  factorKey: string;
  factorName: string;
  score: number;
  weight: number;
  impact: 'POSITIVE' | 'NEUTRAL' | 'ATTENTION';
  explanation: string;
}

export interface RadarScores {
  financialCapacity: number;
  investmentHorizon: number;
  marketTolerance: number;
  experienceKnowledge: number;
  liquidityPosition: number;
}

export interface RiskAssessment {
  id: string;
  userId: string;
  riskScore: number;
  riskCategory: RiskCategory;
  confidenceNote?: string;
  investmentAmount: number;
  investmentGoal: string;
  investmentHorizon: string;
  age: number;
  income: number;
  expenses: number;
  savings: number;
  emergencyFund: number;
  debt: number;
  totalInvestments: number;
  investmentExperience: string;
  knowledgeLevel: string;
  volatilityTolerance: string;
  marketDownturnAction: string;
  capitalPreservationScore: number;
  positiveFactors: string[];
  attentionFactors: string[];
  recommendations: string[];
  radarScores?: RadarScores;
  createdAt: string;
  factors: RiskFactor[];
  user?: {
    id: string;
    name: string;
    email: string;
    profile?: Profile;
  };
}

export interface DashboardSummary {
  stats: {
    latestRiskScore: number | null;
    currentRiskCategory: string;
    totalAssessments: number;
    lastAssessmentDate: string | null;
    averageScore: number | null;
  };
  charts: {
    scoreTrend: Array<{
      id: string;
      date: string;
      formattedDate: string;
      score: number;
      category: string;
      goal: string;
    }>;
    categoryDistribution: Array<{
      name: string;
      value: number;
    }>;
    activityTrend: Array<{
      month: string;
      count: number;
    }>;
    factorBreakdown: Array<{
      factor: string;
      score: number;
      fullMark: number;
    }>;
  };
  profileSummary: {
    investmentGoal: string;
    investmentHorizon: string;
    knowledgeLevel: string;
    monthlyIncome: number;
    monthlySavings: number;
    preferredCurrency: string;
  };
  recentAssessments: Array<{
    id: string;
    date: string;
    riskScore: number;
    riskCategory: string;
    investmentGoal: string;
    investmentHorizon: string;
    investmentAmount: number;
  }>;
  latestAssessmentId: string | null;
}

export interface AdminStats {
  totalUsers: number;
  totalAssessments: number;
  averagePlatformScore: number;
  categoryDistribution: Array<{ name: string; value: number }>;
}
