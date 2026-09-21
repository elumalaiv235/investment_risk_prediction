import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { RadarScores } from '../../types';

interface Props {
  scores?: RadarScores;
  height?: number;
}

export const RadarFactorChart: React.FC<Props> = ({ scores, height = 280 }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const defaultScores: RadarScores = {
    financialCapacity: 70,
    investmentHorizon: 80,
    marketTolerance: 65,
    experienceKnowledge: 75,
    liquidityPosition: 60,
  };

  const currentScores = scores || defaultScores;

  const data = [
    { dimension: 'Financial Capacity', score: currentScores.financialCapacity, fullMark: 100 },
    { dimension: 'Time Horizon', score: currentScores.investmentHorizon, fullMark: 100 },
    { dimension: 'Market Tolerance', score: currentScores.marketTolerance, fullMark: 100 },
    { dimension: 'Experience & Literacy', score: currentScores.experienceKnowledge, fullMark: 100 },
    { dimension: 'Liquidity Position', score: currentScores.liquidityPosition, fullMark: 100 },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 text-xs">
          <p className="font-bold text-slate-900 dark:text-white">{item.dimension}</p>
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
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
          <PolarAngleAxis
            dataKey="dimension"
            stroke={isDark ? '#94a3b8' : '#64748b'}
            fontSize={11}
            tickLine={false}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={isDark ? '#475569' : '#cbd5e1'} />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Risk Profile"
            dataKey="score"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
