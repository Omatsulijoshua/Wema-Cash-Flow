'use client';

import React, { useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Trash2, FolderOpen, AlertCircle } from 'lucide-react';
import { useFinancialData } from '../../context/FinancialContext';
import { UploadedFile } from '../../types/financial';

export const UploadDropzone: React.FC = () => {
  const {
    uploadedFiles,
    addUploadedFiles,
    removeUploadedFile,
    clearUploadedFiles,
    loadSampleFiles,
    simulateImport,
    isProcessing,
  } = useFinancialData();

  const fileInputRef = useRef<HTMLInputElement>(null);

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
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
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
          Upload transaction screenshots, statements or files
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
          Drag and drop multi-page statements or app screenshots here. Multi-file upload supported.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-6">
          <span className="px-2 py-0.5 rounded bg-slate-100">PNG</span>
          <span className="px-2 py-0.5 rounded bg-slate-100">JPG</span>
          <span className="px-2 py-0.5 rounded bg-slate-100">PDF</span>
          <span className="px-2 py-0.5 rounded bg-slate-100">CSV</span>
          <span className="px-2 py-0.5 rounded bg-slate-100">EXCEL</span>
        </div>

        {/* Quick Demo Pre-load Button */}
        <div className="inline-flex items-center space-x-2" onClick={e => e.stopPropagation()}>
          <button
            type="button"
            onClick={loadSampleFiles}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition shadow-xs"
          >
            <FolderOpen size={15} className="text-[#7B0046]" />
            <span>Load Sample Bank Statements & Screenshots (4 Demo Files)</span>
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
                Ready for AI extraction
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
              <span>Simulated client-side processing pipeline · No bank credentials stored</span>
            </div>

            <button
              onClick={simulateImport}
              disabled={isProcessing}
              className="w-full sm:w-auto px-6 py-3 bg-[#7B0046] hover:bg-[#9E1B4C] text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <UploadCloud size={16} />
              <span>Start Financial Intelligence Extraction</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
