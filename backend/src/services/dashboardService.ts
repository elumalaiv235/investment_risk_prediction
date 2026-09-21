import { prisma } from '../config/db';

export class DashboardService {
  static async getSummary(userId: string) {
    // 1. Fetch user & profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // 2. Fetch all assessments for user ordered by creation date
    const assessments = await prisma.riskAssessment.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      include: { factors: true },
    });

    const totalAssessments = assessments.length;
    const latestAssessment = totalAssessments > 0 ? assessments[totalAssessments - 1] : null;

    // 3. Compute score trend data
    const scoreTrend = assessments.map((a) => ({
      id: a.id,
      date: a.createdAt.toISOString().split('T')[0],
      formattedDate: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(a.createdAt),
      score: a.riskScore,
      category: a.riskCategory,
      goal: a.investmentGoal,
    }));

    // 4. Compute category distribution
    const categoryCounts: Record<string, number> = {
      'LOW RISK': 0,
      'MODERATE RISK': 0,
      'HIGH RISK': 0,
      'VERY HIGH RISK': 0,
    };

    assessments.forEach((a) => {
      if (categoryCounts[a.riskCategory] !== undefined) {
        categoryCounts[a.riskCategory]++;
      }
    });

    const categoryDistribution = Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // 5. Activity by month
    const monthlyActivity: Record<string, number> = {};
    assessments.forEach((a) => {
      const monthKey = a.createdAt.toISOString().slice(0, 7); // '2026-03'
      monthlyActivity[monthKey] = (monthlyActivity[monthKey] || 0) + 1;
    });

    const activityTrend = Object.entries(monthlyActivity).map(([month, count]) => ({
      month,
      count,
    }));

    // 6. Latest factor breakdown (Radar / Bar)
    let factorBreakdown: Array<{ factor: string; score: number; fullMark: number }> = [];
    if (latestAssessment && latestAssessment.factors.length > 0) {
      factorBreakdown = latestAssessment.factors.map((f) => ({
        factor: f.factorName,
        score: f.score,
        fullMark: 100,
      }));
    } else {
      factorBreakdown = [
        { factor: 'Financial Capacity', score: 0, fullMark: 100 },
        { factor: 'Investment Horizon', score: 0, fullMark: 100 },
        { factor: 'Market Tolerance', score: 0, fullMark: 100 },
        { factor: 'Knowledge & Literacy', score: 0, fullMark: 100 },
        { factor: 'Emergency Liquidity', score: 0, fullMark: 100 },
      ];
    }

    // 7. Recent assessments (latest 5 in reverse order)
    const recentAssessments = [...assessments].reverse().slice(0, 5).map((a) => ({
      id: a.id,
      date: a.createdAt,
      riskScore: a.riskScore,
      riskCategory: a.riskCategory,
      investmentGoal: a.investmentGoal,
      investmentHorizon: a.investmentHorizon,
      investmentAmount: a.investmentAmount,
    }));

    // 8. Stats summary
    const stats = {
      latestRiskScore: latestAssessment ? latestAssessment.riskScore : null,
      currentRiskCategory: latestAssessment ? latestAssessment.riskCategory : 'NO ASSESSMENTS',
      totalAssessments,
      lastAssessmentDate: latestAssessment ? latestAssessment.createdAt : null,
      averageScore:
        totalAssessments > 0
          ? Math.round(
              (assessments.reduce((sum, a) => sum + a.riskScore, 0) / totalAssessments) * 10
            ) / 10
          : null,
    };

    // 9. Profile snapshot
    const profileSummary = {
      investmentGoal: user.profile?.investmentGoal || 'Not Set',
      investmentHorizon: user.profile?.investmentHorizon || 'Not Set',
      knowledgeLevel: user.profile?.knowledgeLevel || 'Not Set',
      monthlyIncome: user.profile?.monthlyIncome || 0,
      monthlySavings: user.profile?.monthlySavings || 0,
      preferredCurrency: user.profile?.preferredCurrency || 'USD',
    };

    return {
      stats,
      charts: {
        scoreTrend,
        categoryDistribution,
        activityTrend,
        factorBreakdown,
      },
      profileSummary,
      recentAssessments,
      latestAssessmentId: latestAssessment?.id || null,
    };
  }
}
