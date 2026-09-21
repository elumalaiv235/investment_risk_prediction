import { prisma } from '../config/db';
import { RiskAssessmentInput } from '../validators/riskValidator';
import { RiskPredictionService } from './riskPredictionService';

export interface HistoryQueryOptions {
  page?: number;
  limit?: number;
  category?: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class RiskService {
  static async predictAndSave(userId: string, input: RiskAssessmentInput) {
    // Run prediction engine
    const prediction = RiskPredictionService.predict({
      age: input.age,
      income: input.income,
      expenses: input.expenses,
      savings: input.savings,
      emergencyFund: input.emergencyFund,
      debt: input.debt,
      totalInvestments: input.totalInvestments,
      investmentAmount: input.investmentAmount,
      investmentGoal: input.investmentGoal,
      investmentHorizon: input.investmentHorizon,
      knowledgeLevel: input.knowledgeLevel,
      volatilityTolerance: input.volatilityTolerance,
      marketDownturnAction: input.marketDownturnAction,
      capitalPreservationScore: input.capitalPreservationScore,
      investmentExperience: input.investmentExperience,
      employmentStatus: input.employmentStatus,
    });

    // Save assessment and nested factors in a transaction
    const assessment = await prisma.riskAssessment.create({
      data: {
        userId,
        riskScore: prediction.riskScore,
        riskCategory: prediction.riskCategory,
        confidenceNote: prediction.confidenceNote,
        investmentAmount: input.investmentAmount,
        investmentGoal: input.investmentGoal,
        investmentHorizon: input.investmentHorizon,
        age: input.age,
        income: input.income,
        expenses: input.expenses,
        savings: input.savings,
        emergencyFund: input.emergencyFund,
        debt: input.debt,
        totalInvestments: input.totalInvestments,
        investmentExperience: input.investmentExperience || '1-2 years',
        knowledgeLevel: input.knowledgeLevel,
        volatilityTolerance: input.volatilityTolerance,
        marketDownturnAction: input.marketDownturnAction,
        capitalPreservationScore: input.capitalPreservationScore || 5,
        positiveFactors: JSON.stringify(prediction.positiveFactors),
        attentionFactors: JSON.stringify(prediction.attentionFactors),
        recommendations: JSON.stringify(prediction.recommendations),
        factors: {
          create: prediction.factors.map((f) => ({
            factorKey: f.factorKey,
            factorName: f.factorName,
            score: f.score,
            weight: f.weight,
            impact: f.impact,
            explanation: f.explanation,
          })),
        },
      },
      include: {
        factors: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Optionally update user's profile with latest financial inputs
    await prisma.profile.upsert({
      where: { userId },
      update: {
        age: input.age,
        monthlyIncome: input.income,
        monthlyExpenses: input.expenses,
        monthlySavings: input.savings,
        emergencyFund: input.emergencyFund,
        existingDebt: input.debt,
        existingInvestments: input.totalInvestments,
        investmentGoal: input.investmentGoal,
        investmentHorizon: input.investmentHorizon,
        knowledgeLevel: input.knowledgeLevel,
        volatilityTolerance: input.marketDownturnAction,
      },
      create: {
        userId,
        age: input.age,
        monthlyIncome: input.income,
        monthlyExpenses: input.expenses,
        monthlySavings: input.savings,
        emergencyFund: input.emergencyFund,
        existingDebt: input.debt,
        existingInvestments: input.totalInvestments,
        investmentGoal: input.investmentGoal,
        investmentHorizon: input.investmentHorizon,
        knowledgeLevel: input.knowledgeLevel,
        volatilityTolerance: input.marketDownturnAction,
      },
    });

    return {
      ...assessment,
      positiveFactors: prediction.positiveFactors,
      attentionFactors: prediction.attentionFactors,
      recommendations: prediction.recommendations,
      radarScores: prediction.radarScores,
    };
  }

  static async getHistory(userId: string, options: HistoryQueryOptions) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(50, Math.max(1, options.limit || 10));
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (options.category && options.category !== 'ALL') {
      where.riskCategory = options.category;
    }

    if (options.goal && options.goal !== 'ALL') {
      where.investmentGoal = { contains: options.goal };
    }

    if (options.startDate || options.endDate) {
      where.createdAt = {};
      if (options.startDate) {
        where.createdAt.gte = new Date(options.startDate);
      }
      if (options.endDate) {
        where.createdAt.lte = new Date(options.endDate);
      }
    }

    if (options.search) {
      where.OR = [
        { investmentGoal: { contains: options.search } },
        { investmentHorizon: { contains: options.search } },
        { riskCategory: { contains: options.search } },
      ];
    }

    const orderBy: any = {};
    const sortField = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder === 'asc' ? 'asc' : 'desc';
    orderBy[sortField] = sortOrder;

    const [total, assessments] = await Promise.all([
      prisma.riskAssessment.count({ where }),
      prisma.riskAssessment.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          factors: true,
        },
      }),
    ]);

    const formattedAssessments = assessments.map((a) => ({
      ...a,
      positiveFactors: a.positiveFactors ? JSON.parse(a.positiveFactors) : [],
      attentionFactors: a.attentionFactors ? JSON.parse(a.attentionFactors) : [],
      recommendations: a.recommendations ? JSON.parse(a.recommendations) : [],
    }));

    return {
      assessments: formattedAssessments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(userId: string, assessmentId: string, role: string) {
    const assessment = await prisma.riskAssessment.findUnique({
      where: { id: assessmentId },
      include: {
        factors: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true,
          },
        },
      },
    });

    if (!assessment) {
      throw new Error('Assessment not found.');
    }

    // Security check: User can only access their own assessments unless admin
    if (assessment.userId !== userId && role !== 'ADMIN') {
      throw new Error('Access denied: You do not have permission to view this assessment.');
    }

    // Reconstruct radar scores from factors
    const financialCapacityFactor = assessment.factors.find((f) => f.factorKey === 'financial_capacity');
    const horizonFactor = assessment.factors.find((f) => f.factorKey === 'investment_horizon');
    const volatilityFactor = assessment.factors.find((f) => f.factorKey === 'volatility_tolerance');
    const knowledgeFactor = assessment.factors.find((f) => f.factorKey === 'investment_knowledge');
    const emergencyFactor = assessment.factors.find((f) => f.factorKey === 'emergency_savings');

    const radarScores = {
      financialCapacity: financialCapacityFactor ? financialCapacityFactor.score : 60,
      investmentHorizon: horizonFactor ? horizonFactor.score : 60,
      marketTolerance: volatilityFactor ? volatilityFactor.score : 60,
      experienceKnowledge: knowledgeFactor ? knowledgeFactor.score : 60,
      liquidityPosition: emergencyFactor ? emergencyFactor.score : 60,
    };

    return {
      ...assessment,
      positiveFactors: assessment.positiveFactors ? JSON.parse(assessment.positiveFactors) : [],
      attentionFactors: assessment.attentionFactors ? JSON.parse(assessment.attentionFactors) : [],
      recommendations: assessment.recommendations ? JSON.parse(assessment.recommendations) : [],
      radarScores,
    };
  }

  static async deleteById(userId: string, assessmentId: string, role: string) {
    const assessment = await prisma.riskAssessment.findUnique({
      where: { id: assessmentId },
    });

    if (!assessment) {
      throw new Error('Assessment not found.');
    }

    // Security check
    if (assessment.userId !== userId && role !== 'ADMIN') {
      throw new Error('Access denied: You do not have permission to delete this assessment.');
    }

    await prisma.riskAssessment.delete({
      where: { id: assessmentId },
    });

    return { id: assessmentId };
  }
}
