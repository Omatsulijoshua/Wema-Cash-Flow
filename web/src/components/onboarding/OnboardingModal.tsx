'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, UploadCloud, PieChart, ArrowRight, CheckCircle2, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Show onboarding only once unless explicitly passed
    const seen = localStorage.getItem('wema_cashflow_onboarding_seen');
    if (!seen && isOpen === undefined) {
      setShow(true);
    } else if (isOpen !== undefined) {
      setShow(isOpen);
    }
  }, [isOpen]);

  const handleDismiss = () => {
    localStorage.setItem('wema_cashflow_onboarding_seen', 'true');
    setShow(false);
    if (onClose) onClose();
  };

  if (!show) return null;

  const slides = [
    {
      icon: PieChart,
      badge: 'Step 1 of 3 · Intelligence',
      title: 'Understand your money better.',
      description:
        'Wema CashFlow transforms messy transaction histories into simple, structured financial intelligence. Uncover where every Naira goes without spreadsheets.',
      previewText: 'Clear cash-flow summaries · Automated categorization · Balance runway',
    },
    {
      icon: UploadCloud,
      badge: 'Step 2 of 3 · Import Statements',
      title: 'Import your transactions.',
      description:
        'Upload screenshots from mobile banking, POS slips, or exported statements in PDF, CSV, or Excel format. Our frontend state machine detects duplicates and standardizes merchants.',
      previewText: 'Multi-statement ingestion · Timed OCR simulation · Duplicate cleaning',
    },
    {
      icon: Sparkles,
      badge: 'Step 3 of 3 · Actionable Insights',
      title: 'Get intelligent insights.',
      description:
        'Stay ahead with deterministic explanations: "Your expenses increased 23% this month", "Rent due in 14 days", or "Projected runway below ₦100k in 12 days". Ask Wema anything!',
      previewText: 'Grounded in real mathematical totals · Zero hallucinations',
    },
  ];

  const currentSlide = slides[step];
  const Icon = currentSlide.icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X size={18} />
        </button>

        {/* Slide Icon */}
        <div className="w-14 h-14 rounded-2xl bg-pink-50 text-[#7B0046] flex items-center justify-center mb-6 shadow-xs">
          <Icon size={28} />
        </div>

        {/* Badge */}
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B0046] bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100 inline-block mb-3">
          {currentSlide.badge}
        </span>

        {/* Title and Description */}
        <h2 className="text-xl font-extrabold text-slate-900 mb-2 leading-tight">
          {currentSlide.title}
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {currentSlide.description}
        </p>

        {/* Highlight pill */}
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl mb-6 text-xs font-semibold text-slate-700 flex items-center space-x-2">
          <CheckCircle2 size={16} className="text-[#059669] flex-shrink-0" />
          <span>{currentSlide.previewText}</span>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all ${
                step === i ? 'w-8 bg-[#7B0046]' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {step < slides.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="w-full py-3 bg-[#7B0046] hover:bg-[#9E1B4C] text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleDismiss}
              className="w-full py-3 bg-[#7B0046] hover:bg-[#9E1B4C] text-white text-xs font-extrabold rounded-xl shadow-md transition"
            >
              Explore Demo Now
            </button>
          )}

          <button
            onClick={handleDismiss}
            className="w-full py-2.5 bg-transparent hover:bg-slate-50 text-slate-500 text-xs font-bold rounded-xl transition"
          >
            Continue with Demo Account
          </button>
        </div>
      </div>
    </div>
  );
};
