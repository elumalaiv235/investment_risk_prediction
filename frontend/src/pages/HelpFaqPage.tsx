import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const HelpFaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Assessment & Engine',
      q: 'How often should I retake my risk assessment?',
      a: 'We recommend updating your assessment every 6 to 12 months, or immediately following major life events such as a career transition, marriage, home purchase, substantial debt payoff, or market shift.',
    },
    {
      category: 'Assessment & Engine',
      q: 'Can I export my risk analysis as a PDF?',
      a: 'Yes. Every assessment generates a dedicated Printable Report. Click "Print / Save as PDF" from the result screen or history view to download or print your official report.',
    },
    {
      category: 'Security & Privacy',
      q: 'Is my financial telemetry encrypted and isolated?',
      a: 'Yes. RiskWise implements strict tenant-level authorization checks. A user can never access or query another investor\'s assessment records even if IDs are modified in the URL.',
    },
    {
      category: 'Account & Billing',
      q: 'Is RiskWise free to use?',
      a: 'Yes, the core 9-factor psychometric risk assessment engine, dashboard visualization, and history archive are 100% free for individual investors.',
    },
    {
      category: 'Methodology',
      q: 'Why does time horizon carry a 15% weight?',
      a: 'Historically, broad market indices (e.g. S&P 500, MSCI World) have a near 100% historical probability of positive returns over rolling 15-20 year periods, allowing longer-horizon investors to absorb cyclical downturns without permanent capital impairment.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Help Center & FAQs
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          How can we help you?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Find answers to common questions about our multivariate risk engine, privacy guarantees, and dashboard features.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-slate-900 dark:text-white"
            >
              <div>
                <span className="text-[10px] uppercase font-semibold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                  {faq.category}
                </span>
                <span>{faq.q}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180 text-emerald-500' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Support Box */}
      <Card className="p-8 text-center space-y-3 bg-slate-50 dark:bg-slate-900/60">
        <Mail className="w-8 h-8 text-emerald-600 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Have an inquiry or custom enterprise requirement?
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Our engineering and quantitative risk teams are available to assist you.
        </p>
        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
          support@riskwise.platform
        </p>
      </Card>
    </div>
  );
};
