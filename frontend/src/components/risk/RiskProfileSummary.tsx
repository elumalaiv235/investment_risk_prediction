import React from 'react';
import { Shield, TrendingUp, Compass, Clock, Wallet } from 'lucide-react';
import { RadarScores } from '../../types';

interface Props {
  radarScores?: RadarScores;
}

export const RiskProfileSummary: React.FC<Props> = ({ radarScores }) => {
  const categories = [
    {
      title: 'Financial Capacity',
      icon: Wallet,
      score: radarScores?.financialCapacity ?? 70,
      label: (radarScores?.financialCapacity ?? 70) >= 70 ? 'Strong Surplus' : 'Moderate Buffer',
      explanation: 'Evaluates monthly disposable income, active savings rate, and discretionary margin.',
    },
    {
      title: 'Investment Horizon',
      icon: Clock,
      score: radarScores?.investmentHorizon ?? 80,
      label: (radarScores?.investmentHorizon ?? 80) >= 75 ? 'Long Term (5-10+ yrs)' : 'Intermediate',
      explanation: 'Longer time horizons allow compounding and historical recovery from market drawdowns.',
    },
    {
      title: 'Market Tolerance',
      icon: TrendingUp,
      score: radarScores?.marketTolerance ?? 65,
      label: (radarScores?.marketTolerance ?? 65) >= 70 ? 'Resilient' : 'Cautious',
      explanation: 'Behavioral reaction to 20% temporary market declines without panic selling.',
    },
    {
      title: 'Experience & Literacy',
      icon: Compass,
      score: radarScores?.experienceKnowledge ?? 75,
      label: (radarScores?.experienceKnowledge ?? 75) >= 70 ? 'Intermediate/Adv' : 'Foundational',
      explanation: 'Understanding of volatility dynamics, diversified index funds, and asset allocation.',
    },
    {
      title: 'Liquidity Position',
      icon: Shield,
      score: radarScores?.liquidityPosition ?? 60,
      label: (radarScores?.liquidityPosition ?? 60) >= 70 ? 'Well Protected' : 'Adequate',
      explanation: 'Adequacy of liquid emergency reserves relative to monthly expenses and debt burden.',
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 45) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat, idx) => {
        const Icon = cat.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {cat.title}
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">{cat.label}</span>
                </div>
              </div>
              <span className={`text-lg font-black ${getScoreColor(cat.score)}`}>
                {cat.score}
                <span className="text-[10px] text-slate-400 font-normal">/100</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
              {cat.explanation}
            </p>
          </div>
        );
      })}
    </div>
  );
};
