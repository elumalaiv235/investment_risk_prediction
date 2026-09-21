import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Wallet,
  Compass,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const OnboardingPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [onboardingData, setOnboardingData] = useState({
    // Step 1: Personal
    occupation: user?.profile?.occupation || 'Technology Consultant',
    country: user?.profile?.country || 'United States',
    age: user?.profile?.age || 30,

    // Step 2: Financial
    monthlyIncome: 6500,
    monthlyExpenses: 3800,
    monthlySavings: 1500,
    emergencyFund: 15000,
    existingDebt: 4000,
    existingInvestments: 20000,

    // Step 3: Preferences
    investmentGoal: 'Wealth Creation',
    investmentHorizon: '5-10 years',
    knowledgeLevel: 'Intermediate',
    volatilityTolerance: 'Hold and wait',
  });

  const updateField = (field: string, value: any) => {
    setOnboardingData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = async () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      // Save profile and proceed to Step 4 (Risk Assessment)
      setLoading(true);
      try {
        await api.profile.update(onboardingData);
        await refreshUser();
        navigate('/assess');
      } catch (err) {
        navigate('/assess');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSkipToAssessment = () => {
    navigate('/assess');
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Investor Onboarding Wizard</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome to RiskWise, {user?.name || 'Investor'}!
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Let's initialize your profile in 3 quick steps before generating your first institutional risk prediction.
        </p>
      </div>

      {/* 1 -> 2 -> 3 -> 4 Progress Indicator */}
      <div className="flex items-center justify-between max-w-lg mx-auto mb-10">
        {[
          { num: 1, title: 'Personal', icon: User },
          { num: 2, title: 'Financials', icon: Wallet },
          { num: 3, title: 'Preferences', icon: Compass },
          { num: 4, title: 'Assessment', icon: ShieldAlert },
        ].map((item, index) => {
          const Icon = item.icon;
          const isDone = step > item.num;
          const isCurrent = step === item.num;

          return (
            <React.Fragment key={item.num}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-emerald-600 text-white shadow-lg ring-4 ring-emerald-100 dark:ring-emerald-950'
                      : isDone
                      ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className="text-[11px] font-semibold mt-1.5 text-slate-600 dark:text-slate-400">
                  {item.title}
                </span>
              </div>
              {index < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full ${
                    step > index + 1 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <Card className="p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800">
        {/* Step 1: Personal info */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Step 1: Personal Background
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Age
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={onboardingData.age}
                  onChange={(e) => updateField('age', parseInt(e.target.value) || 18)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Occupation / Industry
                </label>
                <input
                  type="text"
                  value={onboardingData.occupation}
                  onChange={(e) => updateField('occupation', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="e.g. Software Engineer"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Country of Residence
                </label>
                <input
                  type="text"
                  value={onboardingData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Financial information */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Step 2: Financial Capacity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Monthly Gross Income ($ USD)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={onboardingData.monthlyIncome}
                  onChange={(e) => updateField('monthlyIncome', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Monthly Living Expenses ($ USD)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={onboardingData.monthlyExpenses}
                  onChange={(e) => updateField('monthlyExpenses', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Liquid Emergency Reserves ($ USD)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={onboardingData.emergencyFund}
                  onChange={(e) => updateField('emergencyFund', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Total Existing Debt ($ USD)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={onboardingData.existingDebt}
                  onChange={(e) => updateField('existingDebt', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Step 3: Investment Mandate & Timeframe
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Primary Investment Goal
                </label>
                <select
                  value={onboardingData.investmentGoal}
                  onChange={(e) => updateField('investmentGoal', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option>Wealth Creation</option>
                  <option>Retirement</option>
                  <option>Education</option>
                  <option>Home Purchase</option>
                  <option>Emergency Fund</option>
                  <option>Short-Term Goal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Expected Investment Horizon
                </label>
                <select
                  value={onboardingData.investmentHorizon}
                  onChange={(e) => updateField('investmentHorizon', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option>Less than 1 year</option>
                  <option>1–3 years</option>
                  <option>3–5 years</option>
                  <option>5–10 years</option>
                  <option>More than 10 years</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Investment Knowledge Level
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => updateField('knowledgeLevel', lvl)}
                      className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all ${
                        onboardingData.knowledgeLevel === lvl
                          ? 'border-emerald-500 bg-emerald-600 text-white'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          ) : (
            <button
              type="button"
              onClick={handleSkipToAssessment}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Skip directly to assessment →
            </button>
          )}

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleNextStep}
            isLoading={loading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {step < 3 ? 'Save & Continue' : 'Proceed to Risk Assessment'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
