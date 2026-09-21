export interface AssessmentInputData {
  age: number;
  income: number;
  expenses: number;
  savings: number;
  emergencyFund: number;
  debt: number;
  totalInvestments: number;
  investmentAmount: number;
  investmentGoal: string;
  investmentHorizon: string;
  knowledgeLevel: string;
  volatilityTolerance: string;
  marketDownturnAction: string;
  capitalPreservationScore?: number; // 1 (lowest priority) to 10 (highest priority)
  investmentExperience?: string; // 'None' | '1-2 years' | '3-5 years' | '5+ years'
  employmentStatus?: string;
}

export interface FactorResult {
  factorKey: string;
  factorName: string;
  score: number; // 0 - 100
  weight: number; // 0.0 - 1.0
  weightedScore: number;
  impact: 'POSITIVE' | 'NEUTRAL' | 'ATTENTION';
  explanation: string;
}

export interface PredictionResult {
  riskScore: number;
  riskCategory: 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK' | 'VERY HIGH RISK';
  confidenceNote: string;
  factors: FactorResult[];
  positiveFactors: string[];
  attentionFactors: string[];
  recommendations: string[];
  radarScores: {
    financialCapacity: number;
    investmentHorizon: number;
    marketTolerance: number;
    experienceKnowledge: number;
    liquidityPosition: number;
  };
}

export interface IRiskPredictionModel {
  predict(input: AssessmentInputData): PredictionResult;
}

export class RuleBasedRiskPredictionModel implements IRiskPredictionModel {
  // Configurable category thresholds
  public static readonly THRESHOLDS = {
    LOW_MAX: 30,
    MODERATE_MAX: 60,
    HIGH_MAX: 80,
    VERY_HIGH_MAX: 100,
  };

  public predict(input: AssessmentInputData): PredictionResult {
    const factors: FactorResult[] = [];

    // 1. Age / Life Stage (Weight: 10%)
    const ageScore = this.calculateAgeScore(input.age);
    factors.push({
      factorKey: 'age_life_stage',
      factorName: 'Age & Life Stage',
      score: ageScore,
      weight: 0.10,
      weightedScore: ageScore * 0.10,
      impact: ageScore >= 75 ? 'POSITIVE' : ageScore < 40 ? 'ATTENTION' : 'NEUTRAL',
      explanation:
        input.age < 35
          ? `At ${input.age} years old, your extensive timeline allows higher capacity to compound and recover from cyclical downturns.`
          : input.age <= 50
          ? `At ${input.age} years old, you are in peak earning years with balanced risk capacity.`
          : `At ${input.age} years old, wealth preservation and downside protection become increasingly prudent.`,
    });

    // 2. Financial Capacity (Weight: 20%)
    const capacityScore = this.calculateFinancialCapacityScore(input);
    factors.push({
      factorKey: 'financial_capacity',
      factorName: 'Financial Capacity & Cashflow',
      score: capacityScore,
      weight: 0.20,
      weightedScore: capacityScore * 0.20,
      impact: capacityScore >= 70 ? 'POSITIVE' : capacityScore < 45 ? 'ATTENTION' : 'NEUTRAL',
      explanation:
        capacityScore >= 70
          ? 'Strong monthly surplus and healthy savings rate provide a resilient foundation for volatile assets.'
          : capacityScore >= 45
          ? 'Adequate monthly cashflow supports a balanced allocation with managed risk exposure.'
          : 'Tight monthly cash surplus limits capacity to absorb sudden financial shocks without liquidating investments.',
    });

    // 3. Emergency Savings (Weight: 15%)
    const emergencyMonths = input.expenses > 0 ? input.emergencyFund / input.expenses : (input.emergencyFund > 0 ? 6 : 0);
    const emergencyScore = this.calculateEmergencyScore(emergencyMonths);
    factors.push({
      factorKey: 'emergency_savings',
      factorName: 'Emergency Liquidity',
      score: emergencyScore,
      weight: 0.15,
      weightedScore: emergencyScore * 0.15,
      impact: emergencyScore >= 75 ? 'POSITIVE' : emergencyScore < 50 ? 'ATTENTION' : 'NEUTRAL',
      explanation:
        emergencyMonths >= 6
          ? `Robust liquid emergency reserve (${emergencyMonths.toFixed(1)} months of expenses) prevents forced selling during market dips.`
          : emergencyMonths >= 3
          ? `Moderate liquidity buffer (${emergencyMonths.toFixed(1)} months). Maintaining 6+ months will further fortify your risk resilience.`
          : `Limited emergency reserves (${emergencyMonths.toFixed(1)} months) increases vulnerability to unexpected liquidity needs.`,
    });

    // 4. Debt Level (Weight: 10%)
    const debtScore = this.calculateDebtScore(input.debt, input.income, input.totalInvestments);
    factors.push({
      factorKey: 'debt_level',
      factorName: 'Debt-to-Asset Burden',
      score: debtScore,
      weight: 0.10,
      weightedScore: debtScore * 0.10,
      impact: debtScore >= 75 ? 'POSITIVE' : debtScore < 45 ? 'ATTENTION' : 'NEUTRAL',
      explanation:
        debtScore >= 75
          ? 'Low debt liabilities allow flexible capital deployment and high risk bearing ability.'
          : debtScore >= 45
          ? 'Manageable debt commitments require mindful asset liability matching.'
          : 'High debt obligations reduce risk capacity; consider deleveraging alongside investing.',
    });

    // 5. Investment Horizon (Weight: 15%)
    const horizonScore = this.calculateHorizonScore(input.investmentHorizon);
    factors.push({
      factorKey: 'investment_horizon',
      factorName: 'Investment Time Horizon',
      score: horizonScore,
      weight: 0.15,
      weightedScore: horizonScore * 0.15,
      impact: horizonScore >= 75 ? 'POSITIVE' : horizonScore < 45 ? 'ATTENTION' : 'NEUTRAL',
      explanation:
        horizonScore >= 75
          ? `Long investment horizon (${input.investmentHorizon}) provides ample runway to ride through broader market cycles.`
          : horizonScore >= 50
          ? `Medium investment horizon (${input.investmentHorizon}) calls for balanced growth and capital stability.`
          : `Short investment horizon (${input.investmentHorizon}) necessitates prioritizing capital stability over aggressive growth.`,
    });

    // 6. Investment Knowledge (Weight: 10%)
    const knowledgeScore = this.calculateKnowledgeScore(input.knowledgeLevel);
    factors.push({
      factorKey: 'investment_knowledge',
      factorName: 'Market Knowledge & Literacy',
      score: knowledgeScore,
      weight: 0.10,
      weightedScore: knowledgeScore * 0.10,
      impact: knowledgeScore >= 70 ? 'POSITIVE' : knowledgeScore < 45 ? 'ATTENTION' : 'NEUTRAL',
      explanation:
        knowledgeScore >= 70
          ? `Advanced financial literacy (${input.knowledgeLevel}) enables sophisticated risk appraisal and portfolio navigation.`
          : knowledgeScore >= 45
          ? `Intermediate investment familiarity (${input.knowledgeLevel}) supports diversified standard asset classes.`
          : `Early-stage investment knowledge (${input.knowledgeLevel}); starting with broad index funds and low-volatility assets is recommended.`,
    });

    // 7. Volatility Tolerance (Weight: 10%)
    const volatilityScore = this.calculateVolatilityScore(input.marketDownturnAction, input.volatilityTolerance);
    factors.push({
      factorKey: 'volatility_tolerance',
      factorName: 'Psychological Volatility Tolerance',
      score: volatilityScore,
      weight: 0.10,
      weightedScore: volatilityScore * 0.10,
      impact: volatilityScore >= 70 ? 'POSITIVE' : volatilityScore < 45 ? 'ATTENTION' : 'NEUTRAL',
      explanation:
        volatilityScore >= 70
          ? `High psychological resilience: willing to "${input.marketDownturnAction}" during market downturns.`
          : volatilityScore >= 45
          ? `Balanced behavioral approach: responds cautiously to market volatility.`
          : 'High sensitivity to short-term paper losses; conservative asset allocation helps avoid emotional panic selling.',
    });

    // 8. Investment Goal (Weight: 5%)
    const goalScore = this.calculateGoalScore(input.investmentGoal);
    factors.push({
      factorKey: 'investment_goal',
      factorName: 'Primary Objective Orientation',
      score: goalScore,
      weight: 0.05,
      weightedScore: goalScore * 0.05,
      impact: goalScore >= 70 ? 'POSITIVE' : 'NEUTRAL',
      explanation: `Targeting "${input.investmentGoal}" aligns with a ${goalScore >= 70 ? 'growth-focused' : 'preservation-oriented'} mandate.`,
    });

    // 9. Past Experience & Capital Preservation (Weight: 5%)
    const expScore = this.calculateExperienceScore(input.investmentExperience, input.capitalPreservationScore);
    factors.push({
      factorKey: 'past_experience',
      factorName: 'Historical Experience & Capital Priority',
      score: expScore,
      weight: 0.05,
      weightedScore: expScore * 0.05,
      impact: expScore >= 70 ? 'POSITIVE' : expScore < 40 ? 'ATTENTION' : 'NEUTRAL',
      explanation: `Prior experience (${input.investmentExperience || 'Moderate'}) and capital preservation priority level (${input.capitalPreservationScore || 5}/10) contextualize risk readiness.`,
    });

    // Total Normalized Score (0 - 100)
    const rawTotalScore = factors.reduce((sum, f) => sum + f.weightedScore, 0);
    const finalScore = Math.min(100, Math.max(0, Math.round(rawTotalScore * 10) / 10));

    // Determine Category
    let riskCategory: 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK' | 'VERY HIGH RISK';
    if (finalScore <= RuleBasedRiskPredictionModel.THRESHOLDS.LOW_MAX) {
      riskCategory = 'LOW RISK';
    } else if (finalScore <= RuleBasedRiskPredictionModel.THRESHOLDS.MODERATE_MAX) {
      riskCategory = 'MODERATE RISK';
    } else if (finalScore <= RuleBasedRiskPredictionModel.THRESHOLDS.HIGH_MAX) {
      riskCategory = 'HIGH RISK';
    } else {
      riskCategory = 'VERY HIGH RISK';
    }

    // Extract Positive & Attention Factors
    const positiveFactors = factors
      .filter((f) => f.impact === 'POSITIVE')
      .map((f) => `${f.factorName}: ${f.explanation}`);

    const attentionFactors = factors
      .filter((f) => f.impact === 'ATTENTION')
      .map((f) => `${f.factorName}: ${f.explanation}`);

    // Generate Tailored Recommendations
    const recommendations = this.generateRecommendations(input, factors, riskCategory);

    // Confidence Note
    const confidenceNote = `Assessment calibrated with ${factors.length} quantitative and behavioral variables with high statistical consistency.`;

    // High level radar scores for visual charts
    const radarScores = {
      financialCapacity: capacityScore,
      investmentHorizon: horizonScore,
      marketTolerance: volatilityScore,
      experienceKnowledge: Math.round((knowledgeScore + expScore) / 2),
      liquidityPosition: Math.round((emergencyScore + (debtScore >= 60 ? 80 : 40)) / 2),
    };

    return {
      riskScore: finalScore,
      riskCategory,
      confidenceNote,
      factors,
      positiveFactors: positiveFactors.length > 0 ? positiveFactors : ['Stable baseline financial capacity.'],
      attentionFactors: attentionFactors.length > 0 ? attentionFactors : ['Maintain regular rebalancing to stay aligned with goals.'],
      recommendations,
      radarScores,
    };
  }

  // --- Scoring Helpers ---

  private calculateAgeScore(age: number): number {
    if (age < 25) return 95;
    if (age <= 35) return 88;
    if (age <= 45) return 72;
    if (age <= 55) return 55;
    if (age <= 65) return 38;
    return 22;
  }

  private calculateFinancialCapacityScore(input: AssessmentInputData): number {
    const netIncome = Math.max(0, input.income - input.expenses);
    const savingsRatio = input.income > 0 ? netIncome / input.income : 0;
    const investPlannedRatio = input.income > 0 ? input.investmentAmount / (input.income * 12) : 0;

    let score = 50;
    if (savingsRatio >= 0.4) score += 30;
    else if (savingsRatio >= 0.2) score += 20;
    else if (savingsRatio >= 0.1) score += 10;
    else score -= 20;

    if (input.totalInvestments > input.income * 2) score += 15;
    if (investPlannedRatio > 1.0) score -= 10; // Overleveraging planned investment relative to annual income

    return Math.min(100, Math.max(10, score));
  }

  private calculateEmergencyScore(months: number): number {
    if (months >= 12) return 98;
    if (months >= 6) return 88;
    if (months >= 3) return 65;
    if (months >= 1) return 40;
    return 15;
  }

  private calculateDebtScore(debt: number, income: number, investments: number): number {
    if (debt <= 0) return 98;
    const annualIncome = income * 12;
    const debtToIncome = annualIncome > 0 ? debt / annualIncome : 1.0;
    const debtToInvestments = investments > 0 ? debt / investments : 1.5;

    if (debtToIncome < 0.1 && debtToInvestments < 0.2) return 85;
    if (debtToIncome < 0.3) return 68;
    if (debtToIncome < 0.6) return 45;
    return 20;
  }

  private calculateHorizonScore(horizon: string): number {
    switch (horizon.toLowerCase()) {
      case 'more than 10 years':
      case '10+ years':
      case '> 10 years':
        return 95;
      case '5-10 years':
      case '5–10 years':
        return 82;
      case '3-5 years':
      case '3–5 years':
        return 62;
      case '1-3 years':
      case '1–3 years':
        return 40;
      case 'less than 1 year':
      case '< 1 year':
      default:
        return 18;
    }
  }

  private calculateKnowledgeScore(knowledge: string): number {
    switch (knowledge.toLowerCase()) {
      case 'expert':
        return 98;
      case 'advanced':
        return 85;
      case 'intermediate':
        return 68;
      case 'basic':
        return 45;
      case 'beginner':
      default:
        return 25;
    }
  }

  private calculateVolatilityScore(action: string, tolerance: string): number {
    let score = 50;

    switch (action.toLowerCase()) {
      case 'invest more':
        score += 35;
        break;
      case 'hold and wait':
        score += 18;
        break;
      case 'not sure':
        score -= 5;
        break;
      case 'sell part of the investment':
      case 'sell part':
        score -= 20;
        break;
      case 'sell immediately':
        score -= 35;
        break;
      default:
        break;
    }

    if (tolerance.toLowerCase().includes('high') || tolerance.toLowerCase().includes('very comfortable')) {
      score += 15;
    } else if (tolerance.toLowerCase().includes('low') || tolerance.toLowerCase().includes('uncomfortable')) {
      score -= 15;
    }

    return Math.min(100, Math.max(10, score));
  }

  private calculateGoalScore(goal: string): number {
    switch (goal.toLowerCase()) {
      case 'wealth creation':
      case 'aggressive growth':
        return 90;
      case 'retirement':
        return 72;
      case 'education':
        return 58;
      case 'home purchase':
        return 48;
      case 'short-term goal':
      case 'short term goal':
        return 30;
      case 'emergency fund':
        return 15;
      default:
        return 50;
    }
  }

  private calculateExperienceScore(experience?: string, capitalPreservation = 5): number {
    let score = 50;
    const exp = (experience || '').toLowerCase();
    if (exp.includes('5+') || exp.includes('expert') || exp.includes('extensive')) {
      score += 35;
    } else if (exp.includes('3-5') || exp.includes('moderate')) {
      score += 20;
    } else if (exp.includes('1-2') || exp.includes('basic')) {
      score += 5;
    } else {
      score -= 15;
    }

    // Capital preservation score: 1 (lowest priority) to 10 (highest priority)
    // Higher desire for capital preservation reduces aggressive risk appetite
    const preservationPenalty = (capitalPreservation - 5) * 4;
    score -= preservationPenalty;

    return Math.min(100, Math.max(10, score));
  }

  private generateRecommendations(
    input: AssessmentInputData,
    factors: FactorResult[],
    category: string
  ): string[] {
    const recs: string[] = [];

    const emergency = factors.find((f) => f.factorKey === 'emergency_savings');
    if (emergency && emergency.score < 60) {
      recs.push(
        'Prioritize building 3–6 months of living expenses in high-yield cash or liquid money market instruments before allocating to volatile equity assets.'
      );
    }

    const debt = factors.find((f) => f.factorKey === 'debt_level');
    if (debt && debt.score < 50) {
      recs.push(
        'Formulate a structured debt repayment plan for high-interest liabilities, as guaranteed debt interest savings often exceed market returns.'
      );
    }

    const horizon = factors.find((f) => f.factorKey === 'investment_horizon');
    if (horizon && horizon.score < 50) {
      recs.push(
        'For short horizons (< 3 years), emphasize capital preservation vehicles such as short-term treasuries, certificates of deposit, or conservative fixed-income funds.'
      );
    }

    if (category === 'HIGH RISK' || category === 'VERY HIGH RISK') {
      recs.push(
        'Maintain automated dollar-cost averaging (DCA) into broadly diversified index funds (e.g., S&P 500 / Total World Index) to smooth out cyclical swings.'
      );
      recs.push(
        'Periodically rebalance your portfolio annually to prevent asset drift during extended bull or bear market runs.'
      );
    } else if (category === 'MODERATE RISK') {
      recs.push(
        'Consider a balanced multi-asset allocation (e.g., 60% broad equity / 40% quality fixed income) tailored for moderate capital growth with drawdown moderation.'
      );
    } else {
      recs.push(
        'Focus on high-quality capital preservation, inflation-protected securities (TIPS), and stable dividend-paying assets to safeguard purchasing power.'
      );
    }

    const knowledge = factors.find((f) => f.factorKey === 'investment_knowledge');
    if (knowledge && knowledge.score < 50) {
      recs.push(
        'Engage in foundational investor education on asset allocation, compound interest, and fee minimization before exploring complex individual equities or derivatives.'
      );
    }

    return recs.slice(0, 4);
  }
}

// Export singleton Risk Prediction Service with pluggable architecture
export class RiskPredictionService {
  private static model: IRiskPredictionModel = new RuleBasedRiskPredictionModel();

  // Method to plug in an ML model later if desired
  public static setModel(model: IRiskPredictionModel) {
    this.model = model;
  }

  public static predict(data: AssessmentInputData): PredictionResult {
    return this.model.predict(data);
  }
}
