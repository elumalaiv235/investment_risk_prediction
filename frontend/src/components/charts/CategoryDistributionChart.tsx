import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { RISK_CATEGORIES } from '../../utils/riskCategories';

interface Props {
  data: Array<{ name: string; value: number }>;
  height?: number;
}

export const CategoryDistributionChart: React.FC<Props> = ({ data, height = 260 }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-56 text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          No assessment history recorded.
        </p>
      </div>
    );
  }

  const categoryColorMap: Record<string, string> = {
    'LOW RISK': '#10b981',
    'MODERATE RISK': '#f59e0b',
    'HIGH RISK': '#f97316',
    'VERY HIGH RISK': '#ef4444',
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
      return (
        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 text-xs">
          <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
          <p className="text-slate-500 mt-0.5">
            {item.value} assessments ({pct}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data.filter((d) => d.value > 0)}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data
              .filter((d) => d.value > 0)
              .map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={categoryColorMap[entry.name] || '#64748b'}
                  stroke="none"
                />
              ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
