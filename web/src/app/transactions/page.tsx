'use client';

import React from 'react';
import { DashboardShell } from '../../components/navigation/DashboardShell';
import { TransactionTable } from '../../components/transactions/TransactionTable';
import { useFinancialData } from '../../context/FinancialContext';
import { FinancialEngine } from '../../services/FinancialEngine';
import { Receipt, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';

export default function TransactionsPage() {
  const { transactions, summary } = useFinancialData();

  return (
    <DashboardShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Transaction History & Categorization
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Search, filter, and inspect confidence scores across your 6-month ledger
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-white p-1.5 px-3 rounded-xl border border-slate-200">
          <span>{transactions.length} Total Records</span>
          <span>·</span>
          <span className="text-[#059669]">100% Normalized</span>
        </div>
      </div>

      {/* Quick Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <ArrowUpRight size={14} className="text-[#059669]" />
            <span>Total Inflows</span>
          </div>
          <div className="text-xl font-extrabold text-[#059669] font-mono">
            +{FinancialEngine.formatNaira(summary.moneyIn)}
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <ArrowDownRight size={14} className="text-[#DC2626]" />
            <span>Total Outflows</span>
          </div>
          <div className="text-xl font-extrabold text-[#DC2626] font-mono">
            -{FinancialEngine.formatNaira(summary.moneyOut)}
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <Tag size={14} className="text-[#2563EB]" />
            <span>Categorization Engine</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono">
            17 Categories
          </div>
        </div>
      </div>

      {/* Main Interactive Table */}
      <TransactionTable transactions={transactions} />
    </DashboardShell>
  );
}
