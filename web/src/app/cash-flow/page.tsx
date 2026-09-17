'use client';

import React from 'react';
import { DashboardShell } from '../../components/navigation/DashboardShell';
import { useFinancialData } from '../../context/FinancialContext';
import { FinancialEngine } from '../../services/FinancialEngine';
import { CashFlowBarChart } from '../../components/charts/CashFlowBarChart';
import { ForecastLineChart } from '../../components/charts/ForecastLineChart';
import { Zap, ArrowRight, Hourglass, UploadCloud } from 'lucide-react';
import Link from 'next/link';

export default function CashFlowPage() {
  const { isBusiness, summary, transactions } = useFinancialData();

  const topCategory = summary.categoryBreakdowns.length > 0 ? summary.categoryBreakdowns[0] : null;

  return (
    <DashboardShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Cash Flow Analysis & Liquidity Forecast
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Examine cash movements, projected runway, and anomaly detection
          </p>
        </div>

        {transactions.length === 0 && (
          <Link
            href="/import"
            className="self-start sm:self-auto flex items-center space-x-2 px-3 py-1.5 bg-[#7B0046] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#9E1B4C] transition"
          >
            <UploadCloud size={14} />
            <span>Import Statement</span>
          </Link>
        )}
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

      {/* Dynamic Top Category Anomaly Card (Only shown if data exists) */}
      {topCategory && (
        <div className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Zap size={20} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-extrabold text-slate-900">Highest Outflow Category</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  {topCategory.percentage}% of Spending
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Detected significant concentration in {topCategory.category}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-700 font-semibold mb-4 leading-relaxed">
            Your {topCategory.category} spending accounts for <span className="text-amber-800 font-bold">{FinancialEngine.formatNaira(topCategory.amount)}</span> across {topCategory.count} transactions.
          </p>

          <div className="flex justify-end">
            <Link
              href={`/transactions?category=${encodeURIComponent(topCategory.category)}`}
              className="text-xs font-bold text-[#7B0046] hover:underline flex items-center space-x-1"
            >
              <span>Inspect {topCategory.category} transactions</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}

      {/* SME Runway Summary when Business Mode is enabled */}
      {isBusiness && summary.runwayDays > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7B0046] flex items-center justify-center">
              <Hourglass size={20} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Commercial SME Runway Coverage</h3>
              <p className="text-xs text-slate-500 font-medium">
                Current operating pattern gives the business approximately {summary.runwayDays} days of liquid cash coverage.
              </p>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
            Based on current reserves of {FinancialEngine.formatNaira(summary.currentBalance)} and recorded operating expenses of {FinancialEngine.formatNaira(summary.moneyOut)}.
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
