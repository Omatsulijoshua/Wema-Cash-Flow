import '../models/chat_message.dart';
import '../models/cash_flow_summary.dart';
import '../models/transaction_item.dart';
import 'financial_engine.dart';

class ChatEngine {
  static ChatMessage answerQuery({
    required String query,
    required CashFlowSummary summary,
    required List<TransactionItem> transactions,
    required bool isBusinessMode,
  }) {
    final lower = query.toLowerCase().trim();
    final now = DateTime.now();
    final id = 'msg-${now.millisecondsSinceEpoch}';

    if (transactions.isEmpty) {
      return ChatMessage(
        id: id,
        sender: MessageSender.assistant,
        text: 'You have not imported any transactions yet. Please tap the Import button to upload your statement or CSV so I can analyze your financial activity.',
        timestamp: now,
        quickFollowUps: const [
          'How do I import transactions?',
          'What formats are supported?',
        ],
      );
    }

    // Balance query
    if (lower.contains('balance') || lower.contains('how much do i have') || lower.contains('current balance')) {
      return ChatMessage(
        id: id,
        sender: MessageSender.assistant,
        text: 'Your current calculated balance is ${FinancialEngine.formatCurrency(summary.currentBalance)}. You have recorded ${FinancialEngine.formatCurrency(summary.moneyIn)} in inflows and ${FinancialEngine.formatCurrency(summary.moneyOut)} in outflows.',
        timestamp: now,
        metrics: [
          ChatMetricHighlight(
            label: 'Current Balance',
            value: FinancialEngine.formatCurrency(summary.currentBalance),
            subtext: 'Calculated liquid position',
          ),
          ChatMetricHighlight(
            label: 'Net Flow',
            value: FinancialEngine.formatCurrency(summary.netCashFlow),
            subtext: 'Inflow - Outflow',
            isPositive: summary.netCashFlow >= 0,
          ),
        ],
        quickFollowUps: const [
          'Where did I spend the most?',
          'What is my runway?',
          'What are my recurring payments?',
        ],
      );
    }

    // Highest spending
    if (lower.contains('where did i spend') || lower.contains('top spend') || lower.contains('highest spend') || lower.contains('most spend')) {
      if (summary.categoryBreakdowns.isEmpty) {
        return ChatMessage(
          id: id,
          sender: MessageSender.assistant,
          text: 'No expense transactions were found in your imported records.',
          timestamp: now,
        );
      }
      final top = summary.categoryBreakdowns.first;
      return ChatMessage(
        id: id,
        sender: MessageSender.assistant,
        text: 'Your highest spending category is ${top.category}, representing ${top.percentage}% of your total outflows (${FinancialEngine.formatCurrency(top.amount)} across ${top.count} transactions).',
        timestamp: now,
        metrics: summary.categoryBreakdowns.take(3).map((c) => ChatMetricHighlight(
          label: c.category,
          value: FinancialEngine.formatCurrency(c.amount),
          subtext: '${c.percentage}% (${c.count} txns)',
        )).toList(),
        quickFollowUps: const [
          'What is my current balance?',
          'Can I afford my usual expenses?',
          'What is my runway?',
        ],
      );
    }

    // Specific category query
    final matchedCat = summary.categoryBreakdowns.where((c) => lower.contains(c.category.toLowerCase())).toList();
    if (matchedCat.isNotEmpty) {
      final cat = matchedCat.first;
      return ChatMessage(
        id: id,
        sender: MessageSender.assistant,
        text: 'You spent ${FinancialEngine.formatCurrency(cat.amount)} on ${cat.category} across ${cat.count} transactions, accounting for ${cat.percentage}% of total outflows.',
        timestamp: now,
        metrics: [
          ChatMetricHighlight(
            label: cat.category,
            value: FinancialEngine.formatCurrency(cat.amount),
            subtext: '${cat.percentage}% of total outflows',
          ),
          ChatMetricHighlight(
            label: 'Transactions',
            value: '${cat.count}',
            subtext: 'Individual payments',
          ),
        ],
        quickFollowUps: const [
          'Where did I spend the most?',
          'What is my current balance?',
          'What is my runway?',
        ],
      );
    }

    // Runway query
    if (lower.contains('runway') || lower.contains('how long')) {
      return ChatMessage(
        id: id,
        sender: MessageSender.assistant,
        text: summary.runwayDays > 0
            ? 'Based on your recent daily burn rate, your balance is estimated to provide approximately ${summary.runwayDays} days of coverage.'
            : 'We do not have sufficient historical spending data to calculate a runway projection yet.',
        timestamp: now,
        metrics: [
          ChatMetricHighlight(
            label: 'Estimated Runway',
            value: '${summary.runwayDays} Days',
            subtext: 'Coverage at current burn rate',
          ),
          ChatMetricHighlight(
            label: 'Projected 30D Balance',
            value: FinancialEngine.formatCurrency(summary.projectedBalance30D),
            subtext: 'Forecasted liquid position',
          ),
        ],
        quickFollowUps: const [
          'What is my current balance?',
          'Where did I spend the most?',
          'Can I afford my usual expenses?',
        ],
      );
    }

    // Affordability query
    if (lower.contains('afford')) {
      const targetAmount = 150000.0;
      final canAfford = summary.currentBalance >= targetAmount;

      return ChatMessage(
        id: id,
        sender: MessageSender.assistant,
        text: canAfford
            ? 'Yes. Your current available balance of ${FinancialEngine.formatCurrency(summary.currentBalance)} covers ${FinancialEngine.formatCurrency(targetAmount)} with ${FinancialEngine.formatCurrency(summary.currentBalance - targetAmount)} remaining reserve.'
            : 'Caution. Your current balance of ${FinancialEngine.formatCurrency(summary.currentBalance)} is lower than ${FinancialEngine.formatCurrency(targetAmount)}.',
        timestamp: now,
        metrics: [
          ChatMetricHighlight(
            label: 'Target Amount',
            value: FinancialEngine.formatCurrency(targetAmount),
            subtext: 'Expense under check',
          ),
          ChatMetricHighlight(
            label: 'Current Balance',
            value: FinancialEngine.formatCurrency(summary.currentBalance),
            subtext: canAfford ? 'Sufficient reserve' : 'Deficit alert',
            isPositive: canAfford,
          ),
        ],
        quickFollowUps: const [
          'What is my current balance?',
          'Where did I spend the most?',
          'What is my runway?',
        ],
      );
    }

    // Default fallback
    return ChatMessage(
      id: id,
      sender: MessageSender.assistant,
      text: 'Based on your ${transactions.length} imported transactions, your current balance is ${FinancialEngine.formatCurrency(summary.currentBalance)}. You have recorded ${FinancialEngine.formatCurrency(summary.moneyIn)} in total inflows and ${FinancialEngine.formatCurrency(summary.moneyOut)} in outflows.',
      timestamp: now,
      metrics: [
        ChatMetricHighlight(label: 'Total Inflow', value: FinancialEngine.formatCurrency(summary.moneyIn), subtext: 'Money in'),
        ChatMetricHighlight(label: 'Total Outflow', value: FinancialEngine.formatCurrency(summary.moneyOut), subtext: 'Money out'),
      ],
      quickFollowUps: const [
        'Where did I spend the most?',
        'What is my current balance?',
        'What is my runway?',
      ],
    );
  }
}
