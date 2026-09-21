import React from 'react';
import { getCategoryMeta } from '../../utils/riskCategories';

interface ScoreGaugeProps {
  score: number;
  category?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCategoryLabel?: boolean;
  className?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  category,
  size = 'lg',
  showCategoryLabel = true,
  className = '',
}) => {
  const meta = getCategoryMeta(category);
  const normalizedScore = Math.min(100, Math.max(0, score));

  const dimensions = {
    sm: { diameter: 90, strokeWidth: 8, fontSize: 'text-xl', labelSize: 'text-xs' },
    md: { diameter: 140, strokeWidth: 12, fontSize: 'text-3xl', labelSize: 'text-xs' },
    lg: { diameter: 200, strokeWidth: 16, fontSize: 'text-5xl', labelSize: 'text-sm' },
    xl: { diameter: 260, strokeWidth: 20, fontSize: 'text-6xl', labelSize: 'text-base' },
  };

  const { diameter, strokeWidth, fontSize, labelSize } = dimensions[size];
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={diameter}
          height={diameter}
          className="transform -rotate-90 origin-center transition-all duration-1000 ease-out"
        >
          {/* Background Track */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-100 dark:text-slate-800"
          />
          {/* Animated Value Arc */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke={meta.color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-extrabold tracking-tight text-slate-900 dark:text-white ${fontSize}`}>
            {normalizedScore}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            out of 100
          </span>
        </div>
      </div>

      {showCategoryLabel && (
        <div className="mt-3 text-center">
          <span
            className={`inline-block font-bold tracking-wide uppercase px-3 py-1 rounded-full border ${labelSize} ${meta.badgeBg} ${meta.borderColor}`}
          >
            {meta.label}
          </span>
        </div>
      )}
    </div>
  );
};
