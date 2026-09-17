import { ChatMessage, CashFlowSummary, Transaction } from '../types/financial';
import { FinancialEngine } from './FinancialEngine';

export class ChatService {
  static answerQuery(
    query: string,
    summary: CashFlowSummary,
    transactions: Transaction[] = [],
    isBusiness: boolean = false
  ): ChatMessage {
    const q = query.toLowerCase().trim();
    const now = new Date().toISOString();
    const id = `msg-${Date.now()}`;

    if (!transactions || transactions.length === 0) {
      return {
        id,
        sender: 'assistant',
        text: 'You have not imported any transactions yet. Please upload your bank statement or CSV in the Import tab so I can analyze your financial activity.',
        timestamp: now,
        quickFollowUps: [
          'How do I import a CSV?',
          'What formats are supported?',
        ],
      };
    }

    // Question: Balance / Current Standing
    if (q.includes('balance') || q.includes('how much do i have') || q.includes('current balance')) {
      return {
        id,
        sender: 'assistant',
        text: `Your current calculated balance is ${FinancialEngine.formatNaira(summary.currentBalance)}. You have recorded ${FinancialEngine.formatNaira(summary.moneyIn)} in total inflows and ${FinancialEngine.formatNaira(summary.moneyOut)} in total outflows.`,
        timestamp: now,
        metrics: [
          { label: 'Current Balance', value: FinancialEngine.formatNaira(summary.currentBalance), subtext: 'Calculated liquid reserve' },
          { label: 'Net Flow', value: FinancialEngine.formatNaira(summary.netCashFlow), subtext: 'Inflow - Outflow', isPositive: summary.netCashFlow >= 0 },
        ],
        quickFollowUps: [
          'Where did I spend the most?',
          'What is my runway?',
          'What is my total spending?',
        ],
      };
    }

    // Question: Top Spending / Where did I spend the most?
    if (q.includes('where did i spend') || q.includes('top spend') || q.includes('highest spend') || q.includes('most spent')) {
      if (summary.categoryBreakdowns.length === 0) {
        return {
          id,
          sender: 'assistant',
          text: 'No expense transactions were found in your imported records.',
          timestamp: now,
        };
      }
      const top = summary.categoryBreakdowns[0];
      const top3 = summary.categoryBreakdowns.slice(0, 3);
      return {
        id,
        sender: 'assistant',
        text: `Your highest spending category is ${top.category}, representing ${top.percentage}% of your total outflows (${FinancialEngine.formatNaira(top.amount)} across ${top.count} transactions).`,
        timestamp: now,
        metrics: top3.map(c => ({
          label: c.category,
          value: FinancialEngine.formatNaira(c.amount),
          subtext: `${c.percentage}% (${c.count} txns)`,
        })),
        quickFollowUps: [
          'What is my current balance?',
          'Can I afford my usual expenses?',
          'What is my runway?',
        ],
      };
    }

    // Question: Specific category (Food, Transport, Utilities, etc.)
    const matchedCategory = summary.categoryBreakdowns.find(c =>
      q.includes(c.category.toLowerCase())
    );
    if (matchedCategory) {
      return {
        id,
        sender: 'assistant',
        text: `You spent ${FinancialEngine.formatNaira(matchedCategory.amount)} on ${matchedCategory.category} across ${matchedCategory.count} transactions, accounting for ${matchedCategory.percentage}% of your total outflows.`,
        timestamp: now,
        metrics: [
          { label: matchedCategory.category, value: FinancialEngine.formatNaira(matchedCategory.amount), subtext: `${matchedCategory.percentage}% of total out` },
          { label: 'Transactions', value: `${matchedCategory.count}`, subtext: 'Individual payments' },
        ],
        quickFollowUps: [
          'Where did I spend the most?',
          'What is my total spending?',
          'What is my current balance?',
        ],
      };
    }

    // Question: Runway / How long will my money last?
    if (q.includes('runway') || q.includes('how long') || q.includes('forecast')) {
      return {
        id,
        sender: 'assistant',
        text: summary.runwayDays > 0
          ? `Based on your recent average daily burn rate, your liquid balance is estimated to cover approximately ${summary.runwayDays} days of operations.`
          : `We do not have sufficient outflow velocity to calculate a runway projection yet.`,
        timestamp: now,
        metrics: [
          { label: 'Estimated Runway', value: `${summary.runwayDays} Days`, subtext: 'Coverage at current spending rate' },
          { label: 'Projected 30D Balance', value: FinancialEngine.formatNaira(summary.projectedBalance30D), subtext: 'Forecasted liquid position' },
        ],
        quickFollowUps: [
          'What is my current balance?',
          'Where did I spend the most?',
          'Can I afford my expenses?',
        ],
      };
    }

    // Question: Affordability
    if (q.includes('can i afford') || q.includes('afford')) {
      // Extract any numeric amount if mentioned
      const numbers = q.replace(/,/g, '').match(/\d+/g);
      const targetAmount = numbers ? parseInt(numbers[0], 10) : 100000;
      const canAfford = summary.currentBalance >= targetAmount;

      return {
        id,
        sender: 'assistant',
        text: canAfford
          ? `Yes. Your current available balance is ${FinancialEngine.formatNaira(summary.currentBalance)}, which comfortably covers ${FinancialEngine.formatNaira(targetAmount)}. After this expense, your projected remaining balance will be ${FinancialEngine.formatNaira(summary.currentBalance - targetAmount)}.`
          : `Caution. Your available balance is ${FinancialEngine.formatNaira(summary.currentBalance)}, which is below ${FinancialEngine.formatNaira(targetAmount)}. Paying this right now would cause a liquidity deficit of ${FinancialEngine.formatNaira(targetAmount - summary.currentBalance)}.`,
        timestamp: now,
        metrics: [
          { label: 'Target Amount', value: FinancialEngine.formatNaira(targetAmount), subtext: 'Expense under consideration' },
          { label: 'Available Balance', value: FinancialEngine.formatNaira(summary.currentBalance), subtext: canAfford ? 'Sufficient coverage' : 'Liquidity deficit', isPositive: canAfford },
        ],
        quickFollowUps: [
          'What is my current balance?',
          'What is my runway?',
          'Where did I spend the most?',
        ],
      };
    }

    // Default Fallback
    return {
      id,
      sender: 'assistant',
      text: `Based on your ${transactions.length} imported transactions, your current balance is ${FinancialEngine.formatNaira(summary.currentBalance)}. You have recorded ${FinancialEngine.formatNaira(summary.moneyIn)} in total inflows and ${FinancialEngine.formatNaira(summary.moneyOut)} in total outflows.`,
      timestamp: now,
      metrics: [
        { label: 'Total Inflow', value: FinancialEngine.formatNaira(summary.moneyIn), subtext: 'Money in' },
        { label: 'Total Outflow', value: FinancialEngine.formatNaira(summary.moneyOut), subtext: 'Money out' },
      ],
      quickFollowUps: [
        'Where did I spend the most?',
        'What is my current balance?',
        'What is my runway?',
      ],
    };
  }
}
