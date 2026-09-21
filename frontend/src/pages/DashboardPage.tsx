import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  TrendingUp,
  Activity,
  Calendar,
  Layers,
  ArrowRight,
  PlusCircle,
  Eye,
  CheckCircle,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { DashboardSummary } from '../types';
import { formatDate, formatCurrency } from '../utils/formatters';
import { getCategoryMeta } from '../utils/riskCategories';
import { Button } from '../components/common/Button';
import { Card, CardHeader } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { CardSkeleton, TableSkeleton } from '../components/common/Skeleton';
import { RiskScoreTrendChart } from '../components/charts/RiskScoreTrendChart';
import { CategoryDistributionChart } from '../components/charts/CategoryDistributionChart';
import { FactorBreakdownChart } from '../components/charts/FactorBreakdownChart';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await api.dashboard.getSummary();
        setSummary(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard telemetry.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
          </div>
          <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <CardSkeleton />
          </div>
          <div className="lg:col-span-4">
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const stats = summary?.stats;
  const charts = summary?.charts;
  const recent = summary?.recentAssessments || [];
  const profile = summary?.profileSummary;
  const latestMeta = getCategoryMeta(stats?.currentRiskCategory);

  return (
    <div className="space-y-8">
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name || 'Investor'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here is your live investment risk posture, historical drift, and factor telemetry.
          </p>
        </div>
        <Link to="/assess">
          <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Take New Assessment
          </Button>
        </Link>
      </div>

      {/* 2. FOUR KEY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Latest Score */}
        <Card className="p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Latest Risk Score
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {stats?.latestRiskScore !== null ? `${stats?.latestRiskScore}` : '—'}
              <span className="text-xs font-normal text-slate-400"> / 100</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {stats?.averageScore
                ? `Historical average: ${stats.averageScore}/100`
                : 'No historical assessments'}
            </p>
          </div>
        </Card>

        {/* Card 2: Current Risk Category */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Current Risk Tier
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            {stats?.latestRiskScore !== null ? (
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase border"
                style={{
                  backgroundColor: latestMeta.bgColor,
                  color: latestMeta.color,
                  borderColor: latestMeta.borderColor,
                }}
              >
                {stats?.currentRiskCategory}
              </span>
            ) : (
              <span className="text-base font-bold text-slate-400">Not Assessed Yet</span>
            )}
            <p className="text-[11px] text-slate-500 mt-2 truncate">
              {stats?.latestRiskScore !== null ? latestMeta.shortLabel + ' Tolerance' : 'Take assessment to calculate'}
            </p>
          </div>
        </Card>

        {/* Card 3: Total Assessments */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Assessments
            </span>
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {stats?.totalAssessments || 0}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Stored in secure database</p>
          </div>
        </Card>

        {/* Card 4: Last Assessment Date */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Last Evaluated
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
              {stats?.lastAssessmentDate ? formatDate(stats.lastAssessmentDate) : 'No Records'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Re-evaluate every 6 months</p>
          </div>
        </Card>
      </div>

      {/* 3. CHARTS ROW: Trendline + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Score Trend Line Chart */}
        <Card className="lg:col-span-8 p-6">
          <CardHeader
            title="Risk Score History & Trajectory"
            subtitle="Chronological risk tolerance progression based on your assessment inputs"
            action={
              <Link to="/history">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View All
                </Button>
              </Link>
            }
          />
          <RiskScoreTrendChart data={charts?.scoreTrend || []} height={260} />
        </Card>

        {/* Risk Category Distribution Donut */}
        <Card className="lg:col-span-4 p-6">
          <CardHeader
            title="Risk Distribution"
            subtitle="Breakdown across risk categories"
          />
          <CategoryDistributionChart data={charts?.categoryDistribution || []} height={260} />
        </Card>
      </div>

      {/* 4. PROFILE SNAPSHOT & FACTOR TELEMETRY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Factor Breakdown */}
        <Card className="lg:col-span-7 p-6">
          <CardHeader
            title="Latest Risk Factor Breakdown"
            subtitle="Normalized scores for individual assessment components"
          />
          <FactorBreakdownChart data={charts?.factorBreakdown || []} height={260} />
        </Card>

        {/* Investor Profile Summary */}
        <Card className="lg:col-span-5 p-6 space-y-4">
          <CardHeader
            title="Profile Blueprint"
            subtitle="Active investor preferences"
            action={
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </Link>
            }
          />
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Primary Goal</span>
              <span className="font-bold text-slate-900 dark:text-white">{profile?.investmentGoal}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Time Horizon</span>
              <span className="font-bold text-slate-900 dark:text-white">{profile?.investmentHorizon}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Knowledge Level</span>
              <span className="font-bold text-slate-900 dark:text-white">{profile?.knowledgeLevel}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Monthly Savings</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(profile?.monthlySavings, profile?.preferredCurrency)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* 5. RECENT ASSESSMENTS TABLE */}
      <Card className="p-6">
        <CardHeader
          title="Recent Assessment Logs"
          subtitle="Your most recent quantitative risk assessments"
          action={
            <Link to="/history">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Full History
              </Button>
            </Link>
          }
        />

        {recent.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <ShieldAlert className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">No risk assessments yet</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Take your first 9-factor assessment to generate your risk profile and benchmark asset allocation.
            </p>
            <Link to="/assess" className="inline-block mt-4">
              <Button variant="primary" size="sm">
                Take First Assessment
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Evaluation Date</th>
                  <th className="p-3">Risk Score</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3">Investment Goal</th>
                  <th className="p-3">Time Horizon</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recent.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      {formatDate(item.date)}
                    </td>
                    <td className="p-3">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {item.riskScore}
                        <span className="text-[10px] text-slate-400 font-normal"> / 100</span>
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge riskCategory={item.riskCategory} size="sm" />
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{item.investmentGoal}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{item.investmentHorizon}</td>
                    <td className="p-3 text-right">
                      <Link to={`/history/${item.id}`}>
                        <Button variant="ghost" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                          View Report
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
