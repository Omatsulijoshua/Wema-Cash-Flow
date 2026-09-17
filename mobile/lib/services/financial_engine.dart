import 'package:intl/intl.dart';
import '../models/transaction_item.dart';
import '../models/cash_flow_summary.dart';
import '../models/insight_item.dart';

enum DemoScenario {
  personalNormal,
  personalHighSpending,
  personalLowBalance,
  smeGrowingRevenue,
  smeRisingExpenses,
}

class FinancialEngine {
  static final NumberFormat currencyFormatter = NumberFormat.currency(
    symbol: '₦',
    decimalDigits: 0,
  );

  static String formatCurrency(double amount) {
    return currencyFormatter.format(amount);
  }

  static CashFlowSummary calculateSummary({
    required List<TransactionItem> transactions,
    required bool isBusinessMode,
    required DemoScenario scenario,
  }) {
    // Scenario-driven authoritative figures to ensure perfect mathematical consistency with product specs
    if (!isBusinessMode) {
      if (scenario == DemoScenario.personalNormal) {
        return CashFlowSummary(
          currentBalance: 428500.0,
          moneyIn: 1840000.0,
          moneyOut: 1215400.0,
          netCashFlow: 624600.0,
          moneyInTrendPercent: 12.4,
          moneyOutTrendPercent: -8.2,
          projectedBalance30D: 92000.0,
          runwayDays: 24,
          chartPoints: _generateChartPoints(isBusiness: false, scenario: scenario),
          categoryBreakdowns: const [
            CategoryBreakdownItem(category: 'Business Revenue', amount: 388928.0, percentage: 32.0, count: 18),
            CategoryBreakdownItem(category: 'Transport', amount: 218772.0, percentage: 18.0, count: 24),
            CategoryBreakdownItem(category: 'Food', amount: 170156.0, percentage: 14.0, count: 32),
            CategoryBreakdownItem(category: 'Utilities', amount: 133694.0, percentage: 11.0, count: 9),
            CategoryBreakdownItem(category: 'Shopping', amount: 109386.0, percentage: 9.0, count: 14),
            CategoryBreakdownItem(category: 'Subscription', amount: 60770.0, percentage: 5.0, count: 6),
            CategoryBreakdownItem(category: 'Other', amount: 133694.0, percentage: 11.0, count: 16),
          ],
        );
      } else if (scenario == DemoScenario.personalHighSpending) {
        return CashFlowSummary(
          currentBalance: 145200.0,
          moneyIn: 1650000.0,
          moneyOut: 2029500.0,
          netCashFlow: -379500.0,
          moneyInTrendPercent: -4.5,
          moneyOutTrendPercent: 23.0,
          projectedBalance30D: 25000.0,
          runwayDays: 8,
          chartPoints: _generateChartPoints(isBusiness: false, scenario: scenario),
          categoryBreakdowns: const [
            CategoryBreakdownItem(category: 'Transport', amount: 487080.0, percentage: 24.0, count: 38),
            CategoryBreakdownItem(category: 'Food', amount: 426195.0, percentage: 21.0, count: 45),
            CategoryBreakdownItem(category: 'Shopping', amount: 365310.0, percentage: 18.0, count: 22),
            CategoryBreakdownItem(category: 'Business Revenue', amount: 324720.0, percentage: 16.0, count: 12),
            CategoryBreakdownItem(category: 'Utilities', amount: 223245.0, percentage: 11.0, count: 11),
            CategoryBreakdownItem(category: 'Other', amount: 202950.0, percentage: 10.0, count: 19),
          ],
        );
      } else {
        // Personal Low Balance
        return CashFlowSummary(
          currentBalance: 82400.0,
          moneyIn: 950000.0,
          moneyOut: 1340000.0,
          netCashFlow: -390000.0,
          moneyInTrendPercent: -18.2,
          moneyOutTrendPercent: 14.5,
          projectedBalance30D: 12000.0,
          runwayDays: 4,
          chartPoints: _generateChartPoints(isBusiness: false, scenario: scenario),
          categoryBreakdowns: const [
            CategoryBreakdownItem(category: 'Rent', amount: 150000.0, percentage: 28.0, count: 1),
            CategoryBreakdownItem(category: 'Food', amount: 187600.0, percentage: 25.0, count: 28),
            CategoryBreakdownItem(category: 'Transport', amount: 120600.0, percentage: 16.0, count: 18),
            CategoryBreakdownItem(category: 'Utilities', amount: 87100.0, percentage: 12.0, count: 8),
            CategoryBreakdownItem(category: 'Other', amount: 144700.0, percentage: 19.0, count: 14),
          ],
        );
      }
    } else {
      // SME Mode
      if (scenario == DemoScenario.smeRisingExpenses) {
        return CashFlowSummary(
          currentBalance: 1240000.0,
          moneyIn: 4100000.0,
          moneyOut: 4450000.0,
          netCashFlow: -350000.0,
          moneyInTrendPercent: 2.1,
          moneyOutTrendPercent: 35.4,
          projectedBalance30D: 320000.0,
          runwayDays: 9,
          outstandingCommitments: 890000.0,
          chartPoints: _generateChartPoints(isBusiness: true, scenario: scenario),
          categoryBreakdowns: const [
            CategoryBreakdownItem(category: 'Supplier', amount: 1602000.0, percentage: 36.0, count: 19),
            CategoryBreakdownItem(category: 'Salaries', amount: 1246000.0, percentage: 28.0, count: 8),
            CategoryBreakdownItem(category: 'Logistics', amount: 623000.0, percentage: 14.0, count: 26),
            CategoryBreakdownItem(category: 'Marketing', amount: 445000.0, percentage: 10.0, count: 12),
            CategoryBreakdownItem(category: 'Utilities', amount: 311500.0, percentage: 7.0, count: 5),
            CategoryBreakdownItem(category: 'Other', amount: 222500.0, percentage: 5.0, count: 9),
          ],
        );
      } else {
        // SME Growing Revenue (Default SME)
        return CashFlowSummary(
          currentBalance: 3240000.0,
          moneyIn: 4820000.0,
          moneyOut: 2940000.0,
          netCashFlow: 1880000.0,
          moneyInTrendPercent: 14.0,
          moneyOutTrendPercent: 21.0,
          projectedBalance30D: 4650000.0,
          runwayDays: 18,
          outstandingCommitments: 640000.0,
          chartPoints: _generateChartPoints(isBusiness: true, scenario: scenario),
          categoryBreakdowns: const [
            CategoryBreakdownItem(category: 'Supplier', amount: 823200.0, percentage: 28.0, count: 14),
            CategoryBreakdownItem(category: 'Salaries', amount: 735000.0, percentage: 25.0, count: 6),
            CategoryBreakdownItem(category: 'Logistics', amount: 470400.0, percentage: 16.0, count: 21),
            CategoryBreakdownItem(category: 'Rent', amount: 352800.0, percentage: 12.0, count: 1),
            CategoryBreakdownItem(category: 'Utilities', amount: 264600.0, percentage: 9.0, count: 7),
            CategoryBreakdownItem(category: 'Other', amount: 294000.0, percentage: 10.0, count: 15),
          ],
        );
      }
    }
  }

  static List<CashFlowPoint> _generateChartPoints({
    required bool isBusiness,
    required DemoScenario scenario,
  }) {
    if (!isBusiness) {
      return const [
        CashFlowPoint(dateLabel: 'Apr', income: 1450000, expense: 1120000, net: 330000, balance: 280000),
        CashFlowPoint(dateLabel: 'May', income: 1520000, expense: 1390000, net: 130000, balance: 310000),
        CashFlowPoint(dateLabel: 'Jun', income: 1600000, expense: 1280000, net: 320000, balance: 350000),
        CashFlowPoint(dateLabel: 'Jul', income: 1720000, expense: 1410000, net: 310000, balance: 385000),
        CashFlowPoint(dateLabel: 'Aug', income: 1637000, expense: 1324000, net: 313000, balance: 412000),
        CashFlowPoint(dateLabel: 'Sep', income: 1840000, expense: 1215400, net: 624600, balance: 428500),
        CashFlowPoint(dateLabel: 'Oct (Proj)', income: 1750000, expense: 1350000, net: 400000, balance: 468500, isForecast: true),
      ];
    } else {
      return const [
        CashFlowPoint(dateLabel: 'Apr', income: 3200000, expense: 2100000, net: 1100000, balance: 1800000),
        CashFlowPoint(dateLabel: 'May', income: 3650000, expense: 2350000, net: 1300000, balance: 2150000),
        CashFlowPoint(dateLabel: 'Jun', income: 3900000, expense: 2500000, net: 1400000, balance: 2450000),
        CashFlowPoint(dateLabel: 'Jul', income: 4200000, expense: 2680000, net: 1520000, balance: 2780000),
        CashFlowPoint(dateLabel: 'Aug', income: 4228000, expense: 2429700, net: 1798300, balance: 2950000),
        CashFlowPoint(dateLabel: 'Sep', income: 4820000, expense: 2940000, net: 1880000, balance: 3240000),
        CashFlowPoint(dateLabel: 'Oct (Proj)', income: 5100000, expense: 3150000, net: 1950000, balance: 3800000, isForecast: true),
      ];
    }
  }

  static List<InsightItem> generateInsights({
    required bool isBusinessMode,
    required DemoScenario scenario,
  }) {
    if (!isBusinessMode) {
      return [
        InsightItem(
          id: 'ins-1',
          type: InsightType.spendingIncrease,
          title: 'Spending Increased',
          description: 'Your expenses increased by 23% this month compared to your 3-month baseline.',
          severity: InsightSeverity.warning,
          metric: '+23%',
          comparison: 'vs last month average',
          date: DateTime(2026, 9, 16),
          ctaText: 'View transactions',
          ctaRoute: '/transactions',
          contributors: const [
            ContributorItem(category: 'Transport', amount: 34200, formattedAmount: '+₦34,200'),
            ContributorItem(category: 'Business', amount: 82500, formattedAmount: '+₦82,500'),
            ContributorItem(category: 'Shopping', amount: 21300, formattedAmount: '+₦21,300'),
          ],
        ),
        InsightItem(
          id: 'ins-2',
          type: InsightType.recurringPayment,
          title: 'Upcoming Recurring Payment',
          description: 'Your usual ₦150,000 rent payment is scheduled to be due around October 1.',
          severity: InsightSeverity.info,
          metric: '₦150,000',
          comparison: 'Due Oct 1 (in 14 days)',
          date: DateTime(2026, 9, 15),
          ctaText: 'View recurring payments',
          ctaRoute: '/recurring',
        ),
        InsightItem(
          id: 'ins-3',
          type: InsightType.lowBalanceForecast,
          title: 'Balance Forecast Alert',
          description: 'Based on your recent spending velocity, your liquid balance may fall below ₦100,000 in approximately 12 days.',
          severity: InsightSeverity.warning,
          metric: '12 Days',
          comparison: 'Estimated runway',
          date: DateTime(2026, 9, 14),
          ctaText: 'View cash-flow forecast',
          ctaRoute: '/cash-flow',
        ),
        InsightItem(
          id: 'ins-4',
          type: InsightType.unusualSpending,
          title: 'Something Changed: Food Surge',
          description: 'Your food spending this week is 41% above your recent weekly average.',
          severity: InsightSeverity.critical,
          metric: '+41%',
          comparison: '₦45,200 current vs ₦32,000 normal average (+₦13,200)',
          date: DateTime(2026, 9, 14),
          ctaText: 'See transactions',
          ctaRoute: '/transactions',
        ),
        InsightItem(
          id: 'ins-5',
          type: InsightType.positiveCashFlow,
          title: 'Positive Cash Inflow',
          description: 'Total income of ₦1,840,000 outpaced outflow by ₦624,600, boosting liquidity reserve.',
          severity: InsightSeverity.positive,
          metric: '+₦624,600',
          comparison: '+12.4% inflow surge',
          date: DateTime(2026, 9, 12),
        ),
      ];
    } else {
      // SME Mode Insights
      return [
        InsightItem(
          id: 'sme-ins-1',
          type: InsightType.revenueTrend,
          title: 'Revenue Expansion',
          description: 'Revenue increased 14% this month, reaching ₦4,820,000 across digital sales and client retainers.',
          severity: InsightSeverity.positive,
          metric: '+14%',
          comparison: '₦4.82M vs ₦4.22M previous',
          date: DateTime(2026, 9, 16),
          ctaText: 'View revenue breakdown',
          ctaRoute: '/cash-flow',
        ),
        InsightItem(
          id: 'sme-ins-2',
          type: InsightType.spendingIncrease,
          title: 'Operating Expenses Surge',
          description: 'Operating expenses increased 21% driven by expanded supplier procurement and fuel adjustments.',
          severity: InsightSeverity.warning,
          metric: '+21%',
          comparison: '₦2,940,000 total out',
          date: DateTime(2026, 9, 15),
          ctaText: 'Review expenses',
          ctaRoute: '/transactions',
        ),
        InsightItem(
          id: 'sme-ins-3',
          type: InsightType.highExpenseCategory,
          title: 'Supplier Concentration',
          description: 'Supplier payments represent 28% of total monthly expenses (₦823,200).',
          severity: InsightSeverity.info,
          metric: '28%',
          comparison: 'Top operating cost driver',
          date: DateTime(2026, 9, 14),
          ctaText: 'View suppliers',
          ctaRoute: '/transactions',
        ),
        InsightItem(
          id: 'sme-ins-4',
          type: InsightType.lowBalanceForecast,
          title: 'Cash Runway Status',
          description: 'Current operating burn rate gives the business approximately 18 days of liquid cash coverage before receivables.',
          severity: InsightSeverity.warning,
          metric: '~18 Days',
          comparison: 'Estimated cash runway',
          date: DateTime(2026, 9, 13),
          ctaText: 'View runway forecast',
          ctaRoute: '/cash-flow',
        ),
      ];
    }
  }
}
