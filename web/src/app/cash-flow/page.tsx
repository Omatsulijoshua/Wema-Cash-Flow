'use client';

import React from 'react';
import { DashboardShell } from '../../components/navigation/DashboardShell';
import { useFinancialData } from '../../context/FinancialContext';
import { FinancialEngine } from '../../services/FinancialEngine';
import { CashFlowBarChart } from '../../components/charts/CashFlowBarChart';
import { ForecastLineChart } from '../../components/charts/ForecastLineChart';
import { Zap, AlertTriangle, ArrowRight, Hourglass } from 'lucide-react';
import Link from 'next/link';

export default function CashFlowPage() {
  const { isBusiness, summary } = useFinancialData();

  return (
    <DashboardShell>
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Cash Flow Analysis & Liquidity Forecast
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Examine multi-month cash movements, projected runway, and anomaly detection
        </p>
      </div>

      {/* Cash Flow Interactive Chart */}
      <CashFlowBarChart
        points={summary.chartPoints}
        title="Historical Cash Flow Trajectory"
        subtitle="Comparing inflow, outflow and retained margin across periods"
      />

      {/* 30-Day Cash-Flow Forecast */}
      <ForecastLineChart
        points={summary.chartPoints}
        currentBalance={summary.currentBalance}
        projectedBalance={summary.projectedBalance30D}
      />

      {/* Unusual Spending Anomaly Card ("Something Changed") */}
      <div className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Zap size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-extrabold text-slate-900">Something Changed</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                +41% Anomaly
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Detected unusual category acceleration compared to your 8-week baseline
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-700 font-semibold mb-4 leading-relaxed">
          Your food & dining spending this week is <span className="text-amber-800 font-bold">41% above</span> your recent weekly average.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100 text-center mb-4">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Normal Average</span>
            <span className="text-base font-extrabold text-slate-700 font-mono">₦32,000</span>
          </div>
          <div className="border-t sm:border-t-0 sm:border-l border-amber-200 pt-2 sm:pt-0">
            <span className="text-[11px] font-semibold text-slate-500 block">Current Week</span>
            <span className="text-base font-extrabold text-amber-900 font-mono">₦45,200</span>
          </div>
          <div className="border-t sm:border-t-0 sm:border-l border-amber-200 pt-2 sm:pt-0">
            <span className="text-[11px] font-semibold text-slate-500 block">Difference</span>
            <span className="text-base font-extrabold text-[#DC2626] font-mono">+₦13,200</span>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/transactions?category=Food"
            className="text-xs font-bold text-[#7B0046] hover:underline flex items-center space-x-1"
          >
            <span>Inspect food & grocery transactions</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* SME Runway Summary when Business Mode is enabled */}
      {isBusiness && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7B0046] flex items-center justify-center">
              <Hourglass size={20} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Commercial SME Runway Coverage</h3>
              <p className="text-xs text-slate-500 font-medium">
                Current operating pattern gives the business approximately 18 days of liquid cash coverage.
              </p>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
            Based on trailing operating expenses of ₦2,940,000 and outstanding payables of ₦640,000.
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
