import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  FileText,
  LayoutDashboard,
  RotateCcw,
  Sparkles,
  PieChart,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { RiskAssessment } from '../types';
import { getCategoryMeta } from '../utils/riskCategories';
import { formatDate } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { Card, CardHeader } from '../components/common/Card';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { RadarFactorChart } from '../components/charts/RadarFactorChart';
import { FactorExplanationCard } from '../components/risk/FactorExplanationCard';
import { RiskProfileSummary } from '../components/risk/RiskProfileSummary';
import { PrintableReport } from '../components/risk/PrintableReport';

export const RiskResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPrintView, setShowPrintView] = useState(false);

  const assessment: RiskAssessment | undefined = (location.state as any)?.assessment;

  if (!assessment) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          No Recent Assessment Found
        </h2>
        <p className="text-xs text-slate-500">
          Please submit an assessment to view calibrated risk scoring and factor breakdown.
        </p>
        <Link to="/assess">
          <Button variant="primary" size="md">
            Start Assessment Now
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
    <div className="space-y-10 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* 1. SUCCESS CONFIRMATION BANNER */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              Assessment completed and saved successfully!
            </h4>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
              Stored securely under Assessment ID: #{assessment.id.slice(0, 8).toUpperCase()} • {formatDate(assessment.createdAt)}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPrintView(true)}
          leftIcon={<FileText className="w-4 h-4" />}
        >
          Printable Report
        </Button>
      </div>

      {/* 2. HERO SCORE SECTION */}
      <Card className="p-8 shadow-xl border-2 border-emerald-500/20 relative overflow-hidden bg-gradient-to-b from-white via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Score Gauge */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Calculated Risk Score
            </span>
            <ScoreGauge score={assessment.riskScore} category={assessment.riskCategory} size="xl" />
          </div>

          {/* Right: Category Narrative & Actions */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Risk Tier Calibration
              </span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                {assessment.riskCategory}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                {meta.description}
              </p>
            </div>

            {/* Benchmark Asset Allocation */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Suggested Benchmark Allocation:
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

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/dashboard">
                <Button variant="primary" size="md" leftIcon={<LayoutDashboard className="w-4 h-4" />}>
                  Go to Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowPrintView(true)}
                leftIcon={<FileText className="w-4 h-4" />}
              >
                View Full PDF Report
              </Button>
              <Link to="/assess">
                <Button variant="ghost" size="md" leftIcon={<RotateCcw className="w-4 h-4" />}>
                  Retake Assessment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. MULTI-AXIS RADAR & 5-DIMENSION SUMMARY */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Risk Profile Summary & Multi-Axis Diagnosis
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            A granular overview of the 5 financial pillars shaping your overall score.
          </p>
        </div>

        <RiskProfileSummary radarScores={assessment.radarScores} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <Card className="lg:col-span-5 p-6">
            <CardHeader
              title="Pillar Balance Radar"
              subtitle="Spiderweb diagram across 5 key dimensions"
            />
            <RadarFactorChart scores={assessment.radarScores} height={260} />
          </Card>

          {/* Key Factor Highlights (Positive vs Attention) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Positive Factors */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Primary Positive Risk Factors</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                {assessment.positiveFactors?.map((f, i) => (
                  <li key={i} className="leading-relaxed">{f}</li>
                ))}
              </ul>
            </div>

            {/* Attention Factors */}
            {assessment.attentionFactors && assessment.attentionFactors.length > 0 && (
              <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Risk Factors Requiring Attention</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                  {assessment.attentionFactors.map((f, i) => (
                    <li key={i} className="leading-relaxed">{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. WHY YOU RECEIVED THIS RESULT (All 9 Factors Cards) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Why You Received This Result: 9-Factor Diagnostic
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed mathematical and behavioral breakdown for each evaluated factor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assessment.factors?.map((factor, index) => (
            <FactorExplanationCard key={index} factor={factor} />
          ))}
        </div>
      </div>

      {/* 5. STRATEGIC EDUCATIONAL RECOMMENDATIONS */}
      {assessment.recommendations && assessment.recommendations.length > 0 && (
        <Card className="p-6 sm:p-8 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-3">
            <Lightbulb className="w-5 h-5 text-emerald-600" />
            <span>Educational Action Plan & Suggestions</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Suggestions tailored to bolster your weak areas and optimize long-term portfolio resiliency:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {assessment.recommendations.map((rec, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 6. DISCLAIMER */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Important Disclaimer:</span> This assessment is educational and informational only. It does not constitute financial, investment, tax, or legal advice, and it does not guarantee investment performance.
      </div>
    </div>
  );
};
