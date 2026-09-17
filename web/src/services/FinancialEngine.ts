import { CashFlowSummary, CashFlowPoint, CategoryBreakdown, Insight, Transaction } from '../types/financial';

export class FinancialEngine {
  static formatNaira(amount: number): string {
    const isNegative = amount < 0;
    const abs = Math.abs(Math.round(amount));
    const formatted = abs.toLocaleString('en-NG');
    return `${isNegative ? '-' : ''}₦${formatted}`;
  }

  static calculateSummary(transactions: Transaction[], isBusiness: boolean = false): CashFlowSummary {
    if (!transactions || transactions.length === 0) {
      return {
        currentBalance: 0,
        moneyIn: 0,
        moneyOut: 0,
        netCashFlow: 0,
        moneyInTrendPercent: 0,
        moneyOutTrendPercent: 0,
        projectedBalance30D: 0,
        runwayDays: 0,
        outstandingCommitments: 0,
        chartPoints: [],
        categoryBreakdowns: [],
      };
    }

    // Sort transactions by date ascending
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let moneyIn = 0;
    let moneyOut = 0;
    const categoryMap = new Map<string, { amount: number; count: number }>();

    for (const tx of sorted) {
      const amt = Math.abs(tx.amount);
      if (tx.type === 'credit') {
        moneyIn += amt;
      } else {
        moneyOut += amt;
        const cat = tx.category || 'Other';
        const existing = categoryMap.get(cat) || { amount: 0, count: 0 };
        existing.amount += amt;
        existing.count += 1;
        categoryMap.set(cat, existing);
      }
    }

    const netCashFlow = moneyIn - moneyOut;

    // Current balance: use the latest transaction's balanceAfter if valid, otherwise net cash flow
    const latestTx = sorted[sorted.length - 1];
    const currentBalance =
      latestTx.balanceAfter !== undefined && latestTx.balanceAfter !== null
        ? latestTx.balanceAfter
        : Math.max(0, netCashFlow);

    // Category breakdowns
    const categoryBreakdowns: CategoryBreakdown[] = [];
    if (moneyOut > 0) {
      for (const [category, data] of categoryMap.entries()) {
        const percentage = Math.round((data.amount / moneyOut) * 1000) / 10;
        categoryBreakdowns.push({
          category,
          amount: data.amount,
          percentage,
          count: data.count,
        });
      }
      categoryBreakdowns.sort((a, b) => b.amount - a.amount);
    }

    // Chart points: Group by month
    const monthMap = new Map<string, { income: number; expense: number }>();
    for (const tx of sorted) {
      const d = new Date(tx.date);
      const monthKey = !isNaN(d.getTime())
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        : '2026-01';
      const current = monthMap.get(monthKey) || { income: 0, expense: 0 };
      if (tx.type === 'credit') {
        current.income += Math.abs(tx.amount);
      } else {
        current.expense += Math.abs(tx.amount);
      }
      monthMap.set(monthKey, current);
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartPoints: CashFlowPoint[] = [];
    let runningBalance = 0;

    const sortedMonthKeys = Array.from(monthMap.keys()).sort();
    for (const key of sortedMonthKeys) {
      const data = monthMap.get(key)!;
      const [, m] = key.split('-');
      const monthIndex = parseInt(m, 10) - 1;
      const dateLabel = monthNames[monthIndex] || key;
      const net = data.income - data.expense;
      runningBalance += net;

      chartPoints.push({
        dateLabel,
        income: data.income,
        expense: data.expense,
        net,
        balance: runningBalance,
        isForecast: false,
      });
    }

    // Dynamic runway & 30-day forecast
    let runwayDays = 0;
    let projectedBalance30D = currentBalance;

    if (sorted.length > 1) {
      const firstDate = new Date(sorted[0].date).getTime();
      const lastDate = new Date(sorted[sorted.length - 1].date).getTime();
      const totalDays = Math.max(1, Math.round((lastDate - firstDate) / (1000 * 60 * 60 * 24)));
      const dailyBurn = moneyOut / totalDays;
      const dailyIncome = moneyIn / totalDays;

      if (dailyBurn > 0) {
        runwayDays = Math.max(1, Math.round(currentBalance / dailyBurn));
      } else {
        runwayDays = 90;
      }

      const projectedOut = dailyBurn * 30;
      const projectedIn = dailyIncome * 30;
      projectedBalance30D = Math.max(0, Math.round(currentBalance + projectedIn - projectedOut));

      // Add projected point to chart if we have at least 1 month
      if (chartPoints.length > 0) {
        chartPoints.push({
          dateLabel: 'Next 30D (Proj)',
          income: Math.round(projectedIn),
          expense: Math.round(projectedOut),
          net: Math.round(projectedIn - projectedOut),
          balance: projectedBalance30D,
          isForecast: true,
        });
      }
    }

    return {
      currentBalance,
      moneyIn,
      moneyOut,
      netCashFlow,
      moneyInTrendPercent: 0,
      moneyOutTrendPercent: 0,
      projectedBalance30D,
      runwayDays,
      outstandingCommitments: 0,
      chartPoints,
      categoryBreakdowns,
    };
  }

  static generateInsights(transactions: Transaction[], summary: CashFlowSummary, isBusiness: boolean = false): Insight[] {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    const insights: Insight[] = [];

    // 1. Cash flow direction
    if (summary.netCashFlow >= 0) {
      insights.push({
        id: 'ins-pos-flow',
        type: 'positive_cash_flow',
        title: 'Positive Cash Flow',
        description: `Your total inflows (${this.formatNaira(summary.moneyIn)}) exceeded your outflows (${this.formatNaira(summary.moneyOut)}) by ${this.formatNaira(summary.netCashFlow)}.`,
        severity: 'positive',
        metric: `+${this.formatNaira(summary.netCashFlow)}`,
        comparison: 'Net surplus',
        date: new Date().toISOString().split('T')[0],
      });
    } else {
      insights.push({
        id: 'ins-neg-flow',
        type: 'spending_increase',
        title: 'Outflows Exceeded Inflows',
        description: `Your total spending (${this.formatNaira(summary.moneyOut)}) was greater than income (${this.formatNaira(summary.moneyIn)}) by ${this.formatNaira(Math.abs(summary.netCashFlow))}.`,
        severity: 'warning',
        metric: `-${this.formatNaira(Math.abs(summary.netCashFlow))}`,
        comparison: 'Deficit',
        date: new Date().toISOString().split('T')[0],
        ctaText: 'Review expenses',
        ctaRoute: '/transactions',
      });
    }

    // 2. Top spending category
    if (summary.categoryBreakdowns.length > 0) {
      const topCat = summary.categoryBreakdowns[0];
      insights.push({
        id: 'ins-top-cat',
        type: 'high_expense_category',
        title: `Top Spending: ${topCat.category}`,
        description: `${topCat.category} represents ${topCat.percentage}% of your total expenses (${this.formatNaira(topCat.amount)} across ${topCat.count} transactions).`,
        severity: topCat.percentage > 35 ? 'warning' : 'info',
        metric: `${topCat.percentage}%`,
        comparison: this.formatNaira(topCat.amount),
        date: new Date().toISOString().split('T')[0],
        ctaText: 'View transactions',
        ctaRoute: '/transactions',
      });
    }

    // 3. Runway Status
    if (summary.runwayDays > 0) {
      const isLow = summary.runwayDays < 15;
      insights.push({
        id: 'ins-runway',
        type: 'low_balance_forecast',
        title: isBusiness ? 'Operating Runway Status' : 'Cash Runway Estimate',
        description: `Based on your recent average daily burn rate, your current balance provides approximately ${summary.runwayDays} days of coverage.`,
        severity: isLow ? 'critical' : 'info',
        metric: `${summary.runwayDays} Days`,
        comparison: 'Estimated runway',
        date: new Date().toISOString().split('T')[0],
        ctaText: 'View cash-flow forecast',
        ctaRoute: '/cash-flow',
      });
    }

    return insights;
  }
}
