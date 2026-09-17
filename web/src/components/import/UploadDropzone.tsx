'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Trash2, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { UploadedFile } from '../../types/financial';

export const UploadDropzone: React.FC = () => {
  const {
    uploadedFiles,
    addUploadedFiles,
    removeUploadedFile,
    clearUploadedFiles,
    importCsvContent,
    simulateImport,
    isProcessing,
  } = useFinancial();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importNotification, setImportNotification] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const rawFiles = Array.from(e.target.files);

    const newFiles: UploadedFile[] = rawFiles.map((f, i) => ({
      id: `up-${Date.now()}-${i}`,
      name: f.name,
      sizeBytes: f.size,
      fileType: f.type || 'application/octet-stream',
      status: 'uploaded',
      previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
    }));

    addUploadedFiles(newFiles);

    // If any CSV files are uploaded, parse them directly
    for (const f of rawFiles) {
      if (f.name.endsWith('.csv') || f.type.includes('csv')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content) {
            const result = importCsvContent(content, f.name);
            setImportNotification(`Imported ${result.imported} transactions from "${f.name}" (${result.duplicates} duplicates detected).`);
            setTimeout(() => setImportNotification(null), 6000);
          }
        };
        reader.readAsText(f);
      }
    }
  };

  const handleDownloadTemplate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const headers = 'Date,Description,Amount,Type,Category\n';
    const sampleRows = [
      '2026-09-01,Salary / Retainer Inflow,750000,credit,Salary',
      '2026-09-02,Ikeja Electric Prepaid Recharge,18500,debit,Utilities',
      '2026-09-03,Chowdeck Lagos Lunch,6200,debit,Food',
      '2026-09-04,Uber Trip Victoria Island,4500,debit,Transport',
      '2026-09-05,Swift Fibre Internet,25000,debit,Utilities',
    ].join('\n');

    const blob = new Blob([headers + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'wema_cashflow_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Import Toast / Banner */}
      {importNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-emerald-800 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
          <span>{importNotification}</span>
        </div>
      )}

      {/* Dropzone Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="bg-white border-2 border-dashed border-slate-300 hover:border-[#7B0046] rounded-3xl p-8 sm:p-12 text-center transition cursor-pointer group shadow-sm"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf,.csv,.xls,.xlsx"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-2xl bg-pink-50 text-[#7B0046] flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition shadow-inner">
          <UploadCloud size={32} />
        </div>

        <h3 className="text-base font-extrabold text-slate-900 mb-1">
          Upload bank statements or CSV files
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
          Drop your real CSV bank statements, PDFs, or receipts here. Multi-file upload supported.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-6">
          <span className="px-2 py-0.5 rounded bg-slate-100">CSV</span>
          <span className="px-2 py-0.5 rounded bg-slate-100">PDF</span>
          <span className="px-2 py-0.5 rounded bg-slate-100">PNG</span>
          <span className="px-2 py-0.5 rounded bg-slate-100">JPG</span>
        </div>

        {/* Download CSV Template Button */}
        <div className="inline-flex items-center space-x-2" onClick={e => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition shadow-xs"
          >
            <Download size={14} className="text-[#7B0046]" />
            <span>Download CSV Statement Template</span>
          </button>
        </div>
      </div>

      {/* Uploaded Files Grid */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-extrabold text-slate-900">
                Uploaded Files ({uploadedFiles.length})
              </h4>
              <span className="text-xs font-medium text-slate-400">
                Ready for processing
              </span>
            </div>
            <button
              onClick={clearUploadedFiles}
              className="text-xs font-bold text-rose-600 hover:text-rose-700"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {uploadedFiles.map(file => {
              const isImage = file.fileType.startsWith('image/');
              const isPdf = file.fileType.includes('pdf');

              return (
                <div
                  key={file.id}
                  className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between relative group"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                      {isImage ? (
                        <ImageIcon size={20} className="text-blue-600" />
                      ) : isPdf ? (
                        <FileText size={20} className="text-rose-600" />
                      ) : (
                        <FileText size={20} className="text-emerald-600" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-slate-900 truncate max-w-[140px]">
                        {file.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {formatSize(file.sizeBytes)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeUploadedFile(file.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Remove file"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Start Extraction Action CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <AlertCircle size={15} className="text-[#7B0046]" />
              <span>Client-side parsing & extraction · No sensitive bank credentials stored</span>
            </div>

            <button
              onClick={simulateImport}
              disabled={isProcessing}
              className="w-full sm:w-auto px-6 py-3 bg-[#7B0046] hover:bg-[#9E1B4C] text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <UploadCloud size={16} />
              <span>Process Files</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
