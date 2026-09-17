'use client';

import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Transaction } from '../../types/financial';
import { CATEGORIES, getCategoryInfo } from '../../data/mockTransactions';
import { FinancialEngine } from '../../services/FinancialEngine';
import { TransactionDetailModal } from './TransactionDetailModal';

interface TransactionTableProps {
  transactions: Transaction[];
  initialCategory?: string;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  initialCategory = 'All',
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedType, setSelectedType] = useState<'all' | 'credit' | 'debit'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTx, setActiveTx] = useState<Transaction | null>(null);

  // Filtering
  const filtered = transactions.filter(tx => {
    const matchesSearch =
      tx.title.toLowerCase().includes(search.toLowerCase()) ||
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.reference.toLowerCase().includes(search.toLowerCase());

    const matchesCat =
      selectedCategory === 'All' ||
      tx.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesType =
      selectedType === 'all' || tx.type === selectedType;

    return matchesSearch && matchesCat && matchesType;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date') {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return sortOrder === 'asc' ? -diff : diff;
    } else {
      const diff = b.amount - a.amount;
      return sortOrder === 'asc' ? -diff : diff;
    }
  });

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
      {/* Search and Filters Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search merchant, description, reference..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#7B0046]"
          />
        </div>

        {/* Filter Badges & Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-2.5 py-1 rounded-lg transition ${
                selectedType === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('credit')}
              className={`px-2.5 py-1 rounded-lg transition ${
                selectedType === 'credit'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Inflow
            </button>
            <button
              onClick={() => setSelectedType('debit')}
              className={`px-2.5 py-1 rounded-lg transition ${
                selectedType === 'debit'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Outflow
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort Toggle */}
          <button
            onClick={() => {
              if (sortBy === 'date') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy('date');
                setSortOrder('desc');
              }
            }}
            className="flex items-center space-x-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <ArrowUpDown size={13} />
            <span>Sort by Date</span>
          </button>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="px-5 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Showing {sorted.length} transactions</span>
        <span>Click any row to inspect details or recategorize</span>
      </div>

      {/* Table for Desktop & Tablet */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              <th className="py-3 px-5">Date</th>
              <th className="py-3 px-5">Description</th>
              <th className="py-3 px-5">Category</th>
              <th className="py-3 px-5">Channel</th>
              <th className="py-3 px-5 text-right">Amount</th>
              <th className="py-3 px-5 text-right">Balance</th>
              <th className="py-3 px-5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No transactions match your search and filter criteria.
                </td>
              </tr>
            ) : (
              sorted.map(tx => {
                const cat = getCategoryInfo(tx.category);
                const isCredit = tx.type === 'credit';
                const formattedDate = new Date(tx.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <tr
                    key={tx.id}
                    onClick={() => setActiveTx(tx)}
                    className="hover:bg-slate-50/90 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-5 font-semibold text-slate-500 whitespace-nowrap">
                      {formattedDate}
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900 group-hover:text-[#7B0046] transition">
                        {tx.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate max-w-xs">
                        {tx.description}
                      </div>
                    </td>

                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span
                        className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
                        style={{
                          backgroundColor: `${cat.color}15`,
                          color: cat.color,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span>{cat.name}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {tx.paymentChannel}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right whitespace-nowrap font-mono font-bold text-sm">
                      <span className={isCredit ? 'text-[#059669]' : 'text-slate-900'}>
                        {isCredit ? '+' : '-'}
                        {FinancialEngine.formatNaira(tx.amount)}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right whitespace-nowrap font-mono font-semibold text-slate-500">
                      {FinancialEngine.formatNaira(tx.balanceAfter)}
                    </td>

                    <td className="py-3.5 px-5 text-center whitespace-nowrap">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Transaction Detail Modal */}
      {activeTx && (
        <TransactionDetailModal
          transaction={activeTx}
          onClose={() => setActiveTx(null)}
        />
      )}
    </div>
  );
};
