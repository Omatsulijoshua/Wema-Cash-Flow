'use client';

import React, { useState } from 'react';
import { DashboardShell } from '../../components/navigation/DashboardShell';
import { useFinancialData } from '../../context/FinancialContext';
import { InsightCard } from '../../components/cards/InsightCard';
import { Sparkles, UploadCloud } from 'lucide-react';
import Link from 'next/link';

export default function InsightsPage() {
  const { insights, isBusiness } = useFinancialData();
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = insights.filter(ins => {
    if (filterType === 'all') return true;
    if (filterType === 'spending') return ins.type.includes('spending') || ins.type.includes('expense');
    if (filterType === 'income') return ins.type.includes('income') || ins.type.includes('revenue') || ins.type.includes('positive');
    if (filterType === 'forecast') return ins.type.includes('forecast') || ins.type.includes('recurring');
    return true;
  });

  return (
    <DashboardShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Financial Insights
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            A clearer picture of what&apos;s happening with your money.
          </p>
        </div>

        {/* Filter Badges */}
        {insights.length > 0 && (
          <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg transition ${
                filterType === 'all'
                  ? 'bg-[#7B0046] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Insights ({insights.length})
            </button>
            <button
              onClick={() => setFilterType('spending')}
              className={`px-3 py-1 rounded-lg transition ${
                filterType === 'spending'
                  ? 'bg-[#7B0046] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Spending
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1 rounded-lg transition ${
                filterType === 'income'
                  ? 'bg-[#7B0046] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inflows
            </button>
            <button
              onClick={() => setFilterType('forecast')}
              className={`px-3 py-1 rounded-lg transition ${
                filterType === 'forecast'
                  ? 'bg-[#7B0046] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Runway
            </button>
          </div>
        )}
      </div>

      {/* Intelligence Banner */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs text-emerald-950">
        <div className="flex items-center space-x-3">
          <Sparkles size={18} className="text-[#059669] flex-shrink-0" />
          <span>
            {isBusiness
              ? 'Computed from your corporate ledger: monitors supplier concentrations, logistics overhead, and cash runway.'
              : 'Computed from your transaction history: monitors spending velocity, top categories, and cash runway.'}
          </span>
        </div>
        <span className="hidden md:inline font-bold text-emerald-700 bg-white/80 px-2 py-0.5 rounded-full border border-emerald-200">
          Deterministic Rule Engine
        </span>
      </div>

      {/* Insight Cards Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
            <Sparkles size={28} />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 mb-1">
            No Insights Generated Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
            Import your bank statement or CSV file to generate automated insights into spending velocity, highest outflow categories, and cash runway coverage.
          </p>
          <Link
            href="/import"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#7B0046] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#9E1B4C] transition"
          >
            <UploadCloud size={14} />
            <span>Import Statement / CSV</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(ins => (
            <InsightCard key={ins.id} insight={ins} />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
