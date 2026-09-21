import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

interface ScoreTrendData {
  id: string;
  date: string;
  formattedDate: string;
  score: number;
  category: string;
  goal: string;
}

interface Props {
  data: ScoreTrendData[];
  height?: number;
}

export const RiskScoreTrendChart: React.FC<Props> = ({ data, height = 280 }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          No historical assessment records yet.
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Take your first risk assessment to generate a risk score trendline.
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs">
          <p className="font-bold text-slate-900 dark:text-white">{point.formattedDate}</p>
          <div className="mt-1 space-y-1">
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Score: <span className="text-slate-900 dark:text-white font-bold">{point.score}/100</span>
            </p>
            <p className="text-slate-500">
              Category: <span className="text-slate-700 dark:text-slate-300 font-medium">{point.category}</span>
            </p>
            {point.goal && (
              <p className="text-slate-500">
                Goal: <span className="text-slate-700 dark:text-slate-300 font-medium">{point.goal}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} vertical={false} />
          <XAxis
            dataKey="formattedDate"
            stroke={isDark ? '#64748b' : '#94a3b8'}
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 30, 60, 80, 100]}
            stroke={isDark ? '#64748b' : '#94a3b8'}
            fontSize={11}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* Reference zones */}
          <ReferenceLine y={30} stroke="#10b981" strokeDasharray="2 2" strokeOpacity={0.4} />
          <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="2 2" strokeOpacity={0.4} />
          <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="2 2" strokeOpacity={0.4} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: isDark ? '#0f172a' : '#ffffff' }}
            activeDot={{ r: 7, strokeWidth: 3, stroke: '#10b981', fill: isDark ? '#0f172a' : '#ffffff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
