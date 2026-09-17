'use client';

import React, { useState } from 'react';
import { CashFlowPoint } from '../../types/financial';
import { FinancialEngine } from '../../services/FinancialEngine';

interface CashFlowBarChartProps {
  points: CashFlowPoint[];
  title?: string;
  subtitle?: string;
}

export const CashFlowBarChart: React.FC<CashFlowBarChartProps> = ({
  points,
  title = 'Cash Flow Trend',
  subtitle = 'Inflow vs Outflow over time',
}) => {
  const [selectedRange, setSelectedRange] = useState<'7D' | '30D' | '3M' | '6M' | '1Y'>('6M');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const ranges: Array<'7D' | '30D' | '3M' | '6M' | '1Y'> = ['7D', '30D', '3M', '6M', '1Y'];

  // Calculate max scale
  const maxVal = Math.max(...points.map(p => Math.max(p.income, p.expense, Math.abs(p.net))), 5000000);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Header with Title and Range Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          {ranges.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRange(r)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                selectedRange === r
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-4 mb-6 text-xs font-semibold">
        <div className="flex items-center space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#059669]" />
          <span className="text-slate-600">Money In (Inflow)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#DC2626]" />
          <span className="text-slate-600">Money Out (Outflow)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#2563EB]" />
          <span className="text-slate-600">Net Flow</span>
        </div>
      </div>

      {/* Visual Chart Area */}
      <div className="relative h-64 w-full">
        {/* Horizontal reference grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 font-medium">
          <div className="border-b border-slate-100 pb-1">₦5.0M</div>
          <div className="border-b border-slate-100 pb-1">₦3.75M</div>
          <div className="border-b border-slate-100 pb-1">₦2.5M</div>
          <div className="border-b border-slate-100 pb-1">₦1.25M</div>
          <div className="border-b border-slate-200">₦0</div>
        </div>

        {/* Bars Container */}
        <div className="absolute inset-x-8 bottom-6 top-2 flex items-end justify-around gap-2 sm:gap-4">
          {points.map((point, idx) => {
            const inHeight = (point.income / maxVal) * 100;
            const outHeight = (point.expense / maxVal) * 100;
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={point.dateLabel}
                className="relative flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-[105%] z-30 mb-2 bg-slate-900 text-white rounded-xl px-3 py-2.5 shadow-xl text-xs whitespace-nowrap min-w-[150px] pointer-events-none transition-all">
                    <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1.5 flex items-center justify-between">
                      <span>{point.dateLabel}</span>
                      {point.isForecast && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded">
                          Projected
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[#34D399]">
                        <span>Inflow:</span>
                        <span className="font-mono font-bold">
                          {FinancialEngine.formatNaira(point.income)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#F87171]">
                        <span>Outflow:</span>
                        <span className="font-mono font-bold">
                          {FinancialEngine.formatNaira(point.expense)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#60A5FA] border-t border-slate-800 pt-1 font-bold">
                        <span>Net:</span>
                        <span className="font-mono">
                          {FinancialEngine.formatNaira(point.net)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bars Pair */}
                <div className="flex items-end space-x-1 w-full max-w-[48px] h-full justify-center">
                  {/* Income Bar */}
                  <div
                    style={{ height: `${Math.max(4, inHeight)}%` }}
                    className={`w-3 sm:w-4 rounded-t-md transition-all ${
                      point.isForecast
                        ? 'bg-[#059669]/60 border border-dashed border-[#059669]'
                        : 'bg-[#059669] group-hover:brightness-110'
                    }`}
                  />
                  {/* Expense Bar */}
                  <div
                    style={{ height: `${Math.max(4, outHeight)}%` }}
                    className={`w-3 sm:w-4 rounded-t-md transition-all ${
                      point.isForecast
                        ? 'bg-[#DC2626]/60 border border-dashed border-[#DC2626]'
                        : 'bg-[#DC2626] group-hover:brightness-110'
                    }`}
                  />
                </div>

                {/* Month Label */}
                <div className="absolute -bottom-6 text-[11px] font-semibold text-slate-500 group-hover:text-slate-900 transition whitespace-nowrap">
                  {point.dateLabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>*Hover over any bar to view exact inflow, outflow, and net balance</span>
        <span>Figures in Nigerian Naira (₦)</span>
      </div>
    </div>
  );
};
