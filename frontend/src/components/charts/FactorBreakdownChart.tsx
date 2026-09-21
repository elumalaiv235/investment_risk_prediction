import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

interface FactorData {
  factor: string;
  score: number;
  fullMark: number;
}

interface Props {
  data: FactorData[];
  height?: number;
}

export const FactorBreakdownChart: React.FC<Props> = ({ data, height = 280 }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-56 text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          No factor telemetry available.
        </p>
      </div>
    );
  }

  const getBarColor = (score: number) => {
    if (score >= 70) return '#10b981'; // Emerald
    if (score >= 45) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 text-xs">
          <p className="font-bold text-slate-900 dark:text-white">{item.factor}</p>
          <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            Score: <span className="text-slate-900 dark:text-white font-bold">{item.score}/100</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} horizontal={false} />
          <XAxis type="number" domain={[0, 100]} stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} />
          <YAxis
            type="category"
            dataKey="factor"
            stroke={isDark ? '#64748b' : '#94a3b8'}
            fontSize={11}
            tickLine={false}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={16}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
