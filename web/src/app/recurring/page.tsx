'use client';

import React from 'react';
import { DashboardShell } from '../../components/navigation/DashboardShell';
import { useFinancialData } from '../../context/FinancialContext';
import { FinancialEngine } from '../../services/FinancialEngine';
import { Repeat, Calendar, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';
import { getCategoryInfo } from '../../data/mockTransactions';

export default function RecurringPaymentsPage() {
  const { recurringPayments } = useFinancialData();

  const totalMonthlyCommitments = recurringPayments.reduce((acc, curr) => acc + curr.amount, 0);
  const upcoming = recurringPayments.filter(r => r.status === 'upcoming');
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
          <span className="text-[11px] text-slate-400 block mt-1">Rent, Internet, Stream & Savings</span>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Upcoming in 14 Days</span>
          <span className="text-2xl font-black text-amber-900 font-mono">
            {FinancialEngine.formatNaira(175000)}
          </span>
          <span className="text-[11px] text-amber-700 block mt-1">Rent (Oct 1) & Swift (Sep 25)</span>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Detection Reliability</span>
          <span className="text-2xl font-black text-[#059669] font-mono">99.2%</span>
          <span className="text-[11px] text-emerald-700 block mt-1">Matched against 6-month cycles</span>
        </div>
      </div>

      {/* Upcoming Section */}
      <div>
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#7B0046] mb-3 flex items-center space-x-1.5">
          <Clock size={16} />
          <span>Upcoming Payments Due Soon</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcoming.map(item => {
            const cat = getCategoryInfo(item.category);
            const dateStr = new Date(item.nextDueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={item.id}
                className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      {cat.name}
                    </span>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      Due {dateStr}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">{item.provider} · {item.channel}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">{item.frequency}</span>
                  <span className="text-base font-black text-slate-900 font-mono">
                    {FinancialEngine.formatNaira(item.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Recurring Subscriptions Table */}
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
                      {item.frequency} · Provider: {item.provider}
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
    </DashboardShell>
  );
}
