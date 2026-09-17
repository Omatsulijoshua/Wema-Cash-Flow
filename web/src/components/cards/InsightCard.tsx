'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  AlertTriangle,
  Repeat,
  Sparkles,
  PieChart,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Insight, InsightSeverity, InsightType } from '../../types/financial';

interface InsightCardProps {
  insight: Insight;
  onAction?: () => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, onAction }) => {
  const getSeverityStyles = (severity: InsightSeverity) => {
    switch (severity) {
      case 'positive':
        return {
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          iconBg: 'bg-emerald-100 text-emerald-700',
          accent: 'text-emerald-700',
        };
      case 'warning':
        return {
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          iconBg: 'bg-amber-100 text-amber-700',
          accent: 'text-amber-800',
        };
      case 'critical':
        return {
          badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
          iconBg: 'bg-rose-100 text-rose-700',
          accent: 'text-rose-800',
        };
      case 'info':
      default:
        return {
          badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
          iconBg: 'bg-blue-100 text-blue-700',
          accent: 'text-blue-700',
        };
    }
  };

  const getIcon = (type: InsightType) => {
    switch (type) {
      case 'spending_increase':
        return <TrendingUp size={18} />;
      case 'spending_decrease':
        return <TrendingDown size={18} />;
      case 'income_increase':
      case 'revenue_trend':
        return <ArrowUpRight size={18} />;
      case 'recurring_payment':
        return <Repeat size={18} />;
      case 'unusual_spending':
      case 'low_balance_forecast':
        return <AlertTriangle size={18} />;
      case 'high_expense_category':
        return <PieChart size={18} />;
      default:
        return <Sparkles size={18} />;
    }
  };

  const styles = getSeverityStyles(insight.severity);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl ${styles.iconBg} flex items-center justify-center`}>
              {getIcon(insight.type)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {insight.title}
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                {insight.date}
              </span>
            </div>
          </div>

          <div
            className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles.badgeBg}`}
          >
            {insight.metric}
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          {insight.description}
        </p>

        {insight.contributors && insight.contributors.length > 0 && (
          <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Primary contributors:
            </div>
            <div className="space-y-1.5">
              {insight.contributors.map(c => (
                <div
                  key={c.category}
                  className="flex items-center justify-between text-xs font-semibold"
                >
                  <span className="text-slate-700">{c.category}</span>
                  <span className="text-slate-950 font-bold">{c.formattedAmount}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400">
          {insight.comparison}
        </span>
        {insight.ctaRoute && (
          <Link
            href={insight.ctaRoute}
            className="text-xs font-bold text-[#7B0046] hover:text-[#9E1B4C] inline-flex items-center space-x-1"
          >
            <span>{insight.ctaText || 'View details'}</span>
            <ArrowRight size={13} />
          </Link>
        )}
      </div>
    </div>
  );
};
