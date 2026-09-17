import { CashFlowSummary, CashFlowPoint, CategoryBreakdown, Insight, DemoScenario } from '../types/financial';

export class FinancialEngine {
  static formatNaira(amount: number): string {
    const isNegative = amount < 0;
    const abs = Math.abs(Math.round(amount));
    const formatted = abs.toLocaleString('en-NG');
    return `${isNegative ? '-' : ''}₦${formatted}`;
  }

  static calculateSummary(isBusiness: boolean, scenario: DemoScenario): CashFlowSummary {
    if (!isBusiness) {
      if (scenario === 'personal_high_spending') {
        return {
          currentBalance: 145200,
          moneyIn: 1650000,
          moneyOut: 2029500,
          netCashFlow: -379500,
          moneyInTrendPercent: -4.5,
          moneyOutTrendPercent: 23.0,
          projectedBalance30D: 25000,
          runwayDays: 8,
          outstandingCommitments: 0,
          chartPoints: this.generateChartPoints(false, scenario),
          categoryBreakdowns: [
            { category: 'Transport', amount: 487080, percentage: 24.0, count: 38 },
            { category: 'Food', amount: 426195, percentage: 21.0, count: 45 },
            { category: 'Shopping', amount: 365310, percentage: 18.0, count: 22 },
            { category: 'Business Revenue', amount: 324720, percentage: 16.0, count: 12 },
            { category: 'Utilities', amount: 223245, percentage: 11.0, count: 11 },
            { category: 'Other', amount: 202950, percentage: 10.0, count: 19 },
          ],
        };
      } else if (scenario === 'personal_low_balance') {
        return {
          currentBalance: 82400,
          moneyIn: 950000,
          moneyOut: 1340000,
          netCashFlow: -390000,
          moneyInTrendPercent: -18.2,
          moneyOutTrendPercent: 14.5,
          projectedBalance30D: 12000,
          runwayDays: 4,
          outstandingCommitments: 0,
          chartPoints: this.generateChartPoints(false, scenario),
          categoryBreakdowns: [
            { category: 'Rent', amount: 150000, percentage: 28.0, count: 1 },
            { category: 'Food', amount: 187600, percentage: 25.0, count: 28 },
            { category: 'Transport', amount: 120600, percentage: 16.0, count: 18 },
            { category: 'Utilities', amount: 87100, percentage: 12.0, count: 8 },
            { category: 'Other', amount: 144700, percentage: 19.0, count: 14 },
          ],
        };
      } else {
        // Default Personal Normal
        return {
          currentBalance: 428500,
          moneyIn: 1840000,
          moneyOut: 1215400,
          netCashFlow: 624600,
          moneyInTrendPercent: 12.4,
          moneyOutTrendPercent: -8.2,
          projectedBalance30D: 92000,
          runwayDays: 24,
          outstandingCommitments: 0,
          chartPoints: this.generateChartPoints(false, scenario),
          categoryBreakdowns: [
            { category: 'Business Revenue', amount: 388928, percentage: 32.0, count: 18 },
            { category: 'Transport', amount: 218772, percentage: 18.0, count: 24 },
            { category: 'Food', amount: 170156, percentage: 14.0, count: 32 },
            { category: 'Utilities', amount: 133694, percentage: 11.0, count: 9 },
            { category: 'Shopping', amount: 109386, percentage: 9.0, count: 14 },
            { category: 'Subscription', amount: 60770, percentage: 5.0, count: 6 },
            { category: 'Other', amount: 133694, percentage: 11.0, count: 16 },
          ],
        };
      }
    } else {
      // SME Mode
      if (scenario === 'sme_rising_expenses') {
        return {
          currentBalance: 1240000,
          moneyIn: 4100000,
          moneyOut: 4450000,
          netCashFlow: -350000,
          moneyInTrendPercent: 2.1,
          moneyOutTrendPercent: 35.4,
          projectedBalance30D: 320000,
          runwayDays: 9,
          outstandingCommitments: 890000,
          chartPoints: this.generateChartPoints(true, scenario),
          categoryBreakdowns: [
            { category: 'Supplier', amount: 1602000, percentage: 36.0, count: 19 },
            { category: 'Salaries', amount: 1246000, percentage: 28.0, count: 8 },
            { category: 'Logistics', amount: 623000, percentage: 14.0, count: 26 },
            { category: 'Marketing', amount: 445000, percentage: 10.0, count: 12 },
            { category: 'Utilities', amount: 311500, percentage: 7.0, count: 5 },
            { category: 'Other', amount: 222500, percentage: 5.0, count: 9 },
          ],
        };
      } else {
        // SME Growing Revenue
        return {
          currentBalance: 3240000,
          moneyIn: 4820000,
          moneyOut: 2940000,
          netCashFlow: 1880000,
          moneyInTrendPercent: 14.0,
          moneyOutTrendPercent: 21.0,
          projectedBalance30D: 4650000,
          runwayDays: 18,
          outstandingCommitments: 640000,
          chartPoints: this.generateChartPoints(true, scenario),
          categoryBreakdowns: [
            { category: 'Supplier', amount: 823200, percentage: 28.0, count: 14 },
            { category: 'Salaries', amount: 735000, percentage: 25.0, count: 6 },
            { category: 'Logistics', amount: 470400, percentage: 16.0, count: 21 },
            { category: 'Rent', amount: 352800, percentage: 12.0, count: 1 },
            { category: 'Utilities', amount: 264600, percentage: 9.0, count: 7 },
            { category: 'Other', amount: 294000, percentage: 10.0, count: 15 },
          ],
        };
      }
    }
  }

  static generateChartPoints(isBusiness: boolean, scenario: DemoScenario): CashFlowPoint[] {
    if (!isBusiness) {
      return [
        { dateLabel: 'Apr', income: 1450000, expense: 1120000, net: 330000, balance: 280000 },
        { dateLabel: 'May', income: 1520000, expense: 1390000, net: 130000, balance: 310000 },
        { dateLabel: 'Jun', income: 1600000, expense: 1280000, net: 320000, balance: 350000 },
        { dateLabel: 'Jul', income: 1720000, expense: 1410000, net: 310000, balance: 385000 },
        { dateLabel: 'Aug', income: 1637000, expense: 1324000, net: 313000, balance: 412000 },
        { dateLabel: 'Sep', income: 1840000, expense: 1215400, net: 624600, balance: 428500 },
        { dateLabel: 'Oct (Proj)', income: 1750000, expense: 1350000, net: 400000, balance: 468500, isForecast: true },
      ];
    } else {
      return [
        { dateLabel: 'Apr', income: 3200000, expense: 2100000, net: 1100000, balance: 1800000 },
        { dateLabel: 'May', income: 3650000, expense: 2350000, net: 1300000, balance: 2150000 },
        { dateLabel: 'Jun', income: 3900000, expense: 2500000, net: 1400000, balance: 2450000 },
        { dateLabel: 'Jul', income: 4200000, expense: 2680000, net: 1520000, balance: 2780000 },
        { dateLabel: 'Aug', income: 4228000, expense: 2429700, net: 1798300, balance: 2950000 },
        { dateLabel: 'Sep', income: 4820000, expense: 2940000, net: 1880000, balance: 3240000 },
        { dateLabel: 'Oct (Proj)', income: 5100000, expense: 3150000, net: 1950000, balance: 3800000, isForecast: true },
      ];
    }
  }

  static generateInsights(isBusiness: boolean, scenario: DemoScenario): Insight[] {
    if (!isBusiness) {
      return [
        {
          id: 'ins-1',
          type: 'spending_increase',
          title: 'Spending Increased',
          description: 'Your expenses increased by 23% this month compared to your 3-month baseline.',
          severity: 'warning',
          metric: '+23%',
          comparison: 'vs last month average',
          date: '2026-09-16',
          ctaText: 'View transactions',
          ctaRoute: '/transactions',
          contributors: [
            { category: 'Transport', amount: 34200, formattedAmount: '+₦34,200' },
            { category: 'Business', amount: 82500, formattedAmount: '+₦82,500' },
            { category: 'Shopping', amount: 21300, formattedAmount: '+₦21,300' },
          ],
        },
        {
          id: 'ins-2',
          type: 'recurring_payment',
          title: 'Upcoming Recurring Payment',
          description: 'Your usual ₦150,000 rent payment is scheduled to be due around October 1.',
          severity: 'info',
          metric: '₦150,000',
          comparison: 'Due Oct 1 (in 14 days)',
          date: '2026-09-15',
          ctaText: 'View recurring payments',
          ctaRoute: '/recurring',
        },
        {
          id: 'ins-3',
          type: 'low_balance_forecast',
          title: 'Balance Forecast Alert',
          description: 'Based on your recent spending velocity, your liquid balance may fall below ₦100,000 in approximately 12 days.',
          severity: 'warning',
          metric: '12 Days',
          comparison: 'Estimated runway',
          date: '2026-09-14',
          ctaText: 'View cash-flow forecast',
          ctaRoute: '/cash-flow',
        },
        {
          id: 'ins-4',
          type: 'unusual_spending',
          title: 'Something Changed: Food Surge',
          description: 'Your food spending this week is 41% above your recent weekly average.',
          severity: 'critical',
          metric: '+41%',
          comparison: '₦45,200 current vs ₦32,000 normal average (+₦13,200)',
          date: '2026-09-14',
          ctaText: 'See transactions',
          ctaRoute: '/transactions',
        },
        {
          id: 'ins-5',
          type: 'positive_cash_flow',
          title: 'Positive Cash Inflow',
          description: 'Total income of ₦1,840,000 outpaced outflow by ₦624,600, boosting liquidity reserve.',
          severity: 'positive',
          metric: '+₦624,600',
          comparison: '+12.4% inflow surge',
          date: '2026-09-12',
        },
      ];
    } else {
      return [
        {
          id: 'sme-ins-1',
          type: 'revenue_trend',
          title: 'Revenue Expansion',
          description: 'Revenue increased 14% this month, reaching ₦4,820,000 across digital sales and client retainers.',
          severity: 'positive',
          metric: '+14%',
          comparison: '₦4.82M vs ₦4.22M previous',
          date: '2026-09-16',
          ctaText: 'View revenue breakdown',
          ctaRoute: '/cash-flow',
        },
        {
          id: 'sme-ins-2',
          type: 'spending_increase',
          title: 'Operating Expenses Surge',
          description: 'Operating expenses increased 21% driven by expanded supplier procurement and fuel adjustments.',
          severity: 'warning',
          metric: '+21%',
          comparison: '₦2,940,000 total out',
          date: '2026-09-15',
          ctaText: 'Review expenses',
          ctaRoute: '/transactions',
        },
        {
          id: 'sme-ins-3',
          type: 'high_expense_category',
          title: 'Supplier Concentration',
          description: 'Supplier payments represent 28% of total monthly expenses (₦823,200).',
          severity: 'info',
          metric: '28%',
          comparison: 'Top operating cost driver',
          date: '2026-09-14',
          ctaText: 'View suppliers',
          ctaRoute: '/transactions',
        },
        {
          id: 'sme-ins-4',
          type: 'low_balance_forecast',
          title: 'Cash Runway Status',
          description: 'Current operating burn rate gives the business approximately 18 days of liquid cash coverage before receivables.',
          severity: 'warning',
          metric: '~18 Days',
          comparison: 'Estimated cash runway',
          date: '2026-09-13',
          ctaText: 'View runway forecast',
          ctaRoute: '/cash-flow',
        },
      ];
    }
  }
}
