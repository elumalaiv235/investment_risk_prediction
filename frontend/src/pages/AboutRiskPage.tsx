import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  TrendingUp,
  Brain,
  Scale,
  Compass,
  ArrowRight,
  BookOpen,
  PieChart,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const AboutRiskPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Investor Education & Principles
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Understanding Investment Risk
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Risk is not simply the probability of losing money—it is the multidimensional interplay between financial capacity, emotional tolerance, and time horizon.
        </p>
      </div>

      {/* Capacity vs Tolerance Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 border-2 border-emerald-500/30">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
            <Scale className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            1. Risk Capacity (Quantitative)
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            Risk capacity is your objective financial ability to absorb financial loss without jeopardizing your basic living standards, debt obligations, or non-negotiable financial milestones.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-slate-500 list-disc list-inside">
            <li>Liquid cash runway (6+ months of living expenses)</li>
            <li>Net disposable monthly savings rate</li>
            <li>Debt-to-income and debt-to-asset leverage</li>
            <li>Time remaining until planned capital withdrawal</li>
          </ul>
        </Card>

        <Card className="p-8 border-2 border-teal-500/30">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6">
            <Brain className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            2. Risk Tolerance (Psychological)
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            Risk tolerance is your emotional willingness to endure volatility and cyclical market drawdowns without succumbing to panic selling at market bottoms.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-slate-500 list-disc list-inside">
            <li>Behavioral reaction during a 20% index correction</li>
            <li>Loss aversion vs growth orientation bias</li>
            <li>Prior investing experience across bear cycles</li>
            <li>Desire for guaranteed capital preservation</li>
          </ul>
        </Card>
      </div>

      {/* The 4 Risk Tiers Guide */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            The Four RiskWise Classification Tiers
          </h2>
          <p className="text-xs text-slate-500">
            How our explainable algorithm translates 0–100 scores into asset allocations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              tier: 'LOW RISK',
              range: '0 – 30',
              color: 'text-emerald-600',
              badge: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200',
              summary: 'Capital preservation focus, low volatility tolerance, short time horizon.',
              alloc: '15-25% Equities / 60-70% Fixed Income / 15% Cash',
            },
            {
              tier: 'MODERATE RISK',
              range: '31 – 60',
              color: 'text-amber-600',
              badge: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200',
              summary: 'Balanced growth mandate with steady cashflow and intermediate time horizon.',
              alloc: '50-65% Equities / 25-35% Fixed Income / 10% Cash',
            },
            {
              tier: 'HIGH RISK',
              range: '61 – 80',
              color: 'text-orange-600',
              badge: 'bg-orange-50 dark:bg-orange-950/60 border-orange-200',
              summary: 'Long-term accumulation mandate with high psychological resilience.',
              alloc: '75-85% Equities / 10-20% Fixed Income / 5% Cash',
            },
            {
              tier: 'VERY HIGH RISK',
              range: '81 – 100',
              color: 'text-rose-600',
              badge: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200',
              summary: 'Aggressive capital compounding with 10+ year time runway.',
              alloc: '85-95% Equities / 0-10% Fixed Income / 5-15% Alts',
            },
          ].map((t, idx) => (
            <Card key={idx} className={`p-5 border ${t.badge}`}>
              <span className={`text-xs font-bold uppercase tracking-wider ${t.color}`}>
                Score: {t.range}
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1 mb-2">
                {t.tier}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                {t.summary}
              </p>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                {t.alloc}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 text-center space-y-4 border border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Ready to Calculate Your Exact Score?
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Take the 9-factor questionnaire and receive your personalized risk breakdown in under 3 minutes.
        </p>
        <Link to="/assess" className="inline-block">
          <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Start Free Assessment
          </Button>
        </Link>
      </div>
    </div>
  );
};
