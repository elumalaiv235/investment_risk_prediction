import { RiskCategory } from '../types';

export interface CategoryMeta {
  label: RiskCategory;
  shortLabel: string;
  minScore: number;
  maxScore: number;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  assetAllocation: {
    cashEquities: string;
    bondsFixedIncome: string;
    cashEquivalents: string;
    alternatives?: string;
  };
}

export const RISK_CATEGORIES: Record<string, CategoryMeta> = {
  'LOW RISK': {
    label: 'LOW RISK',
    shortLabel: 'Low',
    minScore: 0,
    maxScore: 30,
    color: '#10b981', // Emerald
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    description: 'Prioritizes principal preservation, capital stability, and steady income over aggressive market growth.',
    assetAllocation: {
      cashEquities: '15 - 25%',
      bondsFixedIncome: '55 - 70%',
      cashEquivalents: '15 - 25%',
    },
  },
  'MODERATE RISK': {
    label: 'MODERATE RISK',
    shortLabel: 'Moderate',
    minScore: 31,
    maxScore: 60,
    color: '#f59e0b', // Amber
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-800',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    badgeText: 'text-amber-600 dark:text-amber-400',
    description: 'Balanced mandate seeking capital appreciation with moderate tolerance for intermediate cyclical drawdowns.',
    assetAllocation: {
      cashEquities: '50 - 65%',
      bondsFixedIncome: '25 - 35%',
      cashEquivalents: '10 - 15%',
    },
  },
  'HIGH RISK': {
    label: 'HIGH RISK',
    shortLabel: 'High',
    minScore: 61,
    maxScore: 80,
    color: '#f97316', // Orange
    bgColor: 'bg-orange-50 dark:bg-orange-950/40',
    borderColor: 'border-orange-200 dark:border-orange-800',
    badgeBg: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    badgeText: 'text-orange-600 dark:text-orange-400',
    description: 'Oriented toward strong long-term capital growth, supported by a healthy time horizon and high psychological resilience.',
    assetAllocation: {
      cashEquities: '75 - 85%',
      bondsFixedIncome: '10 - 20%',
      cashEquivalents: '5 - 10%',
    },
  },
  'VERY HIGH RISK': {
    label: 'VERY HIGH RISK',
    shortLabel: 'Very High',
    minScore: 81,
    maxScore: 100,
    color: '#ef4444', // Rose/Red
    bgColor: 'bg-rose-50 dark:bg-rose-950/40',
    borderColor: 'border-rose-200 dark:border-rose-800',
    badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
    badgeText: 'text-rose-600 dark:text-rose-400',
    description: 'Maximum capital expansion mandate with willingness to endure substantial volatility and market drawdowns.',
    assetAllocation: {
      cashEquities: '85 - 95%',
      bondsFixedIncome: '0 - 10%',
      cashEquivalents: '5%',
      alternatives: '5 - 15%',
    },
  },
};

export const getCategoryMeta = (category?: string | null): CategoryMeta => {
  if (!category || !RISK_CATEGORIES[category]) {
    return RISK_CATEGORIES['MODERATE RISK'];
  }
  return RISK_CATEGORIES[category];
};
