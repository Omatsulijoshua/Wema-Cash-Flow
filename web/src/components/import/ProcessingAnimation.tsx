'use client';

import React from 'react';
import { CheckCircle2, Circle, Loader2, Sparkles, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useFinancialData } from '../../context/FinancialContext';

export const ProcessingAnimation: React.FC = () => {
  const {
    isProcessing,
    processingStep,
    processingMessage,
    isImportCompleted,
    duplicatesCount,
    reviewsCount,
  } = useFinancialData();

  if (!isProcessing && !isImportCompleted) return null;

  const stages = [
    'Reading uploaded files and document metadata',
    'Extracting transaction timestamps and merchant lines',
    'Detecting duplicate transactions across statements',
    'Normalizing transaction currency & amount data',
    'Running smart categorization engine (17 categories)',
    'Calculating cash flow, runway, and velocity trends',
    'Generating actionable AI financial explanations',
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm my-6">
      {isProcessing && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#7B0046] flex items-center justify-center">
                <Loader2 size={22} className="animate-spin" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Analyzing your transactions...
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {processingMessage}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#7B0046] font-mono">
              Step {processingStep + 1} of 7
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-[#7B0046] transition-all duration-300 rounded-full"
              style={{ width: `${((processingStep + 1) / 7) * 100}%` }}
            />
          </div>

          {/* Stages Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {stages.map((stage, idx) => {
              const isDone = processingStep > idx;
              const isCurrent = processingStep === idx;

              return (
                <div
                  key={stage}
                  className={`p-2.5 rounded-xl border flex items-center space-x-2.5 transition text-xs ${
                    isDone
                      ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900'
                      : isCurrent
                      ? 'bg-pink-50/50 border-pink-200 text-slate-900 font-bold shadow-xs'
                      : 'bg-slate-50/40 border-slate-100 text-slate-400'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 size={16} className="text-[#059669] flex-shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 size={16} className="animate-spin text-[#7B0046] flex-shrink-0" />
                  ) : (
                    <Circle size={16} className="text-slate-300 flex-shrink-0" />
                  )}
                  <span className="truncate">{stage}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isImportCompleted && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center space-x-3 mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Check size={22} className="stroke-[3]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-emerald-950">
                Extraction & Categorization Completed
              </h3>
              <p className="text-xs text-emerald-800">
                Your transaction data has been parsed, normalized, deduplicated and integrated into your dashboard.
              </p>
            </div>
          </div>

          {/* Results Metric Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Detected</span>
              <span className="text-lg font-black text-slate-900 font-mono">287</span>
              <span className="text-[10px] text-slate-400 block">transactions</span>
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-center">
              <span className="text-[10px] font-bold text-emerald-700 block uppercase">Unique</span>
              <span className="text-lg font-black text-emerald-800 font-mono">274</span>
              <span className="text-[10px] text-emerald-600 block">normalized</span>
            </div>

            <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl text-center">
              <span className="text-[10px] font-bold text-rose-700 block uppercase">Duplicates</span>
              <span className="text-lg font-black text-rose-800 font-mono">{duplicatesCount}</span>
              <span className="text-[10px] text-rose-600 block">removed</span>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-center">
              <span className="text-[10px] font-bold text-blue-700 block uppercase">Categorized</span>
              <span className="text-lg font-black text-blue-800 font-mono">274</span>
              <span className="text-[10px] text-blue-600 block">high-confidence</span>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-center">
              <span className="text-[10px] font-bold text-amber-700 block uppercase">Need Review</span>
              <span className="text-lg font-black text-amber-900 font-mono">{reviewsCount}</span>
              <span className="text-[10px] text-amber-700 block">low-confidence</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
