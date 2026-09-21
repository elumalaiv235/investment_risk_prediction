import { prisma } from '../config/db';
import { UpdateProfileInput } from '../validators/profileValidator';

export class ProfileService {
  static async getProfile(userId: string) {
    let profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    if (!profile) {
      // Auto-create blank profile if not existing
      profile = await prisma.profile.create({
        data: {
          userId,
          country: 'United States',
          preferredCurrency: 'USD',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
              createdAt: true,
            },
          },
        },
      });
    }

    // Compute profile completeness %
    let filledFields = 0;
    const totalFields = 12;
    if (profile.age) filledFields++;
    if (profile.country) filledFields++;
    if (profile.occupation) filledFields++;
    if (profile.monthlyIncome && profile.monthlyIncome > 0) filledFields++;
    if (profile.monthlyExpenses && profile.monthlyExpenses > 0) filledFields++;
    if (profile.monthlySavings && profile.monthlySavings > 0) filledFields++;
    if (profile.emergencyFund && profile.emergencyFund > 0) filledFields++;
    if (profile.existingDebt !== null) filledFields++;
    if (profile.existingInvestments && profile.existingInvestments > 0) filledFields++;
    if (profile.investmentGoal) filledFields++;
    if (profile.investmentHorizon) filledFields++;
    if (profile.knowledgeLevel) filledFields++;

    const completeness = Math.min(100, Math.round((filledFields / totalFields) * 100));

    // Also get user assessment summary for profile overview
    const assessmentStats = await prisma.riskAssessment.aggregate({
      where: { userId },
      _count: { id: true },
      _avg: { riskScore: true },
    });

    const latestAssessment = await prisma.riskAssessment.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        riskScore: true,
        riskCategory: true,
        createdAt: true,
      },
    });

    return {
      profile,
      completeness,
      stats: {
        totalAssessments: assessmentStats._count.id,
        averageScore: assessmentStats._avg.riskScore ? Math.round(assessmentStats._avg.riskScore * 10) / 10 : null,
        latestScore: latestAssessment?.riskScore || null,
        latestCategory: latestAssessment?.riskCategory || null,
        latestDate: latestAssessment?.createdAt || null,
      },
    };
  }

  static async updateProfile(userId: string, data: UpdateProfileInput) {
    const { name, phone, ...profileData } = data;

    // If name or phone updated, update User model as well
    if (name || phone !== undefined) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name ? { name } : {}),
          ...(phone !== undefined ? { phone: phone || null } : {}),
        },
      });
    }

    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      update: {
        ...(profileData.age !== undefined ? { age: profileData.age } : {}),
        ...(profileData.country !== undefined ? { country: profileData.country } : {}),
        ...(profileData.occupation !== undefined ? { occupation: profileData.occupation } : {}),
        ...(profileData.preferredCurrency !== undefined ? { preferredCurrency: profileData.preferredCurrency } : {}),
        ...(profileData.monthlyIncome !== undefined ? { monthlyIncome: profileData.monthlyIncome } : {}),
        ...(profileData.monthlyExpenses !== undefined ? { monthlyExpenses: profileData.monthlyExpenses } : {}),
        ...(profileData.monthlySavings !== undefined ? { monthlySavings: profileData.monthlySavings } : {}),
        ...(profileData.emergencyFund !== undefined ? { emergencyFund: profileData.emergencyFund } : {}),
        ...(profileData.existingDebt !== undefined ? { existingDebt: profileData.existingDebt } : {}),
        ...(profileData.existingInvestments !== undefined ? { existingInvestments: profileData.existingInvestments } : {}),
        ...(profileData.investmentGoal !== undefined ? { investmentGoal: profileData.investmentGoal } : {}),
        ...(profileData.investmentHorizon !== undefined ? { investmentHorizon: profileData.investmentHorizon } : {}),
        ...(profileData.knowledgeLevel !== undefined ? { knowledgeLevel: profileData.knowledgeLevel } : {}),
        ...(profileData.volatilityTolerance !== undefined ? { volatilityTolerance: profileData.volatilityTolerance } : {}),
      },
      create: {
        userId,
        ...profileData,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    return updatedProfile;
  }
}
