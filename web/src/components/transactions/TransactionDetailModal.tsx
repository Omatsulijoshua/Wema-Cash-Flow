'use client';

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Tag, Calendar, Hash, CreditCard } from 'lucide-react';
import { Transaction } from '../../types/financial';
import { CATEGORIES, getCategoryInfo } from '../../data/mockTransactions';
import { FinancialEngine } from '../../services/FinancialEngine';
import { useFinancialData } from '../../context/FinancialContext';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
}) => {
  const { updateTransactionCategory } = useFinancialData();
  const [selectedCat, setSelectedCat] = useState<string>(transaction?.category || 'Other');
  const [justUpdated, setJustUpdated] = useState(false);

  if (!transaction) return null;

  const catInfo = getCategoryInfo(selectedCat);
  const isCredit = transaction.type === 'credit';

  const handleCategoryChange = (newCat: string) => {
    setSelectedCat(newCat);
    updateTransactionCategory(transaction.id, newCat);
    setJustUpdated(true);
    setTimeout(() => setJustUpdated(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${catInfo.color}15`, color: catInfo.color }}
          >
            <CreditCard size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Transaction Details
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
              {transaction.title}
            </h2>
          </div>
        </div>

        {/* Amount Hero */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6 text-center">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            {isCredit ? 'Credit Inflow' : 'Debit Outflow'}
          </span>
          <div
            className={`text-3xl font-black font-mono tracking-tight ${
              isCredit ? 'text-[#059669]' : 'text-slate-900'
            }`}
          >
            {isCredit ? '+' : '-'}
            {FinancialEngine.formatNaira(transaction.amount)}
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 mt-2 inline-block rounded-full bg-slate-200 text-slate-700">
            {transaction.status} via {transaction.paymentChannel}
          </span>
        </div>

        {/* AI Categorization Confidence Badge */}
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl mb-6 flex items-start space-x-3">
          <Sparkles size={18} className="text-[#059669] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950">
            <span className="font-bold block">
              Categorized as {catInfo.name} with {(transaction.categoryConfidence * 100).toFixed(0)}% confidence
            </span>
            <p className="text-emerald-800 text-[11px] mt-0.5">
              Identified automatically using transaction description and merchant telemetry.
            </p>
          </div>
        </div>

        {/* Change Category Selector */}
        <div className="mb-6">
          <label className="text-xs font-bold text-slate-700 block mb-2 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Tag size={13} />
              <span>Change Category</span>
            </span>
            {justUpdated && (
              <span className="text-emerald-600 text-[11px] font-bold flex items-center space-x-1">
                <CheckCircle2 size={12} />
                <span>Updated locally!</span>
              </span>
            )}
          </label>
          <select
            value={selectedCat}
            onChange={e => handleCategoryChange(e.target.value)}
            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7B0046] cursor-pointer"
          >
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} {c.isBusiness ? '(Business)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Transaction Metadata Grid */}
        <div className="space-y-2.5 text-xs border-t border-slate-100 pt-4 mb-6">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Description</span>
            <span className="text-slate-900 font-semibold text-right max-w-[260px] truncate">
              {transaction.description}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Reference Number</span>
            <span className="text-slate-900 font-mono font-semibold">{transaction.reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Timestamp</span>
            <span className="text-slate-900 font-semibold">{new Date(transaction.date).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Balance After</span>
            <span className="text-slate-900 font-mono font-bold">
              {FinancialEngine.formatNaira(transaction.balanceAfter)}
            </span>
          </div>
        </div>

        {/* Done CTA */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#7B0046] text-white text-xs font-bold hover:bg-[#9E1B4C] transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};
