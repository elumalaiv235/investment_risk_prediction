import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for RiskWise...');

  // Clean existing records
  await prisma.riskFactor.deleteMany();
  await prisma.riskAssessment.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const saltRounds = 10;
  const adminPasswordHash = await bcrypt.hash('Admin@12345', saltRounds);
  const demoPasswordHash = await bcrypt.hash('Demo@12345', saltRounds);

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Sarah Chen (Admin)',
      email: 'admin@riskwise.com',
      passwordHash: adminPasswordHash,
      phone: '+1 (555) 019-2834',
      role: 'ADMIN',
      profile: {
        create: {
          age: 42,
          country: 'United States',
          occupation: 'Portfolio Strategist',
          preferredCurrency: 'USD',
          monthlyIncome: 18000,
          monthlyExpenses: 6500,
          monthlySavings: 8000,
          emergencyFund: 65000,
          existingDebt: 0,
          existingInvestments: 420000,
          investmentGoal: 'Wealth Creation',
          investmentHorizon: 'More than 10 years',
          knowledgeLevel: 'Expert',
          volatilityTolerance: 'Invest more',
        },
      },
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // 2. Create Demo User
  const demoUser = await prisma.user.create({
    data: {
      name: 'Alex Morgan',
      email: 'demo@riskwise.com',
      passwordHash: demoPasswordHash,
      phone: '+1 (555) 438-9921',
      role: 'USER',
      profile: {
        create: {
          age: 32,
          country: 'United States',
          occupation: 'Senior Product Designer',
          preferredCurrency: 'USD',
          monthlyIncome: 9500,
          monthlyExpenses: 4200,
          monthlySavings: 3000,
          emergencyFund: 28000,
          existingDebt: 12000,
          existingInvestments: 85000,
          investmentGoal: 'Wealth Creation',
          investmentHorizon: '5-10 years',
          knowledgeLevel: 'Intermediate',
          volatilityTolerance: 'Hold and wait',
        },
      },
    },
  });
  console.log(`✅ Demo User created: ${demoUser.email}`);

  // 3. Create realistic historical assessments for Demo User across previous months
  const assessmentHistory = [
    {
      date: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), // ~5 months ago
      score: 54.0,
      category: 'MODERATE RISK',
      amount: 15000,
      goal: 'Wealth Creation',
      horizon: '3-5 years',
      age: 31,
      income: 8200,
      expenses: 4500,
      savings: 2000,
      emergencyFund: 15000,
      debt: 18000,
      totalInvestments: 45000,
      experience: '1-2 years',
      knowledge: 'Basic',
      volatility: 'Hold and wait',
      marketAction: 'Hold and wait',
      preservation: 6,
      positiveFactors: [
        'Age & Life Stage: At 31 years old, your extensive timeline allows higher capacity to compound.',
        'Financial Capacity: Solid monthly surplus supports balanced risk allocation.',
      ],
      attentionFactors: [
        'Debt-to-Asset Burden: Existing debt commitments reduce net risk tolerance.',
        'Market Literacy: Basic knowledge suggests sticking with diversified index funds.',
      ],
      recommendations: [
        'Focus on accelerating repayment of high-interest debt.',
        'Consider a 60/40 balanced stock and bond allocation.',
      ],
    },
    {
      date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // ~3 months ago
      score: 62.5,
      category: 'HIGH RISK',
      amount: 25000,
      goal: 'Wealth Creation',
      horizon: '5-10 years',
      age: 32,
      income: 8800,
      expenses: 4300,
      savings: 2500,
      emergencyFund: 20000,
      debt: 15000,
      totalInvestments: 60000,
      experience: '3-5 years',
      knowledge: 'Intermediate',
      volatility: 'Hold and wait',
      marketAction: 'Hold and wait',
      preservation: 5,
      positiveFactors: [
        'Time Horizon: 5-10 year horizon gives strong buffer against cyclical volatility.',
        'Emergency Liquidity: 4.6 months of living expenses covered in cash.',
      ],
      attentionFactors: [
        'Volatility Tolerance: Ensure allocation matches emotional ability to withstand a 20% draw.',
      ],
      recommendations: [
        'Maintain automated monthly contributions to global equity funds.',
        'Expand emergency reserve to reach full 6 months.',
      ],
    },
    {
      date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // ~1 month ago
      score: 69.0,
      category: 'HIGH RISK',
      amount: 35000,
      goal: 'Wealth Creation',
      horizon: '5-10 years',
      age: 32,
      income: 9500,
      expenses: 4200,
      savings: 3000,
      emergencyFund: 25000,
      debt: 12000,
      totalInvestments: 75000,
      experience: '3-5 years',
      knowledge: 'Intermediate',
      volatility: 'Invest more',
      marketAction: 'Invest more',
      preservation: 4,
      positiveFactors: [
        'Behavioral Resilience: Willing to opportunistically invest more during market dips.',
        'Emergency Reserve: Over 5.9 months of expenses covered in liquid funds.',
      ],
      attentionFactors: [
        'Periodic Rebalancing: High equity concentration requires discipline during rallies.',
      ],
      recommendations: [
        'Establish automated dollar cost averaging.',
        'Set up annual portfolio rebalancing triggers.',
      ],
    },
    {
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      score: 73.5,
      category: 'HIGH RISK',
      amount: 50000,
      goal: 'Wealth Creation',
      horizon: 'More than 10 years',
      age: 32,
      income: 9500,
      expenses: 4200,
      savings: 3000,
      emergencyFund: 28000,
      debt: 12000,
      totalInvestments: 85000,
      experience: '3-5 years',
      knowledge: 'Intermediate',
      volatility: 'Invest more',
      marketAction: 'Invest more',
      preservation: 4,
      positiveFactors: [
        '10+ Year Time Horizon: Superior timeframe to harness compound growth.',
        'Strong Liquid Runway: 6.6 months of emergency reserves prevents distress sales.',
        'High Volatility Tolerance: Behavioral readiness to capitalize on market corrections.',
      ],
      attentionFactors: [
        'Debt Management: Maintain steady principal reduction alongside equity investing.',
      ],
      recommendations: [
        'Construct a core-satellite portfolio with 75-80% global low-cost equities.',
        'Rebalance annually to lock in gains and manage sector concentration.',
        'Automate dollar-cost averaging into tax-advantaged accounts.',
      ],
    },
  ];

  for (const item of assessmentHistory) {
    const assessment = await prisma.riskAssessment.create({
      data: {
        userId: demoUser.id,
        riskScore: item.score,
        riskCategory: item.category,
        confidenceNote: 'Assessment calibrated with 9 quantitative and behavioral dimensions.',
        investmentAmount: item.amount,
        investmentGoal: item.goal,
        investmentHorizon: item.horizon,
        age: item.age,
        income: item.income,
        expenses: item.expenses,
        savings: item.savings,
        emergencyFund: item.emergencyFund,
        debt: item.debt,
        totalInvestments: item.totalInvestments,
        investmentExperience: item.experience,
        knowledgeLevel: item.knowledge,
        volatilityTolerance: item.volatility,
        marketDownturnAction: item.marketAction,
        capitalPreservationScore: item.preservation,
        positiveFactors: JSON.stringify(item.positiveFactors),
        attentionFactors: JSON.stringify(item.attentionFactors),
        recommendations: JSON.stringify(item.recommendations),
        createdAt: item.date,
        factors: {
          create: [
            {
              factorKey: 'financial_capacity',
              factorName: 'Financial Capacity & Cashflow',
              score: 75,
              weight: 0.2,
              impact: 'POSITIVE',
              explanation: 'Strong cashflow surplus provides strong risk cushion.',
            },
            {
              factorKey: 'emergency_savings',
              factorName: 'Emergency Liquidity',
              score: 82,
              weight: 0.15,
              impact: 'POSITIVE',
              explanation: '6+ months of expenses covered in cash reserves.',
            },
            {
              factorKey: 'investment_horizon',
              factorName: 'Investment Time Horizon',
              score: 85,
              weight: 0.15,
              impact: 'POSITIVE',
              explanation: 'Extended timeframe to recover from cyclical market drawdowns.',
            },
            {
              factorKey: 'volatility_tolerance',
              factorName: 'Psychological Volatility Tolerance',
              score: 80,
              weight: 0.1,
              impact: 'POSITIVE',
              explanation: 'Willing to buy and hold through market downturns.',
            },
            {
              factorKey: 'debt_level',
              factorName: 'Debt-to-Asset Burden',
              score: 65,
              weight: 0.1,
              impact: 'NEUTRAL',
              explanation: 'Moderate manageable debt commitments.',
            },
            {
              factorKey: 'investment_knowledge',
              factorName: 'Market Knowledge & Literacy',
              score: 70,
              weight: 0.1,
              impact: 'POSITIVE',
              explanation: 'Intermediate asset familiarity.',
            },
            {
              factorKey: 'age_life_stage',
              factorName: 'Age & Life Stage',
              score: 88,
              weight: 0.1,
              impact: 'POSITIVE',
              explanation: 'Young accumulation life phase.',
            },
            {
              factorKey: 'investment_goal',
              factorName: 'Primary Objective Orientation',
              score: 90,
              weight: 0.05,
              impact: 'POSITIVE',
              explanation: 'Growth-oriented wealth creation target.',
            },
            {
              factorKey: 'past_experience',
              factorName: 'Historical Experience',
              score: 68,
              weight: 0.05,
              impact: 'NEUTRAL',
              explanation: '3-5 years active investing experience.',
            },
          ],
        },
      },
    });
  }

  console.log(`✅ Created 4 historical assessments for demo user (${demoUser.email})`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
