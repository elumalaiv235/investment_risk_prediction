import { describe, it, expect } from 'vitest';
import {
  RiskPredictionService,
  RuleBasedRiskPredictionModel,
  AssessmentInputData,
} from '../services/riskPredictionService';

describe('Risk Prediction Engine Tests', () => {
  it('should categorize a young, high-capacity, high-tolerance user as HIGH or VERY HIGH risk', () => {
    const highRiskProfile: AssessmentInputData = {
      age: 24,
      income: 10000,
      expenses: 3000,
      savings: 4000,
      emergencyFund: 30000,
      debt: 0,
      totalInvestments: 50000,
      investmentAmount: 15000,
      investmentGoal: 'Wealth Creation',
      investmentHorizon: 'More than 10 years',
      knowledgeLevel: 'Expert',
      volatilityTolerance: 'Invest more',
      marketDownturnAction: 'Invest more',
      capitalPreservationScore: 2,
      investmentExperience: '5+ years',
    };

    const result = RiskPredictionService.predict(highRiskProfile);

    expect(result.riskScore).toBeGreaterThanOrEqual(70);
    expect(['HIGH RISK', 'VERY HIGH RISK']).toContain(result.riskCategory);
    expect(result.factors.length).toBe(9);
    expect(result.positiveFactors.length).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('should categorize an older, risk-averse user with short horizon as LOW RISK', () => {
    const lowRiskProfile: AssessmentInputData = {
      age: 68,
      income: 3000,
      expenses: 2800,
      savings: 200,
      emergencyFund: 2000,
      debt: 20000,
      totalInvestments: 10000,
      investmentAmount: 5000,
      investmentGoal: 'Emergency Fund',
      investmentHorizon: 'Less than 1 year',
      knowledgeLevel: 'Beginner',
      volatilityTolerance: 'Sell immediately',
      marketDownturnAction: 'Sell immediately',
      capitalPreservationScore: 10,
      investmentExperience: 'None',
    };

    const result = RiskPredictionService.predict(lowRiskProfile);

    expect(result.riskScore).toBeLessThanOrEqual(30);
    expect(result.riskCategory).toBe('LOW RISK');
    expect(result.attentionFactors.length).toBeGreaterThan(0);
  });

  it('should categorize a balanced middle-age professional as MODERATE RISK', () => {
    const moderateProfile: AssessmentInputData = {
      age: 42,
      income: 6000,
      expenses: 3800,
      savings: 1200,
      emergencyFund: 15000,
      debt: 8000,
      totalInvestments: 35000,
      investmentAmount: 8000,
      investmentGoal: 'Home Purchase',
      investmentHorizon: '3-5 years',
      knowledgeLevel: 'Intermediate',
      volatilityTolerance: 'Hold and wait',
      marketDownturnAction: 'Hold and wait',
      capitalPreservationScore: 5,
      investmentExperience: '1-2 years',
    };

    const result = RiskPredictionService.predict(moderateProfile);

    expect(result.riskScore).toBeGreaterThan(30);
    expect(result.riskScore).toBeLessThanOrEqual(70);
    expect(['MODERATE RISK', 'HIGH RISK']).toContain(result.riskCategory);
  });

  it('should properly bound scores strictly between 0 and 100', () => {
    const extremeMin: AssessmentInputData = {
      age: 95,
      income: 500,
      expenses: 1200,
      savings: 0,
      emergencyFund: 0,
      debt: 100000,
      totalInvestments: 0,
      investmentAmount: 100,
      investmentGoal: 'Emergency Fund',
      investmentHorizon: 'Less than 1 year',
      knowledgeLevel: 'Beginner',
      volatilityTolerance: 'Sell immediately',
      marketDownturnAction: 'Sell immediately',
      capitalPreservationScore: 10,
    };

    const minResult = RiskPredictionService.predict(extremeMin);
    expect(minResult.riskScore).toBeGreaterThanOrEqual(0);
    expect(minResult.riskScore).toBeLessThanOrEqual(100);

    const extremeMax: AssessmentInputData = {
      age: 20,
      income: 50000,
      expenses: 2000,
      savings: 30000,
      emergencyFund: 100000,
      debt: 0,
      totalInvestments: 500000,
      investmentAmount: 50000,
      investmentGoal: 'Wealth Creation',
      investmentHorizon: 'More than 10 years',
      knowledgeLevel: 'Expert',
      volatilityTolerance: 'Invest more',
      marketDownturnAction: 'Invest more',
      capitalPreservationScore: 1,
    };

    const maxResult = RiskPredictionService.predict(extremeMax);
    expect(maxResult.riskScore).toBeGreaterThanOrEqual(0);
    expect(maxResult.riskScore).toBeLessThanOrEqual(100);
  });

  it('should include all required radar chart dimensions', () => {
    const sample: AssessmentInputData = {
      age: 30,
      income: 5000,
      expenses: 3000,
      savings: 1000,
      emergencyFund: 12000,
      debt: 2000,
      totalInvestments: 20000,
      investmentAmount: 5000,
      investmentGoal: 'Retirement',
      investmentHorizon: '5-10 years',
      knowledgeLevel: 'Intermediate',
      volatilityTolerance: 'Hold and wait',
      marketDownturnAction: 'Hold and wait',
    };

    const result = RiskPredictionService.predict(sample);
    expect(result.radarScores).toHaveProperty('financialCapacity');
    expect(result.radarScores).toHaveProperty('investmentHorizon');
    expect(result.radarScores).toHaveProperty('marketTolerance');
    expect(result.radarScores).toHaveProperty('experienceKnowledge');
    expect(result.radarScores).toHaveProperty('liquidityPosition');
  });
});
