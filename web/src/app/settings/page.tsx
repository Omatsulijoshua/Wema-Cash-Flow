'use client';

import React, { useState } from 'react';
import { DashboardShell } from '../../components/navigation/DashboardShell';
import { useFinancialData } from '../../context/FinancialContext';
import {
  User,
  Briefcase,
  ShieldCheck,
  Bell,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function SettingsPage() {
  const {
    isBusiness,
    setBusinessMode,
    resetDemo,
  } = useFinancialData();

  const [notifications, setNotifications] = useState(true);
  const [anomalyAlerts, setAnomalyAlerts] = useState(true);
  const [rentReminders, setRentReminders] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    resetDemo();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <DashboardShell>
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Settings & Account Profile
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Manage your account type, currency, intelligence preferences, and demo parameters
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-[#7B0046] text-white font-extrabold text-xl flex items-center justify-center shadow-xs">
            OA
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-extrabold text-slate-900">Olumide Adeleke</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                <CheckCircle2 size={11} />
                <span>BVN Verified</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBusiness
                ? 'Wema SME Commercial Account · ID #0129482910'
                : 'Wema ALAT Premium Tier 3 · ID #0129482910'}
            </p>
            <span className="text-[11px] text-slate-400 font-mono">olumide.adeleke@example.ng</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-slate-500 block">Default Currency</span>
          <span className="text-sm font-bold text-slate-900 font-mono">Nigerian Naira (₦ NGN)</span>
        </div>
      </div>

      {/* Account Type Configuration */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900">Account Type</h3>
        <p className="text-xs text-slate-500">
          Switch between personal finance intelligence and commercial SME analytics.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div
            onClick={() => setBusinessMode(false)}
            className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start space-x-3 ${
              !isBusiness
                ? 'border-[#7B0046] bg-pink-50/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#7B0046] flex items-center justify-center flex-shrink-0">
              <User size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Personal Banking</div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Living expenses, groceries, ride-hailing, utilities, and personal liquidity forecasts.
              </p>
            </div>
          </div>

          <div
            onClick={() => setBusinessMode(true)}
            className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start space-x-3 ${
              isBusiness
                ? 'border-[#7B0046] bg-pink-50/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center flex-shrink-0">
              <Briefcase size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Business (SME) Mode</div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Corporate revenue tracking, supplier concentrations, logistics, and cash runway.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Intelligence & Alert Preferences */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900">Intelligence Preferences</h3>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Unusual Spending Alerts</span>
              <span className="text-slate-500">
                Trigger warnings when category spending exceeds 25% weekly deviation
              </span>
            </div>
            <input
              type="checkbox"
              checked={anomalyAlerts}
              onChange={e => setAnomalyAlerts(e.target.checked)}
              className="accent-[#7B0046] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Recurring Payment Reminders</span>
              <span className="text-slate-500">
                Flag upcoming rent and utility payments 7 days ahead
              </span>
            </div>
            <input
              type="checkbox"
              checked={rentReminders}
              onChange={e => setRentReminders(e.target.checked)}
              className="accent-[#7B0046] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Push & Email Notifications</span>
              <span className="text-slate-500">
                Receive weekly automated cash flow digests
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={e => setNotifications(e.target.checked)}
              className="accent-[#7B0046] w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Privacy & Trust Notice */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Privacy & Data Architecture</h3>
            <p className="text-xs text-slate-500 font-medium">
              Frontend banking intelligence prototype guarantees
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          All statement parsing, duplicate detection, and intelligence calculations run directly in your browser.
          No uploaded statements or receipts are transmitted to an external OCR or banking server.
          Never enter your banking PIN, OTP, or card CVV on prototype applications.
        </p>
        <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-500">
          <Lock size={13} className="text-[#059669]" />
          <span>Session-bound in-memory data store</span>
        </div>
      </div>

      {/* Data Controls & Clear */}
      <div className="bg-white border border-rose-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">Clear Stored Transactions</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Wipes all imported statements, transactions, and batches from your browser storage to start completely fresh.
          </p>
          {resetSuccess && (
            <span className="text-xs font-bold text-emerald-700 mt-2 block">
              ✓ All transaction data successfully cleared!
            </span>
          )}
        </div>

        <button
          onClick={handleReset}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition shadow-sm flex items-center space-x-2 whitespace-nowrap self-start sm:self-auto"
        >
          <RotateCcw size={14} />
          <span>Clear All Data</span>
        </button>
      </div>
    </DashboardShell>
  );
}
