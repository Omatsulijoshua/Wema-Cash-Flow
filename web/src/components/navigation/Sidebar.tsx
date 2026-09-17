'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Sparkles,
  Repeat,
  UploadCloud,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';
import { useFinancialData } from '../../context/FinancialContext';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { isBusiness } = useFinancialData();

  const navItems = [
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
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#7B0046] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              W
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-base block leading-tight">
                Wema CashFlow
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#7B0046]">
                {isBusiness ? 'SME Intelligence' : 'Banking Intelligence'}
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/dashboard" className="mx-auto">
            <div className="w-9 h-9 rounded-xl bg-[#7B0046] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              W
            </div>
          </Link>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Mode Badge */}
      <div className="p-3">
        <div
          className={`p-2.5 rounded-xl border flex items-center transition ${
            isBusiness
              ? 'bg-amber-50/70 border-amber-200/80 text-amber-900'
              : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
          } ${collapsed ? 'justify-center' : 'justify-between'}`}
        >
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isBusiness ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
            {!collapsed && (
              <span className="text-xs font-bold tracking-tight">
                {isBusiness ? 'Commercial SME' : 'Personal Banking'}
              </span>
            )}
          </div>
          {!collapsed && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/80 border border-slate-200/60 text-slate-600">
              Demo
            </span>
          )}
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold transition group ${
                isActive
                  ? 'bg-[#7B0046] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              } ${collapsed ? 'justify-center' : 'space-x-3'}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                size={18}
                className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Trust Badge */}
      <div className="p-3 border-t border-slate-100">
        {!collapsed ? (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
            <div className="flex items-center space-x-2 text-slate-700 font-semibold mb-1">
              <Shield size={14} className="text-[#059669]" />
              <span>Bank-Grade Prototype</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Local simulated intelligence. No real bank credentials stored.
            </p>
          </div>
        ) : (
          <div className="flex justify-center p-2 text-slate-400" title="Bank-Grade Prototype">
            <Shield size={18} className="text-[#059669]" />
          </div>
        )}
      </div>
    </aside>
  );
};
