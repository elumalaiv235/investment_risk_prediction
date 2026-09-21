import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  FileText,
  ShieldCheck,
  Wallet,
  Clock,
  BookOpen,
  Activity,
  Printer,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../services/api';
import { RiskAssessment } from '../types';
import { formatDate, formatCurrency } from '../utils/formatters';
import { getCategoryMeta } from '../utils/riskCategories';
import { Button } from '../components/common/Button';
import { Card, CardHeader } from '../components/common/Card';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { RadarFactorChart } from '../components/charts/RadarFactorChart';
import { FactorExplanationCard } from '../components/risk/FactorExplanationCard';
import { PrintableReport } from '../components/risk/PrintableReport';
import { CardSkeleton } from '../components/common/Skeleton';

export const RiskDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPrintView, setShowPrintView] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.risk.getById(id);
        setAssessment(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load assessment details.');
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Assessment Not Found
        </h2>
        <p className="text-xs text-slate-500">{error || 'Unable to retrieve this record.'}</p>
        <Link to="/history">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to History
          </Button>
        </Link>
      </div>
    );
  }

  if (showPrintView) {
    return (
      <div className="py-6">
        <PrintableReport
          assessment={assessment}
          onBack={() => setShowPrintView(false)}
        />
      </div>
    );
  }

  const meta = getCategoryMeta(assessment.riskCategory);

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Top Breadcrumb & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/history"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to History Table
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPrintView(true)}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* Header Info */}
      <Card className="p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Historical Score Snapshot
            </span>
            <ScoreGauge score={assessment.riskScore} category={assessment.riskCategory} size="xl" />
          </div>

          <div className="lg:col-span-7 space-y-4 text-left">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase">
                Reference ID: #{assessment.id.slice(0, 8).toUpperCase()} • Recorded {formatDate(assessment.createdAt)}
              </span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                {assessment.riskCategory}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                {meta.description}
              </p>
            </div>

            {/* Benchmark Asset Allocation */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Target Reference Allocation:
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 text-[10px] block">Equities</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {meta.assetAllocation.cashEquities}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 text-[10px] block">Bonds</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {meta.assetAllocation.bondsFixedIncome}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 text-[10px] block">Cash</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {meta.assetAllocation.cashEquivalents}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Inputs Provided at Time of Assessment (Audit Trail) */}
      <Card className="p-6">
        <CardHeader
          title="Telemetry Inputs Snapshot"
          subtitle="The exact financial parameters and behavioral responses submitted for this evaluation"
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-1">Age</span>
            <span className="font-bold text-slate-900 dark:text-white">{assessment.age} yrs</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-1">Monthly Income</span>
            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(assessment.income)}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-1">Monthly Expenses</span>
            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(assessment.expenses)}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-1">Emergency Reserves</span>
            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(assessment.emergencyFund)}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-1">Existing Debt</span>
            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(assessment.debt)}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-1">Planned Investment</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(assessment.investmentAmount)}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-1">Time Horizon</span>
            <span className="font-bold text-slate-900 dark:text-white">{assessment.investmentHorizon}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-1">Downturn Reaction</span>
            <span className="font-bold text-slate-900 dark:text-white truncate block">{assessment.marketDownturnAction}</span>
          </div>
        </div>
      </Card>

      {/* 9-Factor Diagnostic Cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Individual Factor Scoring Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assessment.factors?.map((factor, index) => (
            <FactorExplanationCard key={index} factor={factor} />
          ))}
        </div>
      </div>
    </div>
  );
};
