import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { RiskFactor } from '../../types';

export const FactorExplanationCard: React.FC<{ factor: RiskFactor }> = ({ factor }) => {
  const getImpactBadge = () => {
    switch (factor.impact) {
      case 'POSITIVE':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Positive Risk Factor
          </span>
        );
      case 'ATTENTION':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            Requires Attention
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            Neutral Driver
          </span>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-emerald-500';
    if (score >= 45) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{factor.factorName}</h4>
          <span className="text-[11px] text-slate-400 font-medium">
            Model Weight: {(factor.weight * 100).toFixed(0)}%
          </span>
        </div>
        {getImpactBadge()}
      </div>

      {/* Mini Score Bar */}
      <div className="space-y-1 my-3">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500 font-medium">Dimension Score</span>
          <span className="font-bold text-slate-900 dark:text-white">{factor.score} / 100</span>
        </div>
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getScoreColor(factor.score)}`}
            style={{ width: `${factor.score}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
        {factor.explanation}
      </p>
    </div>
  );
};
