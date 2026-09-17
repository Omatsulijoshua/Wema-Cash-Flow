'use client';

import React, { useState } from 'react';
import { DashboardShell } from '../../components/navigation/DashboardShell';
import { useFinancialData } from '../../context/FinancialContext';
import { InsightCard } from '../../components/cards/InsightCard';
import { Sparkles, Filter, CheckCircle2 } from 'lucide-react';

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
            Runway & Bills
          </button>
        </div>
      </div>

      {/* Intelligence Banner */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs text-emerald-950">
        <div className="flex items-center space-x-3">
          <Sparkles size={18} className="text-[#059669] flex-shrink-0" />
          <span>
            {isBusiness
              ? 'Computed from your corporate ledger: monitors supplier concentrations, logistics overhead, and cash runway.'
              : 'Computed from your transaction history: monitors spending velocity, upcoming rent, and unusual weekly spikes.'}
          </span>
        </div>
        <span className="hidden md:inline font-bold text-emerald-700 bg-white/80 px-2 py-0.5 rounded-full border border-emerald-200">
          Deterministic Rule Engine
        </span>
      </div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(ins => (
          <InsightCard key={ins.id} insight={ins} />
        ))}
      </div>
    </DashboardShell>
  );
}
