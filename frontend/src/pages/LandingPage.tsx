import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  TrendingUp,
  Sliders,
  FileText,
  Lock,
  PieChart,
  ArrowRight,
  Sparkles,
  ChevronDown,
  CheckCircle,
  HelpCircle,
  BarChart3,
  Layers,
  Award,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { Card } from '../components/common/Card';

export const LandingPage: React.FC = () => {
  // Interactive Simulator on Hero / Landing
  const [simAge, setSimAge] = useState(30);
  const [simHorizon, setSimHorizon] = useState('5-10 years');
  const [simReaction, setSimReaction] = useState('Hold and wait');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const calculateSimScore = () => {
    let score = 50;
    if (simAge < 35) score += 15;
    else if (simAge > 55) score -= 15;

    if (simHorizon === 'More than 10 years') score += 20;
    else if (simHorizon === '5-10 years') score += 10;
    else if (simHorizon === 'Less than 1 year') score -= 20;

    if (simReaction === 'Invest more') score += 20;
    else if (simReaction === 'Sell immediately') score -= 25;

    return Math.min(100, Math.max(10, score));
  };

  const simScore = calculateSimScore();
  const simCategory =
    simScore <= 30
      ? 'LOW RISK'
      : simScore <= 60
      ? 'MODERATE RISK'
      : simScore <= 80
      ? 'HIGH RISK'
      : 'VERY HIGH RISK';

  const faqs = [
    {
      q: 'What is the RiskWise Investment Risk Prediction Platform?',
      a: 'RiskWise is an institutional-grade risk profiling system that quantifies your financial risk capacity and behavioral risk tolerance across 9 distinct dimensions to assist you in making informed, evidence-based portfolio decisions.',
    },
    {
      q: 'How does the 9-factor scoring engine work?',
      a: 'Our engine computes a normalized 0–100 score based on your age, net monthly cashflow, liquid emergency reserves, debt-to-income ratio, investment horizon, financial literacy, psychological downturn tolerance, primary goal, and prior experience.',
    },
    {
      q: 'Is my financial information kept private and secure?',
      a: 'Yes. All data transmissions are encrypted via SSL/TLS, sensitive credentials are cryptographic salt-hashed with bcrypt, and user profiles are strictly isolated with role-based database constraints.',
    },
    {
      q: 'Does RiskWise provide certified financial advice?',
      a: 'No. RiskWise is an educational and analytical tool designed to help you self-assess and visualize your risk posture. We always encourage consulting an accredited, fiduciary financial advisor before deploying real capital.',
    },
  ];

  return (
    <div className="space-y-24 py-12">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Psychometric Risk Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Understand Your <span className="text-emerald-600 dark:text-emerald-400">Investment Risk</span> Before You Invest
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Assess your investment profile, understand your risk level, and track your assessment history in one secure dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link to="/register">
                <Button variant="primary" size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Start Risk Assessment
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Login to Account
                </Button>
              </Link>
            </div>

            {/* Quick Metrics Banner */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">9 Factors</p>
                <p className="text-xs text-slate-500 font-medium">Multivariate Engine</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">100%</p>
                <p className="text-xs text-slate-500 font-medium">Data Isolation</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">Instant</p>
                <p className="text-xs text-slate-500 font-medium">PDF Risk Reports</p>
              </div>
            </div>
          </div>

          {/* Interactive Live Mini-Simulator Preview */}
          <div className="lg:col-span-5">
            <Card className="p-6 sm:p-8 shadow-2xl border-2 border-emerald-500/30 relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
                    Live Simulator Preview
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Instant Risk Calibration
                  </h3>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>

              {/* Gauge Preview */}
              <ScoreGauge score={simScore} category={simCategory} size="md" />

              {/* Interactive Controls */}
              <div className="space-y-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-500">Your Age:</span>
                    <span className="text-slate-900 dark:text-white">{simAge} yrs</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="75"
                    value={simAge}
                    onChange={(e) => setSimAge(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Investment Horizon:
                  </label>
                  <select
                    value={simHorizon}
                    onChange={(e) => setSimHorizon(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Less than 1 year">&lt; 1 year (Short)</option>
                    <option value="3-5 years">3–5 years (Medium)</option>
                    <option value="5-10 years">5–10 years (Long)</option>
                    <option value="More than 10 years">&gt; 10 years (Very Long)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    If Market Drops 20%:
                  </label>
                  <select
                    value={simReaction}
                    onChange={(e) => setSimReaction(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Sell immediately">Sell immediately (High Panic)</option>
                    <option value="Hold and wait">Hold and wait (Balanced)</option>
                    <option value="Invest more">Invest more (Opportunistic)</option>
                  </select>
                </div>
              </div>

              <Link to="/assess" className="block mt-6">
                <Button variant="primary" size="sm" className="w-full">
                  Take Complete 9-Factor Assessment
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Systematic Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            How RiskWise Quantifies Your Profile
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Our framework synthesizes quantitative financial capacity with behavioral economics in four transparent steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Provide Financials',
              desc: 'Enter your monthly cashflow, liquid cash reserves, debt commitments, and current portfolio.',
              icon: Sliders,
            },
            {
              step: '02',
              title: 'Psychological Test',
              desc: 'Answer behavioral scenarios evaluating your reaction to market corrections and volatility.',
              icon: TrendingUp,
            },
            {
              step: '03',
              title: 'Explainable Scoring',
              desc: 'Our engine calculates your 0–100 score across 9 weighted factors with clear analytical feedback.',
              icon: Award,
            },
            {
              step: '04',
              title: 'Track & Export',
              desc: 'Monitor your risk drift over time on your dashboard and download print-ready PDF reports.',
              icon: FileText,
            },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i} className="relative p-6 hoverEffect">
                <span className="text-4xl font-black text-slate-100 dark:text-slate-800 select-none absolute top-4 right-4">
                  {s.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3. PLATFORM FEATURES */}
      <section className="bg-slate-100/60 dark:bg-slate-900/40 py-20 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Institutional Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Engineered for Serious Wealth Creators
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Multi-Factor Risk Engine
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Evaluates 9 distinct vectors including age, disposable income, emergency liquidity, debt burden, and time horizon with configurable weighting.
              </p>
            </Card>

            <Card className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Asset Allocation Guidance
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connects your assessed risk tier directly to suggested equity, fixed-income, and cash percentage ranges to eliminate guesswork.
              </p>
            </Card>

            <Card className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Bank-Grade Security
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Zero data leakage between users, cryptographic password hashing, HTTP-only secure cookie sessions, and strict SQL injection safeguards.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Common Inquiries
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900"
            >
              <button
                type="button"
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-slate-900 dark:text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    openFaqIndex === index ? 'rotate-180 text-emerald-500' : ''
                  }`}
                />
              </button>
              {openFaqIndex === index && (
                <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. BOTTOM CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 sm:p-14 text-white text-center shadow-xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto">
            Ready to Discover Your True Investment Risk Level?
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of smart investors using RiskWise to navigate market volatility with clarity and discipline.
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-emerald-900 hover:bg-slate-100 font-bold px-8 shadow-md"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Create Free Account & Start
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
