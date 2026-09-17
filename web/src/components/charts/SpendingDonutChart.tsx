'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryBreakdown } from '../../types/financial';
import { getCategoryInfo } from '../../data/mockTransactions';
import { FinancialEngine } from '../../services/FinancialEngine';

interface SpendingDonutChartProps {
  breakdowns: CategoryBreakdown[];
  onSelectCategory?: (category: string) => void;
}

export const SpendingDonutChart: React.FC<SpendingDonutChartProps> = ({
  breakdowns,
  onSelectCategory,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const router = useRouter();

  const total = breakdowns.reduce((acc, curr) => acc + curr.amount, 0);

  // SVG Donut calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  const handleCategoryClick = (category: string) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    } else {
      router.push(`/transactions?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Where Your Money Goes</h2>
          <p className="text-xs text-slate-500 font-medium">Spending by category this month</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          {breakdowns.length} Categories
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Interactive SVG Donut */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 180 180">
            {/* Background ring */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="#F1F5F9"
              strokeWidth="24"
              fill="transparent"
            />

            {/* Slices */}
            {breakdowns.map(item => {
              const catInfo = getCategoryInfo(item.category);
              const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += item.percentage;
              const isHovered = hoveredCategory === item.category;

              return (
                <circle
                  key={item.category}
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke={catInfo.color}
                  strokeWidth={isHovered ? 28 : 24}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  fill="transparent"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredCategory(item.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  onClick={() => handleCategoryClick(item.category)}
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[11px] font-semibold text-slate-400">Total Outflow</span>
            <span className="text-base font-black text-slate-900 font-mono tracking-tight">
              {FinancialEngine.formatNaira(total)}
            </span>
          </div>
        </div>

        {/* Category Legend & List */}
        <div className="md:col-span-7 space-y-2">
          {breakdowns.map(item => {
            const catInfo = getCategoryInfo(item.category);
            const isHovered = hoveredCategory === item.category;

            return (
              <div
                key={item.category}
                onClick={() => handleCategoryClick(item.category)}
                onMouseEnter={() => setHoveredCategory(item.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${
                  isHovered ? 'bg-slate-100/90' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: catInfo.color }}
                  />
                  <span className="text-xs font-bold text-slate-800">{catInfo.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    ({item.count} txns)
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    {FinancialEngine.formatNaira(item.amount)}
                  </span>
                  <span className="text-xs font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 min-w-[36px] text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-right">
        <span className="text-xs font-semibold text-[#7B0046] hover:underline cursor-pointer">
          Click any category above to inspect transactions →
        </span>
      </div>
    </div>
  );
};
