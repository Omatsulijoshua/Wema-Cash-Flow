'use client';

import React from 'react';
import { DashboardShell } from '../../components/navigation/DashboardShell';
import { useFinancialData } from '../../context/FinancialContext';
import { FinancialEngine } from '../../services/FinancialEngine';
import { Repeat, Calendar, Clock, AlertCircle, ArrowUpRight, UploadCloud } from 'lucide-react';
import { getCategoryInfo } from '../../data/mockTransactions';
import Link from 'next/link';

export default function RecurringPaymentsPage() {
  const { recurringPayments, transactions } = useFinancialData();

  const totalMonthlyCommitments = recurringPayments.reduce((acc, curr) => acc + curr.amount, 0);
  const upcoming = recurringPayments.filter(r => r.status === 'upcoming' || r.status === 'active');
  const active = recurringPayments.filter(r => r.status === 'active');

  return (
    <DashboardShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Recurring Payments & Subscriptions
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Automatically detected recurring patterns from debit timestamps and frequencies
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold bg-white p-2 px-3 rounded-xl border border-slate-200">
          <span className="text-slate-500">Monthly Total:</span>
          <span className="text-sm font-black text-slate-900 font-mono">
            {FinancialEngine.formatNaira(totalMonthlyCommitments)}
          </span>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Active Recurring</span>
          <span className="text-2xl font-black text-slate-900 font-mono">
            {recurringPayments.length} Detected
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            {recurringPayments.length > 0 ? 'Rent, Internet & Subscriptions' : 'None detected yet'}
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Upcoming Commitments</span>
          <span className="text-2xl font-black text-amber-900 font-mono">
            {FinancialEngine.formatNaira(totalMonthlyCommitments)}
          </span>
          <span className="text-[11px] text-amber-700 block mt-1">
            {recurringPayments.length > 0 ? 'Scheduled across next 30 days' : 'No upcoming scheduled debits'}
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Detection Engine</span>
          <span className="text-2xl font-black text-[#059669] font-mono">Active</span>
          <span className="text-[11px] text-emerald-700 block mt-1">Pattern matching enabled</span>
        </div>
      </div>

      {/* Empty State or List */}
      {recurringPayments.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
            <Repeat size={28} />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 mb-1">
            No Recurring Payments Detected
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
            When you import multiple bank statements with repeated auto-debits (such as rent, fibre internet, gym, or software subscriptions), our pattern engine will automatically isolate and track them here.
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
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Active Recurring Patterns</h2>
            <span className="text-xs font-semibold text-slate-500">
              {active.length} verified subscriptions
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {active.map(item => {
              const cat = getCategoryInfo(item.category);
              const dateStr = new Date(item.nextDueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs"
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      <Repeat size={18} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                      <p className="text-[11px] text-slate-400">
                        {item.frequency} · Channel: {item.channel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-right">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">Expected Date</span>
                      <span className="text-xs font-bold text-slate-700">{dateStr}</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">Amount</span>
                      <span className="text-sm font-black text-slate-900 font-mono">
                        {FinancialEngine.formatNaira(item.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
