'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface FinancialMetricCardProps {
  title: string;
  amount: string;
  trendText?: string;
  isPositiveTrend?: boolean;
  icon?: React.ReactNode;
  subtitle?: string;
  variant?: 'default' | 'primary' | 'warning';
}

export const FinancialMetricCard: React.FC<FinancialMetricCardProps> = ({
  title,
  amount,
  trendText,
  isPositiveTrend = true,
  icon,
  subtitle,
  variant = 'default',
}) => {
  if (variant === 'primary') {
    return (
      <div className="rounded-2xl p-6 bg-gradient-to-br from-[#7B0046] to-[#9E1B4C] text-white shadow-sm border border-transparent">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase font-bold tracking-wider text-pink-100">
            {title}
          </span>
          {icon && <div className="text-white/80">{icon}</div>}
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          {amount}
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-pink-100">
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
            Wema Verified
          </span>
          {subtitle && <span className="opacity-90">{subtitle}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-sm hover:border-slate-300 transition flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500">{title}</span>
          {icon && (
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
              {icon}
            </div>
          )}
        </div>
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          {amount}
        </div>
      </div>

      <div>
        {trendText && (
          <div className="flex items-center space-x-1.5 text-xs font-semibold">
            {isPositiveTrend ? (
              <TrendingUp size={14} className="text-[#059669]" />
            ) : (
              <TrendingDown size={14} className="text-[#DC2626]" />
            )}
            <span className={isPositiveTrend ? 'text-[#059669]' : 'text-[#DC2626]'}>
              {trendText}
            </span>
          </div>
        )}
        {subtitle && !trendText && (
          <span className="text-xs text-slate-500 font-medium">{subtitle}</span>
        )}
      </div>
    </div>
  );
};
