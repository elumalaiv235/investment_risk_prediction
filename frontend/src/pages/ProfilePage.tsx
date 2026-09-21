import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Globe,
  DollarSign,
  ShieldAlert,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Profile } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getCategoryMeta } from '../utils/riskCategories';
import { Button } from '../components/common/Button';
import { Card, CardHeader } from '../components/common/Card';
import { CardSkeleton } from '../components/common/Skeleton';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [completeness, setCompleteness] = useState(0);
  const [stats, setStats] = useState<any>(null);

  const [formData, setFormData] = useState<any>({
    name: '',
    phone: '',
    age: 30,
    country: 'United States',
    occupation: '',
    preferredCurrency: 'USD',
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlySavings: 0,
    emergencyFund: 0,
    existingDebt: 0,
    existingInvestments: 0,
    investmentGoal: 'Wealth Creation',
    investmentHorizon: '5-10 years',
    knowledgeLevel: 'Intermediate',
    volatilityTolerance: 'Hold and wait',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await api.profile.get();
        if (data && data.profile) {
          setCompleteness(data.completeness || 0);
          setStats(data.stats || null);
          const p = data.profile;
          setFormData({
            name: p.user?.name || user?.name || '',
            phone: p.user?.phone || user?.phone || '',
            age: p.age || 30,
            country: p.country || 'United States',
            occupation: p.occupation || '',
            preferredCurrency: p.preferredCurrency || 'USD',
            monthlyIncome: p.monthlyIncome || 0,
            monthlyExpenses: p.monthlyExpenses || 0,
            monthlySavings: p.monthlySavings || 0,
            emergencyFund: p.emergencyFund || 0,
            existingDebt: p.existingDebt || 0,
            existingInvestments: p.existingInvestments || 0,
            investmentGoal: p.investmentGoal || 'Wealth Creation',
            investmentHorizon: p.investmentHorizon || '5-10 years',
            knowledgeLevel: p.knowledgeLevel || 'Intermediate',
            volatilityTolerance: p.volatilityTolerance || 'Hold and wait',
          });
        }
      } catch (err: any) {
        setErrorMsg('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await api.profile.update(formData);
      await refreshUser();
      setSuccessMsg('Profile information updated successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const latestMeta = getCategoryMeta(stats?.latestCategory);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* 1. PROFILE BANNER */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl font-black shadow-inner">
            {formData.name ? formData.name.slice(0, 2).toUpperCase() : 'US'}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{formData.name || 'Investor'}</h1>
            <p className="text-emerald-100 text-xs sm:text-sm">{user?.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
                {formData.occupation || 'Investor Profile'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
                📍 {formData.country}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/40 text-emerald-200 text-xs font-semibold uppercase">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Completeness Meter */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0 w-44">
            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-200">
              Profile Completeness
            </span>
            <p className="text-2xl font-black mt-0.5">{completeness}%</p>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-emerald-300 rounded-full"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 2. RISK PROFILE SUMMARY OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Latest Risk Score</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats?.latestScore !== null ? `${stats?.latestScore} / 100` : '—'}
          </p>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assessed Risk Tier</span>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-2 truncate">
            {stats?.latestCategory || 'No Assessments'}
          </p>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assessments Count</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats?.totalAssessments || 0}
          </p>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Score</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats?.averageScore !== null ? `${stats?.averageScore} / 100` : '—'}
          </p>
        </Card>
      </div>

      {/* 3. EDIT PROFILE FORM */}
      <Card className="p-6 sm:p-8">
        <CardHeader
          title="Edit Profile Information"
          subtitle="Update your personal telemetry, cashflow metrics, and investment preferences"
        />

        {successMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Section 1: Personal Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  min="18"
                  max="120"
                  value={formData.age}
                  onChange={(e) => updateField('age', parseInt(e.target.value) || 18)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Occupation / Industry
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => updateField('occupation', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Senior Product Manager"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Currency
                </label>
                <select
                  value={formData.preferredCurrency}
                  onChange={(e) => updateField('preferredCurrency', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Financial Metrics */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Financial Telemetry
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Gross Income ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.monthlyIncome}
                  onChange={(e) => updateField('monthlyIncome', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Living Expenses ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.monthlyExpenses}
                  onChange={(e) => updateField('monthlyExpenses', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Net Savings ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.monthlySavings}
                  onChange={(e) => updateField('monthlySavings', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Liquid Emergency Fund ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={formData.emergencyFund}
                  onChange={(e) => updateField('emergencyFund', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Existing Debt Liabilities ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={formData.existingDebt}
                  onChange={(e) => updateField('existingDebt', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Existing Portfolio Assets ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.existingInvestments}
                  onChange={(e) => updateField('existingInvestments', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Investment Mandate */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <Award className="w-4 h-4" /> Preferences & Mandate
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Investment Goal
                </label>
                <select
                  value={formData.investmentGoal}
                  onChange={(e) => updateField('investmentGoal', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Wealth Creation</option>
                  <option>Retirement</option>
                  <option>Education</option>
                  <option>Home Purchase</option>
                  <option>Emergency Fund</option>
                  <option>Short-Term Goal</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Investment Horizon
                </label>
                <select
                  value={formData.investmentHorizon}
                  onChange={(e) => updateField('investmentHorizon', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Less than 1 year</option>
                  <option>1–3 years</option>
                  <option>3–5 years</option>
                  <option>5–10 years</option>
                  <option>More than 10 years</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Knowledge Level
                </label>
                <select
                  value={formData.knowledgeLevel}
                  onChange={(e) => updateField('knowledgeLevel', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Beginner</option>
                  <option>Basic</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
