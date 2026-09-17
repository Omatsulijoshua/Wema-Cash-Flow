'use client';

import React from 'react';
import Link from 'next/link';
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Hourglass,
  FileSpreadsheet,
} from 'lucide-react';
import { DashboardShell } from '../../components/navigation/DashboardShell';
import { useFinancialData } from '../../context/FinancialContext';
import { FinancialEngine } from '../../services/FinancialEngine';
import { FinancialMetricCard } from '../../components/cards/FinancialMetricCard';
import { CashFlowBarChart } from '../../components/charts/CashFlowBarChart';
import { SpendingDonutChart } from '../../components/charts/SpendingDonutChart';
import { ForecastLineChart } from '../../components/charts/ForecastLineChart';
import { InsightCard } from '../../components/cards/InsightCard';
import { getCategoryInfo } from '../../data/mockTransactions';

export default function DashboardPage() {
  const { isBusiness, summary, insights, transactions } = useFinancialData();

  const recentTransactions = transactions.slice(0, 6);

  return (
    <DashboardShell>
      {/* KPI Cards Grid */}
      {!isBusiness ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FinancialMetricCard
            variant="primary"
            title="Total Liquid Balance"
            amount={FinancialEngine.formatNaira(summary.currentBalance)}
            subtitle="Tier 3 Wema ALAT Account"
            icon={<Wallet size={22} />}
          />

          <FinancialMetricCard
            title="Money In (Inflow)"
            amount={FinancialEngine.formatNaira(summary.moneyIn)}
            trendText={`+${summary.moneyInTrendPercent}% from last month`}
            isPositiveTrend={true}
            icon={<TrendingUp size={18} className="text-[#059669]" />}
          />

          <FinancialMetricCard
            title="Money Out (Outflow)"
            amount={FinancialEngine.formatNaira(summary.moneyOut)}
            trendText={`${summary.moneyOutTrendPercent}% from last month`}
            isPositiveTrend={summary.moneyOutTrendPercent < 0}
            icon={<TrendingDown size={18} className="text-[#DC2626]" />}
          />

          <FinancialMetricCard
            title="Net Cash Flow"
            amount={`+${FinancialEngine.formatNaira(summary.netCashFlow)}`}
            trendText="Retained liquidity surplus"
            isPositiveTrend={true}
            icon={<ShieldCheck size={18} className="text-[#2563EB]" />}
          />
        </div>
      ) : (
        /* SME Mode KPIs */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <FinancialMetricCard
            variant="primary"
            title="Total Commercial Reserves"
            amount={FinancialEngine.formatNaira(summary.currentBalance)}
            subtitle="Wema SME Corporate"
            icon={<Wallet size={22} />}
          />

          <FinancialMetricCard
            title="Gross Revenue"
            amount={FinancialEngine.formatNaira(summary.moneyIn)}
            trendText={`+${summary.moneyInTrendPercent}% this month`}
            isPositiveTrend={true}
            icon={<TrendingUp size={18} className="text-[#059669]" />}
          />

          <FinancialMetricCard
            title="Operating Expenses"
            amount={FinancialEngine.formatNaira(summary.moneyOut)}
            trendText={`+${summary.moneyOutTrendPercent}% surge`}
            isPositiveTrend={false}
            icon={<TrendingDown size={18} className="text-[#DC2626]" />}
          />

          <FinancialMetricCard
            title="Net Operating Flow"
            amount={FinancialEngine.formatNaira(summary.netCashFlow)}
            trendText="Retained operating margin"
            isPositiveTrend={true}
            icon={<ShieldCheck size={18} className="text-[#2563EB]" />}
          />

          <FinancialMetricCard
            title="Estimated Runway"
            amount={`~${summary.runwayDays} Days`}
            trendText="Based on current burn rate"
            isPositiveTrend={summary.runwayDays > 14}
            icon={<Hourglass size={18} className="text-amber-600" />}
          />
        </div>
      )}

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cash Flow Bar Chart */}
        <div className="lg:col-span-7">
          <CashFlowBarChart
            points={summary.chartPoints}
            title={isBusiness ? 'SME Revenue & Expense Trends' : 'Cash Flow Trend'}
            subtitle={
              isBusiness
                ? 'Monthly operating revenue vs expense commitments'
                : 'Inflow vs Outflow over time'
            }
          />
        </div>

        {/* Where Your Money Goes Donut */}
        <div className="lg:col-span-5">
          <SpendingDonutChart breakdowns={summary.categoryBreakdowns} />
        </div>
      </div>

      {/* 30-Day Cash-Flow Forecast */}
      <ForecastLineChart
        points={summary.chartPoints}
        currentBalance={summary.currentBalance}
        projectedBalance={summary.projectedBalance30D}
      />

      {/* Dynamic Key Insights Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Key Intelligence Insights</h2>
            <p className="text-xs text-slate-500 font-medium">
              Generated automatically from your spending speed and historical records
            </p>
          </div>
          <Link
            href="/insights"
            className="text-xs font-bold text-[#7B0046] hover:underline flex items-center space-x-1"
          >
            <span>See All Insights</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.slice(0, 2).map(ins => (
            <InsightCard key={ins.id} insight={ins} />
          ))}
        </div>
      </div>

      {/* Recent Transactions Snippet */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Transactions</h2>
            <p className="text-xs text-slate-500 font-medium">
              Latest transactions synchronized with your account
            </p>
          </div>
          <Link
            href="/transactions"
            className="text-xs font-bold text-[#7B0046] hover:underline flex items-center space-x-1"
          >
            <span>View All Transactions</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentTransactions.map(tx => {
            const cat = getCategoryInfo(tx.category);
            const isCredit = tx.type === 'credit';
            const formattedDate = new Date(tx.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between hover:bg-slate-50/80 rounded-xl px-2 transition"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs"
                    style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                  >
                    {tx.category.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{tx.title}</div>
                    <div className="text-[11px] text-slate-400">
                      {formattedDate} · {cat.name} · {tx.paymentChannel}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-xs font-mono font-bold ${
                      isCredit ? 'text-[#059669]' : 'text-slate-900'
                    }`}
                  >
                    {isCredit ? '+' : '-'}
                    {FinancialEngine.formatNaira(tx.amount)}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold">
                    {(tx.categoryConfidence * 100).toFixed(0)}% AI confidence
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
