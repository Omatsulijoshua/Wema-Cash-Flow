import 'package:flutter/material.dart';

enum InsightType {
  spendingIncrease,
  spendingDecrease,
  incomeIncrease,
  incomeDecrease,
  recurringPayment,
  unusualSpending,
  lowBalanceForecast,
  positiveCashFlow,
  highExpenseCategory,
  revenueTrend,
}

enum InsightSeverity { info, positive, warning, critical }

class ContributorItem {
  final String category;
  final double amount;
  final String formattedAmount;

  const ContributorItem({
    required this.category,
    required this.amount,
    required this.formattedAmount,
  });
}

class InsightItem {
  final String id;
  final InsightType type;
  final String title;
  final String description;
  final InsightSeverity severity;
  final String metric;
  final String comparison;
  final DateTime date;
  final String? category;
  final String? ctaText;
  final String? ctaRoute;
  final List<ContributorItem> contributors;
  final List<String> supportingTransactionIds;

  InsightItem({
    required this.id,
    required this.type,
    required this.title,
    required this.description,
    required this.severity,
    required this.metric,
    required this.comparison,
    required this.date,
    this.category,
    this.ctaText,
    this.ctaRoute,
    this.contributors = const [],
    this.supportingTransactionIds = const [],
  });

  Color get severityColor {
    switch (severity) {
      case InsightSeverity.positive:
        return const Color(0xFF059669);
      case InsightSeverity.warning:
        return const Color(0xFFD97706);
      case InsightSeverity.critical:
        return const Color(0xFFDC2626);
      case InsightSeverity.info:
        return const Color(0xFF2563EB);
    }
  }

  IconData get icon {
    switch (type) {
      case InsightType.spendingIncrease:
        return Icons.trending_up;
      case InsightType.spendingDecrease:
        return Icons.trending_down;
      case InsightType.incomeIncrease:
        return Icons.arrow_upward;
      case InsightType.incomeDecrease:
        return Icons.arrow_downward;
      case InsightType.recurringPayment:
        return Icons.event_repeat;
      case InsightType.unusualSpending:
        return Icons.warning_amber_rounded;
      case InsightType.lowBalanceForecast:
        return Icons.show_chart;
      case InsightType.positiveCashFlow:
        return Icons.check_circle_outline;
      case InsightType.highExpenseCategory:
        return Icons.pie_chart_outline;
      case InsightType.revenueTrend:
        return Icons.insights;
    }
  }
}
