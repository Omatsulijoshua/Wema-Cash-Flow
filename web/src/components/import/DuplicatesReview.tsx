'use client';

import React from 'react';
import { Copy, Trash2, Check, AlertCircle } from 'lucide-react';
import { useFinancialData } from '../../context/FinancialContext';
import { FinancialEngine } from '../../services/FinancialEngine';

export const DuplicatesReview: React.FC = () => {
  const {
    duplicates,
    keepDuplicate,
    removeDuplicate,
    isImportCompleted,
  } = useFinancialData();

  if (!isImportCompleted || duplicates.length === 0) return null;

  return (
    <div className="bg-white border border-rose-200/80 rounded-2xl p-5 sm:p-6 shadow-sm my-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Copy size={20} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Possible Duplicate Transactions Detected ({duplicates.length})
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Overlapping statements or screenshot entries matched on timestamp, amount, and reference.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
          Action Required
        </span>
      </div>

      <div className="space-y-3">
        {duplicates.map(dup => (
          <div
            key={dup.id}
            className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-900">{dup.title}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                  Duplicate Match
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{dup.description}</p>
              <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1 font-mono">
                <span>Ref: {dup.reference}</span>
                <span>·</span>
                <span>Date: {new Date(dup.date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-end sm:self-auto">
              <span className="text-sm font-mono font-bold text-rose-700">
                -{FinancialEngine.formatNaira(dup.amount)}
              </span>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => removeDuplicate(dup.id)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1"
                  title="Remove duplicate from cash flow"
                >
                  <Trash2 size={13} />
                  <span>Remove</span>
                </button>
                <button
                  onClick={() => keepDuplicate(dup.id)}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                  title="Keep both transactions"
                >
                  <Check size={13} />
                  <span>Keep</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
