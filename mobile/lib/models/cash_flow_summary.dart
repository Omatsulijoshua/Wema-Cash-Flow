class CashFlowPoint {
  final String dateLabel;
  final double income;
  final double expense;
  final double net;
  final double balance;
  final bool isForecast;

  const CashFlowPoint({
    required this.dateLabel,
    required this.income,
    required this.expense,
    required this.net,
    required this.balance,
    this.isForecast = false,
  });
}

class CategoryBreakdownItem {
  final String category;
  final double amount;
  final double percentage;
  final int count;

  const CategoryBreakdownItem({
    required this.category,
    required this.amount,
    required this.percentage,
    required this.count,
  });
}

class CashFlowSummary {
  final double currentBalance;
  final double moneyIn;
  final double moneyOut;
  final double netCashFlow;
  final double moneyInTrendPercent;
  final double moneyOutTrendPercent;
  final double projectedBalance30D;
  final int runwayDays;
  final double outstandingCommitments;
  final List<CashFlowPoint> chartPoints;
  final List<CategoryBreakdownItem> categoryBreakdowns;

  CashFlowSummary({
    required this.currentBalance,
    required this.moneyIn,
    required this.moneyOut,
    required this.netCashFlow,
    required this.moneyInTrendPercent,
    required this.moneyOutTrendPercent,
    required this.projectedBalance30D,
    required this.runwayDays,
    this.outstandingCommitments = 0.0,
    required this.chartPoints,
    required this.categoryBreakdowns,
  });
}
