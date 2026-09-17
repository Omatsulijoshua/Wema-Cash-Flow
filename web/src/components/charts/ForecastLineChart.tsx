'use client';

import React, { useState } from 'react';
import { CashFlowPoint } from '../../types/financial';
import { FinancialEngine } from '../../services/FinancialEngine';
import { Info, Sparkles } from 'lucide-react';

interface ForecastLineChartProps {
  points: CashFlowPoint[];
  currentBalance: number;
  projectedBalance: number;
}

export const ForecastLineChart: React.FC<ForecastLineChartProps> = ({
  points,
  currentBalance,
  projectedBalance,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions
  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(...points.map(p => p.balance), 550000);
  const minVal = 0;

  const getCoordinates = (index: number, val: number) => {
    const x = paddingX + (index / (points.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);
    return { x, y };
  };

  // Build SVG path
  const coords = points.map((p, idx) => getCoordinates(idx, p.balance));

  // Split into historical coords and forecast coords
  const historicalCoords = coords.slice(0, coords.length - 1);
  const forecastCoords = coords.slice(coords.length - 2);

  const buildPathString = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    return pts.reduce((acc, curr, i) => (i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`), '');
  };

  const historicalPath = buildPathString(historicalCoords);
  const forecastPath = buildPathString(forecastCoords);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-slate-900">30-Day Cash-Flow Forecast</h2>
            <span className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
              <Sparkles size={11} />
              <span>Simulation</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Historical balance trajectory transitioning to 30-day runway projection
          </p>
        </div>

        {/* Highlight balance cards */}
        <div className="flex items-center space-x-2">
          <div className="p-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-right">
            <span className="text-[10px] font-semibold text-slate-500 block">Current Balance</span>
            <span className="text-sm font-extrabold text-slate-900 font-mono">
              {FinancialEngine.formatNaira(currentBalance)}
            </span>
          </div>
          <div className="p-2 px-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-right">
            <span className="text-[10px] font-semibold text-amber-800 block">
              Projected in 30 Days
            </span>
            <span className="text-sm font-extrabold text-amber-950 font-mono">
              {FinancialEngine.formatNaira(projectedBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* SVG Line Graph */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56 select-none overflow-visible"
        >
          {/* Horizontal Reference Lines */}
          {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = height - paddingY - ratio * (height - 2 * paddingY);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Historical Path (Solid Blue) */}
          <path
            d={historicalPath}
            fill="none"
            stroke="#2563EB"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Forecast Path (Dashed Amber) */}
          <path
            d={forecastPath}
            fill="none"
            stroke="#D97706"
            strokeWidth="3.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Nodes */}
          {coords.map((c, idx) => {
            const p = points[idx];
            const isForecast = p.isForecast;
            const isHovered = hoveredIndex === idx;

            return (
              <g key={idx}>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isHovered ? 7 : 5}
                  fill={isForecast ? '#D97706' : '#2563EB'}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* X-axis Month Label */}
                <text
                  x={c.x}
                  y={height - 6}
                  textAnchor="middle"
                  className={`text-[11px] font-semibold ${
                    isForecast ? 'fill-amber-700 font-bold' : 'fill-slate-500'
                  }`}
                >
                  {p.dateLabel}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip on Hover */}
        {hoveredIndex !== null && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-xl px-3 py-2 text-xs shadow-lg flex items-center space-x-3 pointer-events-none"
          >
            <div>
              <span className="text-slate-400 font-semibold block text-[10px]">
                {points[hoveredIndex].dateLabel} {points[hoveredIndex].isForecast ? '(Forecast)' : '(Actual)'}
              </span>
              <span className="font-extrabold text-sm font-mono text-white">
                {FinancialEngine.formatNaira(points[hoveredIndex].balance)}
              </span>
            </div>
            <div className="border-l border-slate-700 pl-3">
              <span className="text-slate-400 text-[10px] block">Net Month</span>
              <span className="font-mono text-emerald-400 font-bold">
                {FinancialEngine.formatNaira(points[hoveredIndex].net)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Trust Notice */}
      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start space-x-2.5 text-xs text-slate-600">
        <Info size={16} className="text-slate-500 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900">Demo forecast based on recent transaction patterns.</strong>{' '}
          Calculated using trailing spending velocity and scheduled recurring commitments.
          Do not present predictions as guaranteed outcomes.
        </p>
      </div>
    </div>
  );
};
