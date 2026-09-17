import 'dart:math';
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
    DemoScenario scenario = DemoScenario.personalNormal,
  }) {
    if (transactions.isEmpty) {
      return CashFlowSummary(
        currentBalance: 0.0,
        moneyIn: 0.0,
        moneyOut: 0.0,
        netCashFlow: 0.0,
        moneyInTrendPercent: 0.0,
        moneyOutTrendPercent: 0.0,
        projectedBalance30D: 0.0,
        runwayDays: 0,
        chartPoints: [],
        categoryBreakdowns: [],
      );
    }

    // Sort ascending by date
    final sorted = List<TransactionItem>.from(transactions)
      ..sort((a, b) => a.date.compareTo(b.date));

    double moneyIn = 0.0;
    double moneyOut = 0.0;
    final Map<String, double> categoryAmounts = {};
    final Map<String, int> categoryCounts = {};

    for (final tx in sorted) {
      final amt = tx.amount.abs();
      if (tx.type == TransactionType.credit) {
        moneyIn += amt;
      } else {
        moneyOut += amt;
        final cat = tx.category;
        categoryAmounts[cat] = (categoryAmounts[cat] ?? 0.0) + amt;
        categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
      }
    }

    final double netCashFlow = moneyIn - moneyOut;

    // Use latest transaction balance if positive, otherwise netCashFlow
    final latestTx = sorted.last;
    final double currentBalance = (latestTx.balanceAfter > 0)
        ? latestTx.balanceAfter
        : max(0.0, netCashFlow);

    // Build category breakdowns
    final List<CategoryBreakdownItem> categoryBreakdowns = [];
    if (moneyOut > 0) {
      for (final entry in categoryAmounts.entries) {
        final pct = ((entry.value / moneyOut) * 1000).round() / 10.0;
        categoryBreakdowns.add(CategoryBreakdownItem(
          category: entry.key,
          amount: entry.value,
          percentage: pct,
          count: categoryCounts[entry.key] ?? 1,
        ));
      }
      categoryBreakdowns.sort((a, b) => b.amount.compareTo(a.amount));
    }

    // Group chart points by month
    final Map<String, Map<String, double>> monthMap = {};
    final DateFormat monthFormat = DateFormat('MMM');

    for (final tx in sorted) {
      final key = monthFormat.format(tx.date);
      final current = monthMap.putIfAbsent(key, () => {'income': 0.0, 'expense': 0.0});
      if (tx.type == TransactionType.credit) {
        current['income'] = (current['income'] ?? 0.0) + tx.amount.abs();
      } else {
        current['expense'] = (current['expense'] ?? 0.0) + tx.amount.abs();
      }
    }

    final List<CashFlowPoint> chartPoints = [];
    double runningBalance = 0.0;

    for (final entry in monthMap.entries) {
      final inc = entry.value['income'] ?? 0.0;
      final exp = entry.value['expense'] ?? 0.0;
      final net = inc - exp;
      runningBalance += net;

      chartPoints.add(CashFlowPoint(
        dateLabel: entry.key,
        income: inc,
        expense: exp,
        net: net,
        balance: runningBalance,
        isForecast: false,
      ));
    }

    // Dynamic runway & 30-day forecast
    int runwayDays = 0;
    double projectedBalance30D = currentBalance;

    if (sorted.length > 1) {
      final int totalDays = max(1, sorted.last.date.difference(sorted.first.date).inDays);
      final double dailyBurn = moneyOut / totalDays;
      final double dailyIncome = moneyIn / totalDays;

      if (dailyBurn > 0) {
        runwayDays = max(1, (currentBalance / dailyBurn).round());
      } else {
        runwayDays = 90;
      }

      final projectedOut = dailyBurn * 30;
      final projectedIn = dailyIncome * 30;
      projectedBalance30D = max(0.0, currentBalance + projectedIn - projectedOut);

      if (chartPoints.isNotEmpty) {
        chartPoints.add(CashFlowPoint(
          dateLabel: 'Next 30D (Proj)',
          income: projectedIn,
          expense: projectedOut,
          net: projectedIn - projectedOut,
          balance: projectedBalance30D,
          isForecast: true,
        ));
      }
    }

    return CashFlowSummary(
      currentBalance: currentBalance,
      moneyIn: moneyIn,
      moneyOut: moneyOut,
      netCashFlow: netCashFlow,
      moneyInTrendPercent: 0.0,
      moneyOutTrendPercent: 0.0,
      projectedBalance30D: projectedBalance30D,
      runwayDays: runwayDays,
      chartPoints: chartPoints,
      categoryBreakdowns: categoryBreakdowns,
    );
  }

  static List<InsightItem> generateInsights({
    required List<TransactionItem> transactions,
    required CashFlowSummary summary,
    required bool isBusinessMode,
  }) {
    if (transactions.isEmpty) {
      return [];
    }

    final List<InsightItem> insights = [];

    // 1. Cash flow direction
    if (summary.netCashFlow >= 0) {
      insights.add(InsightItem(
        id: 'ins-pos-flow',
        type: InsightType.positiveCashFlow,
        title: 'Positive Cash Flow',
        description:
            'Total inflows (${formatCurrency(summary.moneyIn)}) outpaced outflows (${formatCurrency(summary.moneyOut)}) by ${formatCurrency(summary.netCashFlow)}.',
        severity: InsightSeverity.positive,
        metric: '+${formatCurrency(summary.netCashFlow)}',
        comparison: 'Net surplus',
        date: DateTime.now(),
      ));
    } else {
      insights.add(InsightItem(
        id: 'ins-neg-flow',
        type: InsightType.spendingIncrease,
        title: 'Outflows Exceeded Inflows',
        description:
            'Total spending (${formatCurrency(summary.moneyOut)}) was greater than income (${formatCurrency(summary.moneyIn)}) by ${formatCurrency(summary.netCashFlow.abs())}.',
        severity: InsightSeverity.warning,
        metric: '-${formatCurrency(summary.netCashFlow.abs())}',
        comparison: 'Deficit',
        date: DateTime.now(),
        ctaText: 'Review expenses',
        ctaRoute: '/transactions',
      ));
    }

    // 2. Top spending category
    if (summary.categoryBreakdowns.isNotEmpty) {
      final topCat = summary.categoryBreakdowns.first;
      insights.add(InsightItem(
        id: 'ins-top-cat',
        type: InsightType.highExpenseCategory,
        title: 'Top Spending: ${topCat.category}',
        description:
            '${topCat.category} represents ${topCat.percentage}% of your total expenses (${formatCurrency(topCat.amount)} across ${topCat.count} transactions).',
        severity: topCat.percentage > 35 ? InsightSeverity.warning : InsightSeverity.info,
        metric: '${topCat.percentage}%',
        comparison: formatCurrency(topCat.amount),
        date: DateTime.now(),
        ctaText: 'View transactions',
        ctaRoute: '/transactions',
      ));
    }

    // 3. Runway Status
    if (summary.runwayDays > 0) {
      final isLow = summary.runwayDays < 15;
      insights.add(InsightItem(
        id: 'ins-runway',
        type: InsightType.lowBalanceForecast,
        title: isBusinessMode ? 'Operating Runway Status' : 'Cash Runway Estimate',
        description:
            'Based on recent daily outflow rate, your liquid balance provides approximately ${summary.runwayDays} days of coverage.',
        severity: isLow ? InsightSeverity.critical : InsightSeverity.info,
        metric: '${summary.runwayDays} Days',
        comparison: 'Estimated runway',
        date: DateTime.now(),
        ctaText: 'View cash-flow forecast',
        ctaRoute: '/cash-flow',
      ));
    }

    return insights;
  }
}
