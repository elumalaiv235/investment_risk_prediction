import React, { useState, useEffect } from 'react';
import {
  User,
  Wallet,
  Target,
  Clock,
  BookOpen,
  Activity,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Profile } from '../../types';

interface Props {
  initialProfile?: Profile | null;
  onSubmit: (formData: any) => Promise<void>;
  isLoading?: boolean;
}

export const RiskQuestionnaire: React.FC<Props> = ({
  initialProfile,
  onSubmit,
  isLoading = false,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    // Section A - Personal Information
    age: initialProfile?.age || 30,
    employmentStatus: 'Employed Full-Time',
    income: initialProfile?.monthlyIncome || 6000,
    expenses: initialProfile?.monthlyExpenses || 3500,
    savings: initialProfile?.monthlySavings || 1500,

    // Section B - Financial Capacity
    emergencyFund: initialProfile?.emergencyFund || 18000,
    debt: initialProfile?.existingDebt || 5000,
    totalInvestments: initialProfile?.existingInvestments || 25000,
    investmentAmount: 10000,
    percentageIncomeToInvest: 15,

    // Section C - Investment Goal
    investmentGoal: initialProfile?.investmentGoal || 'Wealth Creation',

    // Section D - Investment Horizon
    investmentHorizon: initialProfile?.investmentHorizon || '5-10 years',

    // Section E - Investment Knowledge
    knowledgeLevel: initialProfile?.knowledgeLevel || 'Intermediate',
    investmentExperience: '3-5 years',

    // Section F - Volatility Tolerance
    volatilityTolerance: 'Moderate comfort with standard market dips',
    marketDownturnAction: initialProfile?.volatilityTolerance || 'Hold and wait',
    capitalPreservationScore: 5,
    maxDownturnDuration: '1-3 years',
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Financial Capacity', icon: Wallet },
    { number: 3, title: 'Investment Goal', icon: Target },
    { number: 4, title: 'Time Horizon', icon: Clock },
    { number: 5, title: 'Knowledge', icon: BookOpen },
    { number: 6, title: 'Market Tolerance', icon: Activity },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Step {currentStep} of {totalSteps}: {steps[currentStep - 1].title}
          </span>
          <span className="text-xs font-semibold text-slate-400">
            {Math.round((currentStep / totalSteps) * 100)}% Completed
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Buttons */}
        <div className="hidden sm:grid grid-cols-6 gap-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isDone = currentStep > step.number;
            const isCurrent = currentStep === step.number;

            return (
              <button
                key={step.number}
                type="button"
                onClick={() => setCurrentStep(step.number)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                    : isDone
                    ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    : 'border-transparent text-slate-400 dark:text-slate-600 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isDone ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Icon className="w-4 h-4 shrink-0" />
                  )}
                  <span className="text-xs truncate">{step.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Questionnaire Card */}
      <Card className="shadow-lg border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <form onSubmit={handleFormSubmit}>
          {/* STEP 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Section A: Personal Information & Cashflow
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your life stage and net monthly cashflow dictate your capacity to take on risk.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                    Current Age: <span className="text-emerald-600 dark:text-emerald-400">{formData.age} years</span>
                  </label>
                  <input
                    type="range"
                    min="18"
                    max="85"
                    value={formData.age}
                    onChange={(e) => updateField('age', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>18</span>
                    <span>45</span>
                    <span>85+</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                    Employment Status
                  </label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => updateField('employmentStatus', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option>Employed Full-Time</option>
                    <option>Self-Employed / Business Owner</option>
                    <option>Part-Time / Freelancer</option>
                    <option>Retired</option>
                    <option>Student / Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                    Monthly Gross Income ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={formData.income}
                    onChange={(e) => updateField('income', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-semibold"
                    placeholder="e.g. 6000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                    Monthly Living Expenses ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={formData.expenses}
                    onChange={(e) => updateField('expenses', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-semibold"
                    placeholder="e.g. 3500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                    Monthly Net Savings / Surplus ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={formData.savings}
                    onChange={(e) => updateField('savings', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-semibold"
                    placeholder="e.g. 1500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Financial Capacity */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Section B: Financial Capacity & Balance Sheet
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Liquidity reserves and debt ratios protect you against forced liquidations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                    Liquid Emergency Fund ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={formData.emergencyFund}
                    onChange={(e) => updateField('emergencyFund', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-semibold"
                    placeholder="e.g. 18000"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {formData.expenses > 0
                      ? `Covers ~${(formData.emergencyFund / formData.expenses).toFixed(1)} months of expenses`
                      : 'Cash reserves'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                    Existing Debt Liabilities ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={formData.debt}
                    onChange={(e) => updateField('debt', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-semibold"
                    placeholder="e.g. 5000"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Loans, credit cards, student loans
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                    Total Existing Portfolio ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.totalInvestments}
                    onChange={(e) => updateField('totalInvestments', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-semibold"
                    placeholder="e.g. 25000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                    Planned Investment Amount ($ USD)
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="500"
                    value={formData.investmentAmount}
                    onChange={(e) => updateField('investmentAmount', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-semibold"
                    placeholder="e.g. 10000"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Investment Goal */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Section C: Primary Investment Goal
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  What is the primary mandate for the capital you intend to invest?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'Wealth Creation', desc: 'Aggressive long-term asset compounding' },
                  { title: 'Retirement', desc: 'Financial independence and pension accumulation' },
                  { title: 'Education', desc: 'Funding future tuition or college expenses' },
                  { title: 'Home Purchase', desc: 'Down payment accumulation for property' },
                  { title: 'Short-Term Goal', desc: 'Purchasing a vehicle or planned expenditure' },
                  { title: 'Emergency Fund', desc: 'Preserving cash buffer against unexpected shocks' },
                  { title: 'Other', desc: 'Specialized or custom wealth objective' },
                ].map((g) => (
                  <button
                    key={g.title}
                    type="button"
                    onClick={() => updateField('investmentGoal', g.title)}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      formData.investmentGoal === g.title
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{g.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{g.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Time Horizon */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Section D: Investment Time Horizon
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  When do you anticipate needing access to these invested funds?
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    val: 'Less than 1 year',
                    title: 'Short Horizon (< 1 Year)',
                    desc: 'Capital preservation is vital; high equity exposure is not recommended.',
                  },
                  {
                    val: '1–3 years',
                    title: 'Intermediate Short (1 - 3 Years)',
                    desc: 'Conservative allocations with high fixed income and stable instruments.',
                  },
                  {
                    val: '3–5 years',
                    title: 'Medium Term (3 - 5 Years)',
                    desc: 'Balanced mixture of dividend equities and moderate bond duration.',
                  },
                  {
                    val: '5–10 years',
                    title: 'Long Term (5 - 10 Years)',
                    desc: 'Growth orientation capable of riding out standard market pullbacks.',
                  },
                  {
                    val: 'More than 10 years',
                    title: 'Generational Growth (> 10 Years)',
                    desc: 'Maximum capacity to compound through multi-year market cycles.',
                  },
                ].map((h) => (
                  <button
                    key={h.val}
                    type="button"
                    onClick={() => updateField('investmentHorizon', h.val)}
                    className={`w-full p-4 rounded-2xl text-left border flex items-center justify-between transition-all ${
                      formData.investmentHorizon === h.val
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{h.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{h.desc}</p>
                    </div>
                    {formData.investmentHorizon === h.val && (
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 ml-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Knowledge Level */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Section E: Financial Literacy & Prior Experience
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Familiarity with financial instruments ensures realistic expectations during drawdowns.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-3">
                  Self-Assessed Knowledge Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                  {['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => updateField('knowledgeLevel', lvl)}
                      className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                        formData.knowledgeLevel === lvl
                          ? 'border-emerald-500 bg-emerald-600 text-white shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                  Active Market Experience
                </label>
                <select
                  value={formData.investmentExperience}
                  onChange={(e) => updateField('investmentExperience', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="None">No prior investing experience</option>
                  <option value="1-2 years">1 - 2 years of active investing</option>
                  <option value="3-5 years">3 - 5 years of active investing</option>
                  <option value="5+ years">5+ years extensive experience</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 6: Volatility & Psychological Tolerance */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Section F: Volatility & Behavioral Reaction
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Psychological resilience is often the key differentiator between successful and panic-prone investors.
                </p>
              </div>

              {/* Scenario Question */}
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                  Scenario: If your investment portfolio suddenly falls by 20% over 2 months during a broader market correction, what would you most likely do?
                </label>
                <div className="space-y-2 mt-3">
                  {[
                    { val: 'Sell immediately', label: 'Sell immediately to stop further losses' },
                    { val: 'Sell part of the investment', label: 'Sell part of the holdings to reduce exposure' },
                    { val: 'Hold and wait', label: 'Hold and wait for the market to recover' },
                    { val: 'Invest more', label: 'Invest additional funds at discounted market prices' },
                    { val: 'Not sure', label: 'Unsure / Need guidance' },
                  ].map((act) => (
                    <label
                      key={act.val}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.marketDownturnAction === act.val
                          ? 'border-emerald-500 bg-white dark:bg-slate-900 ring-1 ring-emerald-500 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60'
                      }`}
                    >
                      <input
                        type="radio"
                        name="marketDownturnAction"
                        checked={formData.marketDownturnAction === act.val}
                        onChange={() => updateField('marketDownturnAction', act.val)}
                        className="accent-emerald-500 w-4 h-4"
                      />
                      <span className="text-xs text-slate-800 dark:text-slate-200">{act.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Capital Preservation Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Capital Preservation Priority
                  </label>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {formData.capitalPreservationScore} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.capitalPreservationScore}
                  onChange={(e) => updateField('capitalPreservationScore', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>1 (Willing to risk capital for growth)</span>
                  <span>10 (Avoid capital loss at all costs)</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100 dark:border-slate-800">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Previous Step
              </Button>
            ) : (
              <div />
            )}

            {currentStep < totalSteps ? (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => setCurrentStep((prev) => Math.min(totalSteps, prev + 1))}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue ({steps[currentStep].title})
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                rightIcon={<Sparkles className="w-5 h-5" />}
              >
                Calculate My Risk Profile
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};
