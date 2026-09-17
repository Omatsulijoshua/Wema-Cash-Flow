import '../models/chat_message.dart';
import '../models/cash_flow_summary.dart';

class ChatEngine {
  static ChatMessage answerQuery({
    required String query,
    required CashFlowSummary summary,
    required bool isBusinessMode,
  }) {
    final lower = query.toLowerCase().trim();
    final now = DateTime.now();
    final id = 'msg-${now.millisecondsSinceEpoch}';

    if (lower.contains('why did my expenses increase') || lower.contains('expense increase') || lower.contains('why expenses')) {
      return ChatMessage(
        id: id,
        sender: MessageSender.assistant,
        text: 'Your expenses increased mainly because of higher business purchases, transportation, and food spending this month.',
        timestamp: now,
        metrics: const [
          ChatMetricHighlight(label: 'Transport Surge', value: '+₦34,200', subtext: 'Uber, Bolt & Fuel', isPositive: false),
          ChatMetricHighlight(label: 'Business Purchases', value: '+₦82,500', subtext: 'Cloud & Sub-contracts', isPositive: false),
          ChatMetricHighlight(label: 'Food & Dining', value: '+₦21,300', subtext: 'Chowdeck & Groceries', isPositive: false),
        ],
        supportingCategories: const ['Transport', 'Business Revenue', 'Food'],
        quickFollowUps: const ['How much did I spend on food?', 'What are my recurring payments?', 'Can I afford my usual expenses?'],
      );
    }

    if (lower.contains('food') || lower.contains('spend on food') || lower.contains('dining')) {
      return ChatMessage(
        id: id,
        sender: MessageSender.assistant,
        text: 'You spent ₦168,400 on food this month across 24 transactions. That\'s approximately 12% higher than last month.',
        timestamp: now,
        metrics: const [
          ChatMetricHighlight(label: 'Transactions', value: '24', subtext: 'Orders & Supermarkets'),
          ChatMetricHighlight(label: 'Total Spent', value: '₦168,400', subtext: '14% of monthly out'),
          ChatMetricHighlight(label: 'Change', value: '+12%', subtext: 'vs previous month', isPositive: false),
        ],
        supportingCategories: const ['Food'],
        quickFollowUps: ['Where did I spend the most?', 'Why did my expenses increase?', 'What are my recurring payments?'],
      );
    }

    if (lower.contains('transport') || lower.contains('uber') || lower.contains('fuel')) {
      return ChatMessage(
        id: id,
        sender: MessageSender.assistant,
        text: 'You spent ₦218,772 on transportation across 24 transactions (Uber, Bolt rides, and fuel stations), making up 18% of your overall monthly spending.',
        timestamp: now,
        metrics: const [
          ChatMetricHighlight(label: 'Transport Outflow', value: '₦218,772', subtext: '18% of total expenses'),
          ChatMetricHighlight(label: 'Trips & Fuel', value: '24 transactions', subtext: 'Avg ₦9,115 / trip'),
        ],
        supportingCategories: const ['Transport'],
        quickFollowUps: ['Where did I spend the most?', 'How much did I spend on food?', 'Can I afford my usual expenses?'],
      );
    }

    if (lower.contains('recurring') || lower.contains('subscription') || lower.contains('bills')) {
      return ChatMessage(
        id: id,
        sender: MessageSender.assistant,
        text: 'You have 6 active recurring commitments totaling ₦247,000 per month. Your next upcoming commitment is Swift Internet (₦20,000) on Sep 25, followed by Netflix (₦5,000) on Sep 28 and Rent (₦150,000) on Oct 1.',
        timestamp: now,
        metrics: const [
          ChatMetricHighlight(label: 'Estate Rent', value: '₦150,000', subtext: 'Due Oct 1'),
          ChatMetricHighlight(label: 'Swift Fibre', value: '₦20,000', subtext: 'Due Sep 25'),
          ChatMetricHighlight(label: 'Netflix Plan', value: '₦5,000', subtext: 'Due Sep 28'),
        ],
        supportingCategories: const ['Rent', 'Utilities', 'Subscription'],
        quickFollowUps: ['Can I afford my usual expenses?', 'Why did my expenses increase?', 'Where did I spend the most?'],
      );
    }

    if (lower.contains('where did i spend the most') || lower.contains('highest') || lower.contains('top category')) {
      if (!isBusinessMode) {
        return ChatMessage(
          id: id,
          sender: MessageSender.assistant,
          text: 'Your highest outflow category this month is Business Re-investments at 32% (₦388,928), followed by Transport at 18% (₦218,772) and Food at 14% (₦170,156).',
          timestamp: now,
          metrics: const [
            ChatMetricHighlight(label: '1st: Business', value: '32%', subtext: '₦388,928 total'),
            ChatMetricHighlight(label: '2nd: Transport', value: '18%', subtext: '₦218,772 total'),
            ChatMetricHighlight(label: '3rd: Food', value: '14%', subtext: '₦170,156 total'),
          ],
          supportingCategories: const ['Business Revenue', 'Transport', 'Food'],
          quickFollowUps: ['Why did my expenses increase?', 'How much did I spend on food?'],
        );
      } else {
        return ChatMessage(
          id: id,
          sender: MessageSender.assistant,
          text: 'Your top business expense is Supplier Payments representing 28% (₦823,200) of total outflow, followed by Payroll at 25% (₦735,000) and Logistics at 16% (₦470,400).',
          timestamp: now,
          metrics: const [
            ChatMetricHighlight(label: '1st: Supplier', value: '28%', subtext: '₦823,200 total'),
            ChatMetricHighlight(label: '2nd: Payroll', value: '25%', subtext: '₦735,000 total'),
            ChatMetricHighlight(label: '3rd: Logistics', value: '16%', subtext: '₦470,400 total'),
          ],
          supportingCategories: const ['Supplier', 'Salaries', 'Logistics'],
          quickFollowUps: ['Can I afford my usual expenses?', 'How much money came in this month?'],
        );
      }
    }

    if (lower.contains('money came in') || lower.contains('income') || lower.contains('revenue')) {
      final inVal = isBusinessMode ? '₦4,820,000' : '₦1,840,000';
      final trend = isBusinessMode ? '+14% growth' : '+12.4% vs last month';
      return ChatMessage(
        id: id,
        sender: MessageSender.assistant,
        text: 'A total of $inVal arrived this month across salary and verified client invoice settlements ($trend).',
        timestamp: now,
        metrics: [
          ChatMetricHighlight(label: 'Total Inflow', value: inVal, subtext: trend),
          ChatMetricHighlight(label: 'Net Surplus', value: isBusinessMode ? '+₦1,880,000' : '+₦624,600', subtext: 'Retained Liquidity'),
        ],
        quickFollowUps: ['Where did I spend the most?', 'Can I afford my usual expenses?'],
      );
    }

    if (lower.contains('afford') || lower.contains('can i afford') || lower.contains('runway')) {
      return ChatMessage(
        id: id,
        sender: MessageSender.assistant,
        text: 'With your current balance of ₦428,500 and upcoming rent (₦150,000) due Oct 1, you have sufficient liquidity for the next 14 days. However, your spending pace may reduce your cushion to approximately ₦92,000 by mid-October without incoming client receivables.',
        timestamp: now,
        metrics: const [
          ChatMetricHighlight(label: 'Current Balance', value: '₦428,500', subtext: 'Available today'),
          ChatMetricHighlight(label: 'Upcoming Bills', value: '₦175,000', subtext: 'Next 14 days'),
          ChatMetricHighlight(label: 'Projected 30D', value: '₦92,000', subtext: 'Estimated reserve', isPositive: false),
        ],
        quickFollowUps: ['Why did my expenses increase?', 'What are my recurring payments?'],
      );
    }

    // Default intelligent banking response
    return ChatMessage(
      id: id,
      sender: MessageSender.assistant,
      text: 'Based on your recent transactions, your net cash flow is healthy at +₦624,600 with total monthly inflow of ₦1,840,000 against outflow of ₦1,215,400.',
      timestamp: now,
      metrics: const [
        ChatMetricHighlight(label: 'Current Balance', value: '₦428,500', subtext: 'Available'),
        ChatMetricHighlight(label: 'Net Cash Flow', value: '+₦624,600', subtext: 'Positive margin'),
      ],
      quickFollowUps: [
        'Why did my expenses increase?',
        'How much did I spend on food this month?',
        'What are my recurring payments?',
        'Where did I spend the most?'
      ],
    );
  }
}
