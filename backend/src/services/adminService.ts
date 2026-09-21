import { prisma } from '../config/db';

export class AdminService {
  static async getStats() {
    const [totalUsers, totalAssessments, avgRiskScore] = await Promise.all([
      prisma.user.count(),
      prisma.riskAssessment.count(),
      prisma.riskAssessment.aggregate({
        _avg: { riskScore: true },
      }),
    ]);

    // Risk category distribution across entire platform
    const categoryCounts: Record<string, number> = {
      'LOW RISK': 0,
      'MODERATE RISK': 0,
      'HIGH RISK': 0,
      'VERY HIGH RISK': 0,
    };

    const allAssessments = await prisma.riskAssessment.findMany({
      select: { riskCategory: true, riskScore: true },
    });

    allAssessments.forEach((a) => {
      if (categoryCounts[a.riskCategory] !== undefined) {
        categoryCounts[a.riskCategory]++;
      }
    });

    const categoryDistribution = Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      totalUsers,
      totalAssessments,
      averagePlatformScore: avgRiskScore._avg.riskScore
        ? Math.round(avgRiskScore._avg.riskScore * 10) / 10
        : 0,
      categoryDistribution,
    };
  }

  static async getUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [total, users] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: { assessments: true },
          },
          profile: {
            select: {
              country: true,
              occupation: true,
              investmentGoal: true,
            },
          },
        },
      }),
    ]);

    return {
      users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateUserRole(userId: string, role: string) {
    if (role !== 'USER' && role !== 'ADMIN') {
      throw new Error('Invalid role. Must be USER or ADMIN.');
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return updated;
  }
}
