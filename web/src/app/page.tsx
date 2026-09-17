'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Repeat,
  Bot,
  PieChart,
  Briefcase,
  Layers,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col selection:bg-[#7B0046] selection:text-white">
      {/* Top Navigation */}
      <nav className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#7B0046] flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
              W
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-base tracking-tight block leading-tight">
                Wema CashFlow
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#7B0046]">
                Banking Intelligence
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-xs font-bold text-slate-600">
            <a href="#problem" className="hover:text-slate-900 transition">The Problem</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition">How It Works</a>
            <a href="#features" className="hover:text-slate-900 transition">Features</a>
            <a href="#sme" className="hover:text-slate-900 transition">SME Mode</a>
            <a href="#trust" className="hover:text-slate-900 transition">Security</a>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-[#7B0046] hover:bg-[#9E1B4C] text-white text-xs font-bold transition shadow-sm flex items-center space-x-1.5"
            >
              <span>Explore Demo</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col items-center text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-[#7B0046] text-xs font-bold mb-6">
          <Sparkles size={14} />
          <span>Wema Banking Intelligence Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight max-w-4xl leading-[1.08] mb-6">
          Know where your <span className="text-[#7B0046]">money</span> is going.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mb-8">
          Wema CashFlow transforms your transaction history into simple financial insights that help you understand spending, income and cash flow.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mb-16">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#7B0046] hover:bg-[#9E1B4C] text-white text-sm font-extrabold transition shadow-md flex items-center justify-center space-x-2"
          >
            <span>Explore Demo</span>
            <ArrowRight size={16} />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition flex items-center justify-center"
          >
            See How It Works
          </a>
        </div>

        {/* Hero Visual Preview Mockup Card */}
        <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-slate-400 pl-2">
                wema.cashflow.intelligence/dashboard
              </span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Mock Simulation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block">Current Balance</span>
              <span className="text-2xl font-black text-slate-900 font-mono">₦428,500</span>
              <span className="text-[11px] font-semibold text-emerald-600 block mt-1">+12.4% vs last month</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block">Money In (Inflow)</span>
              <span className="text-2xl font-black text-[#059669] font-mono">₦1,840,000</span>
              <span className="text-[11px] font-semibold text-emerald-600 block mt-1">Salary & invoices</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block">Money Out (Outflow)</span>
              <span className="text-2xl font-black text-[#DC2626] font-mono">₦1,215,400</span>
              <span className="text-[11px] font-semibold text-emerald-600 block mt-1">-8.2% reduction</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block">Net Cash Flow</span>
              <span className="text-2xl font-black text-[#2563EB] font-mono">+₦624,600</span>
              <span className="text-[11px] font-semibold text-blue-600 block mt-1">Positive liquidity</span>
            </div>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-amber-900 font-semibold">
              <Sparkles size={16} className="text-amber-700" />
              <span>
                Smart Insight: Your expenses increased by 23% this month (Transport +₦34.2k, Business +₦82.5k).
              </span>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-[#7B0046] hover:underline whitespace-nowrap"
            >
              Open interactive dashboard →
            </Link>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7B0046] block mb-2">
            The Financial Blindspot
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mb-6">
            Transaction history tells you what happened.{' '}
            <span className="text-slate-400">It doesn't always tell you what it means.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Most bank statements are a wall of merchant codes, cryptic POS references, and endless rows.
            Individuals and SMEs can't tell if their spending speed will cause a cash crisis next week,
            or how much of their outflow went to hidden recurring subscriptions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Unclear Category Outflows</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Raw descriptions like &quot;POS CHK 881293&quot; or &quot;NIP TRF 0029&quot; hide whether money went to food, transport, or business inventory.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">No Runway Visibility</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A ₦428,500 balance looks safe until you realize ₦150,000 rent and ₦25,000 bills are due in 12 days.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Manual Data Entry Hell</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nobody has time to manually type bank receipts and screenshots into Excel sheets at night.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B0046] block mb-2">
              The Wema Intelligence Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950">
              RAW DATA → ORGANIZED → UNDERSTOOD → ACTIONABLE
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#7B0046] flex items-center justify-center mb-4 font-black">
                <UploadCloud size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">1. Import Transactions</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Drop statements or screenshots in PDF, PNG, JPG, or CSV format with instant duplicate detection.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 font-black">
                <Layers size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">2. Organize Your Data</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deterministic engine auto-categorizes entries into 17 Nigerian banking categories with confidence scores.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 font-black">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">3. Understand Cash Flow</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect 6-month historical net flow, category donut distributions, and 30-day runway forecasts.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 font-black">
                <Bot size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">4. Ask & Discover Insights</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chat with Ask Wema to know why expenses surged, verify upcoming rent, and uncover anomalies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Personal vs SME Mode Section */}
      <section id="sme" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B0046] block mb-2">
              Dual Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950">
              Engineered for Both Individuals & Nigerian SMEs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Card */}
            <div className="p-8 rounded-3xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#059669] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full inline-block mb-4">
                  Personal Finance
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mb-3">
                  Wema CashFlow Personal
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Know exactly how much goes to Uber rides, Chowdeck lunches, rent, and VTU data. Get warnings before recurring bills wipe out your liquidity.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-700 font-semibold mb-8">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 size={16} className="text-[#059669]" />
                    <span>Living expense categorization (Transport 18%, Food 14%)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 size={16} className="text-[#059669]" />
                    <span>Upcoming rent & subscription tracking (Due dates & alerts)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 size={16} className="text-[#059669]" />
                    <span>30-day liquidity forecast based on recent spending speed</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/dashboard"
                className="w-full py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50 text-center transition"
              >
                View Personal Dashboard
              </Link>
            </div>

            {/* SME Card */}
            <div className="p-8 rounded-3xl border border-amber-200 bg-amber-50/30 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full inline-block mb-4">
                  Business & SME
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mb-3">
                  Wema CashFlow Commercial SME
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Transform corporate statements into operating insights: track ₦4.82M revenue, monitor supplier cost surges (28% of outflow), and forecast days of cash runway.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-700 font-semibold mb-8">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 size={16} className="text-amber-700" />
                    <span>Enterprise categories: Supplier Payments, Logistics, Payroll</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 size={16} className="text-amber-700" />
                    <span>Estimated cash runway indicator (~18 days of operating coverage)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 size={16} className="text-amber-700" />
                    <span>Outstanding commitments & invoice settlements</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/dashboard"
                className="w-full py-2.5 rounded-xl bg-[#7B0046] text-white text-xs font-bold hover:bg-[#9E1B4C] text-center transition shadow-xs"
              >
                View SME Mode Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Prototype Disclaimer */}
      <section id="trust" className="py-16 bg-slate-50 border-t border-slate-200 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4 text-[#059669]">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 mb-2">
            Prototype Security & Architecture Note
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Wema CashFlow is a frontend banking intelligence prototype built for hackathon evaluation.
            All statement parsing, duplicate detection, and intelligence calculations execute locally or via simulated state machines.
            No real credentials, PINs, OTPs, or production banking infrastructure are contacted or stored.
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-4">
          Ready to experience Wema CashFlow?
        </h2>
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-[#7B0046] hover:bg-[#9E1B4C] text-white text-xs font-extrabold transition shadow-md"
        >
          <span>Launch Interactive Demo</span>
          <ArrowRight size={15} />
        </Link>
        <p className="text-[11px] text-slate-400 mt-6">
          © 2026 Wema CashFlow · Built with Next.js, React, TypeScript & Flutter
        </p>
      </footer>
    </div>
  );
}
