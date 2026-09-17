'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  RotateCcw,
  SlidersHorizontal,
  Briefcase,
  User,
  Menu,
  X,
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Sparkles,
  Repeat,
  UploadCloud,
  Bot,
  Settings,
} from 'lucide-react';
import { useFinancialData } from '../../context/FinancialContext';
import { DemoScenario } from '../../types/financial';

export const Header: React.FC = () => {
  const {
    isBusiness,
    scenario,
    setBusinessMode,
    setScenario,
    resetDemo,
  } = useFinancialData();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const scenarios: { label: string; value: DemoScenario }[] = [
    { label: 'Personal — Normal (₦428k)', value: 'personal_normal' },
    { label: 'Personal — High Spending (+23%)', value: 'personal_high_spending' },
    { label: 'Personal — Low Balance (Runway 12D)', value: 'personal_low_balance' },
    { label: 'SME — Growing Revenue (₦4.82M)', value: 'sme_growing_revenue' },
    { label: 'SME — Rising Expenses (Runway 9D)', value: 'sme_rising_expenses' },
  ];

  const mobileNavItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Transactions', href: '/transactions', icon: Receipt },
    { label: 'Cash Flow', href: '/cash-flow', icon: TrendingUp },
    { label: 'Insights', href: '/insights', icon: Sparkles },
    { label: 'Recurring Payments', href: '/recurring', icon: Repeat },
    { label: 'Import Statements', href: '/import', icon: UploadCloud },
    { label: 'Ask Wema', href: '/ask-wema', icon: Bot },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Mobile menu button and logo */}
        <div className="flex items-center space-x-3 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#7B0046] flex items-center justify-center text-white font-bold text-sm">
              W
            </div>
            <span className="font-extrabold text-slate-900 text-sm">Wema CashFlow</span>
          </Link>
        </div>

        {/* Desktop title context */}
        <div className="hidden md:block">
          <h1 className="text-sm font-semibold text-slate-800 flex items-center space-x-2">
            <span>Good morning 👋</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 font-normal">
              {isBusiness
                ? "Here's your SME revenue, expense surge and runway overview."
                : "Here's what's happening with your money."}
            </span>
          </h1>
        </div>

        {/* Controls: Mode Toggle, Scenario Selector, Reset Demo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mode Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold border border-slate-200/60">
            <button
              onClick={() => setBusinessMode(false)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition ${
                !isBusiness
                  ? 'bg-white text-[#7B0046] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User size={13} />
              <span className="hidden sm:inline">Personal</span>
            </button>
            <button
              onClick={() => setBusinessMode(true)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition ${
                isBusiness
                  ? 'bg-white text-[#7B0046] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Briefcase size={13} />
              <span className="hidden sm:inline">Business</span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1 rounded ml-0.5">
                SME
              </span>
            </button>
          </div>

          {/* Scenario Selector */}
          <div className="relative hidden sm:flex items-center">
            <SlidersHorizontal size={14} className="absolute left-2.5 text-slate-400 pointer-events-none" />
            <select
              value={scenario}
              onChange={e => setScenario(e.target.value as DemoScenario)}
              className="pl-8 pr-8 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-[#7B0046] cursor-pointer appearance-none"
            >
              {scenarios.map(s => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Demo Button */}
          <button
            onClick={resetDemo}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition"
            title="Reset demo data to default baseline"
          >
            <RotateCcw size={13} />
            <span className="hidden md:inline">Reset Demo</span>
          </button>

          {/* Profile Circle */}
          <Link
            href="/settings"
            className="w-8 h-8 rounded-full bg-[#7B0046] text-white flex items-center justify-center font-bold text-xs hover:ring-2 hover:ring-[#7B0046]/30 transition"
            title="Profile & Settings"
          >
            OA
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-3">
          <div className="pb-2">
            <label className="text-xs font-semibold text-slate-500 block mb-1">
              Select Demo Scenario:
            </label>
            <select
              value={scenario}
              onChange={e => {
                setScenario(e.target.value as DemoScenario);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            >
              {scenarios.map(s => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            {mobileNavItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-[#7B0046] text-white'
                      : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
