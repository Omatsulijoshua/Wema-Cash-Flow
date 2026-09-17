'use client';

import React, { useState } from 'react';
import { DashboardShell } from '../../components/navigation/DashboardShell';
import { UploadDropzone } from '../../components/import/UploadDropzone';
import { ProcessingAnimation } from '../../components/import/ProcessingAnimation';
import { DuplicatesReview } from '../../components/import/DuplicatesReview';
import { useFinancialData } from '../../context/FinancialContext';
import { FinancialEngine } from '../../services/FinancialEngine';
import { FileText, CheckCircle2, History, AlertCircle, Tag, Check } from 'lucide-react';
import { CATEGORIES } from '../../data/mockTransactions';

export default function ImportPage() {
  const {
    importHistory,
    isImportCompleted,
    needsReviewList,
    resolveReview,
  } = useFinancialData();

  const [selectedReviewCat, setSelectedReviewCat] = useState<Record<string, string>>({});

  return (
    <DashboardShell>
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Import Transactions
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Upload transaction screenshots, statements or files and turn them into organized financial data.
        </p>
      </div>

      {/* Upload Dropzone */}
      <UploadDropzone />

      {/* Processing State Machine / Extraction Results */}
      <ProcessingAnimation />

      {/* Duplicates Review */}
      <DuplicatesReview />

      {/* Low-Confidence Review Transactions Panel */}
      {isImportCompleted && needsReviewList.length > 0 && (
        <div className="bg-white border border-amber-200/80 rounded-2xl p-5 sm:p-6 shadow-sm my-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Review Transactions ({needsReviewList.length} Low-Confidence Records)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                The OCR detected ambiguous merchant references. Confirm the category to finalize.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {needsReviewList.map(item => {
              const currentChoice = selectedReviewCat[item.id] || item.category;

              return (
                <div
                  key={item.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{item.title}</div>
                    <div className="text-slate-500 text-[11px] font-mono">{item.description}</div>
                    <div className="text-slate-400 text-[10px] mt-1">
                      Reference: {item.reference} · Amount: {FinancialEngine.formatNaira(item.amount)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <select
                      value={currentChoice}
                      onChange={e =>
                        setSelectedReviewCat(prev => ({ ...prev, [item.id]: e.target.value }))
                      }
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => resolveReview(item.id, currentChoice)}
                      className="px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white rounded-lg font-bold transition flex items-center space-x-1"
                    >
                      <Check size={13} />
                      <span>Confirm</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Import History */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History size={18} className="text-[#7B0046]" />
            <h2 className="text-base font-bold text-slate-900">Import History</h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {importHistory.length} Previous Ingestion Batches
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {importHistory.map(batch => {
            const dateStr = new Date(batch.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={batch.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">{dateStr}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {batch.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {batch.fileCount} files uploaded · {batch.totalDetected} transactions detected ·{' '}
                    {batch.duplicateCount} duplicate transactions removed
                  </p>
                </div>

                <div className="flex items-center space-x-4 text-xs font-mono">
                  <span className="text-slate-700 font-bold">
                    {batch.uniqueCount} Unique records
                  </span>
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px] font-semibold">
                    {batch.reviewNeededCount} reviewed
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
