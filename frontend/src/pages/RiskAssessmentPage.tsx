import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { RiskQuestionnaire } from '../components/risk/RiskQuestionnaire';

export const RiskAssessmentPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAssessmentSubmit = async (formData: any) => {
    setError(null);
    setLoading(true);

    try {
      const result = await api.risk.predict(formData);
      // Navigate to Result Page with the calculated assessment result
      navigate(`/assess/result`, { state: { assessment: result } });
    } catch (err: any) {
      setError(err.message || 'Failed to calculate risk assessment. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Multivariate Risk Assessment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Complete the 6-part questionnaire below to calibrate your quantitative risk tolerance score and benchmark asset allocation.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Assessment Submission Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Interactive Questionnaire Form */}
      <RiskQuestionnaire
        initialProfile={user?.profile}
        onSubmit={handleAssessmentSubmit}
        isLoading={loading}
      />
    </div>
  );
};
