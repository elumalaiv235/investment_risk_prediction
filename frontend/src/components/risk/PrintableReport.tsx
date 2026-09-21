import React from 'react';
import { Printer, ShieldCheck, Calendar, User, ArrowLeft } from 'lucide-react';
import { RiskAssessment } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getCategoryMeta } from '../../utils/riskCategories';
import { Button } from '../common/Button';

interface Props {
  assessment: RiskAssessment;
  onBack?: () => void;
}

export const PrintableReport: React.FC<Props> = ({ assessment, onBack }) => {
  const meta = getCategoryMeta(assessment.riskCategory);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800">
      {/* Action Header - Hidden during print */}
      <div className="no-print flex items-center justify-between pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
        {onBack ? (
          <Button variant="outline" size="sm" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Assessment
          </Button>
        ) : (
          <div />
        )}
        <Button
          variant="primary"
          size="md"
          onClick={handlePrint}
          leftIcon={<Printer className="w-4 h-4" />}
        >
          Print / Save as PDF
        </Button>
      </div>

      {/* Official Report Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b-2 border-slate-900 dark:border-slate-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              RISK<span className="text-emerald-500">WISE</span>
            </h1>
            <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
              Institutional Risk Profiling & Educational Report
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
          <p><span className="font-semibold text-slate-700 dark:text-slate-300">Report Ref:</span> #{assessment.id.slice(0, 8).toUpperCase()}</p>
          <p><span className="font-semibold text-slate-700 dark:text-slate-300">Generated:</span> {formatDate(assessment.createdAt)}</p>
          <p><span className="font-semibold text-slate-700 dark:text-slate-300">Engine Version:</span> v2.4 (Explainable 9-Factor Model)</p>
        </div>
      </div>

      {/* Investor & Score Summary Box */}
      <div className="my-8 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Investor Profile</h3>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{assessment.user?.name || 'Authorized User'}</p>
          <p className="text-xs text-slate-500">Age: {assessment.age} years old</p>
          <p className="text-xs text-slate-500">Goal: {assessment.investmentGoal}</p>
          <p className="text-xs text-slate-500">Horizon: {assessment.investmentHorizon}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Financial Snapshot</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Monthly Income: <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(assessment.income)}</span>
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Monthly Savings: <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(assessment.savings)}</span>
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Emergency Fund: <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(assessment.emergencyFund)}</span>
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Existing Debt: <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(assessment.debt)}</span>
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assessed Risk Score</span>
          <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400 my-1">
            {assessment.riskScore}
            <span className="text-sm text-slate-400 font-normal"> / 100</span>
          </span>
          <span
            className="text-xs font-bold uppercase px-3 py-0.5 rounded-full border"
            style={{
              backgroundColor: meta.bgColor,
              borderColor: meta.borderColor,
              color: meta.color,
            }}
          >
            {assessment.riskCategory}
          </span>
        </div>
      </div>

      {/* Suggested Reference Asset Allocation */}
      <div className="mb-8">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
          Benchmark Asset Allocation Model ({assessment.riskCategory})
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-800/30">
            <span className="text-xs text-slate-500">Public Equities / Growth</span>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
              {meta.assetAllocation.cashEquities}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-800/30">
            <span className="text-xs text-slate-500">Fixed Income / Bonds</span>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
              {meta.assetAllocation.bondsFixedIncome}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-800/30">
            <span className="text-xs text-slate-500">Cash & Equivalents</span>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
              {meta.assetAllocation.cashEquivalents}
            </p>
          </div>
        </div>
      </div>

      {/* Factor Breakdown Table */}
      <div className="mb-8">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
          Comprehensive Factor Scoring Matrix
        </h3>
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Factor Name</th>
                <th className="p-3">Weight</th>
                <th className="p-3">Score</th>
                <th className="p-3">Impact</th>
                <th className="p-3">Analytical Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {assessment.factors.map((f, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">{f.factorName}</td>
                  <td className="p-3 text-slate-500">{(f.weight * 100).toFixed(0)}%</td>
                  <td className="p-3 font-bold">{f.score}/100</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        f.impact === 'POSITIVE'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                          : f.impact === 'ATTENTION'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {f.impact}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300 leading-relaxed">{f.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Educational Recommendations */}
      {assessment.recommendations && assessment.recommendations.length > 0 && (
        <div className="mb-8 p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-3">
            Tailored Educational Next Steps
          </h3>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
            {assessment.recommendations.map((rec, i) => (
              <li key={i} className="leading-relaxed">{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Regulatory & Compliance Disclosure:</span> This assessment is generated purely for educational and informational purposes based upon inputs provided by the user. It does not constitute investment advice, legal counsel, or financial portfolio management. Historical performance is no guarantee of future results.
      </div>
    </div>
  );
};
