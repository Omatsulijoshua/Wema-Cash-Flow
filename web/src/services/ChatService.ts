import { ChatMessage, CashFlowSummary } from '../types/financial';

export class ChatService {
  static answerQuery(query: string, summary: CashFlowSummary, isBusiness: boolean): ChatMessage {
    const q = query.toLowerCase().trim();
    const now = new Date().toISOString();
    const id = `msg-${Date.now()}`;

    if (q.includes('why did my expenses increase') || q.includes('expense increase') || q.includes('why expenses')) {
      return {
        id,
        sender: 'assistant',
        text: 'Your expenses increased mainly because of higher business purchases, transportation and food spending this month.',
        timestamp: now,
        metrics: [
          { label: 'Transport Surge', value: '+₦34,200', subtext: 'Uber, Bolt & Fuel', isPositive: false },
          { label: 'Business Purchases', value: '+₦82,500', subtext: 'Cloud & Retainers', isPositive: false },
          { label: 'Food & Dining', value: '+₦21,300', subtext: 'Chowdeck & Groceries', isPositive: false },
        ],
        supportingCategories: ['Transport', 'Business Revenue', 'Food'],
        quickFollowUps: [
          'How much did I spend on food this month?',
          'What are my recurring payments?',
          'Can I afford my usual expenses?',
        ],
      };
    }

    if (q.includes('food') || q.includes('spend on food') || q.includes('dining')) {
      return {
        id,
        sender: 'assistant',
        text: 'You spent ₦168,400 on food this month across 24 transactions. That\'s approximately 12% higher than last month.',
        timestamp: now,
        metrics: [
          { label: 'Transactions', value: '24', subtext: 'Orders & Supermarkets' },
          { label: 'Total Spent', value: '₦168,400', subtext: '14% of monthly out' },
          { label: 'Change', value: '+12%', subtext: 'vs previous month', isPositive: false },
        ],
        supportingCategories: ['Food'],
        quickFollowUps: [
          'Where did I spend the most?',
          'Why did my expenses increase?',
          'What are my recurring payments?',
        ],
      };
    }

    if (q.includes('transport') || q.includes('uber') || q.includes('fuel')) {
      return {
        id,
        sender: 'assistant',
        text: 'You spent ₦218,772 on transportation across 24 transactions (Uber, Bolt rides, and fuel stations), making up 18% of your overall monthly spending.',
        timestamp: now,
        metrics: [
          { label: 'Transport Outflow', value: '₦218,772', subtext: '18% of total expenses' },
          { label: 'Trips & Fuel', value: '24 transactions', subtext: 'Avg ₦9,115 / trip' },
        ],
        supportingCategories: ['Transport'],
        quickFollowUps: [
          'Where did I spend the most?',
          'How much did I spend on food this month?',
          'Can I afford my usual expenses?',
        ],
      };
    }

    if (q.includes('recurring') || q.includes('subscription') || q.includes('bills')) {
      return {
        id,
        sender: 'assistant',
        text: 'You have 6 active recurring commitments totaling ₦247,000 per month. Your next upcoming commitment is Swift Internet (₦20,000) on Sep 25, followed by Netflix (₦5,000) on Sep 28 and Rent (₦150,000) on Oct 1.',
        timestamp: now,
        metrics: [
          { label: 'Estate Rent', value: '₦150,000', subtext: 'Due Oct 1' },
          { label: 'Swift Fibre', value: '₦20,000', subtext: 'Due Sep 25' },
          { label: 'Netflix Plan', value: '₦5,000', subtext: 'Due Sep 28' },
        ],
        supportingCategories: ['Rent', 'Utilities', 'Subscription'],
        quickFollowUps: [
          'Can I afford my usual expenses?',
          'Why did my expenses increase?',
          'Where did I spend the most?',
        ],
      };
    }

    if (q.includes('where did i spend the most') || q.includes('highest') || q.includes('top category')) {
      if (!isBusiness) {
        return {
          id,
          sender: 'assistant',
          text: 'Your highest outflow category this month is Business Re-investments at 32% (₦388,928), followed by Transport at 18% (₦218,772) and Food at 14% (₦170,156).',
          timestamp: now,
          metrics: [
            { label: '1st: Business', value: '32%', subtext: '₦388,928 total' },
            { label: '2nd: Transport', value: '18%', subtext: '₦218,772 total' },
            { label: '3rd: Food', value: '14%', subtext: '₦170,156 total' },
          ],
          supportingCategories: ['Business Revenue', 'Transport', 'Food'],
          quickFollowUps: ['Why did my expenses increase?', 'How much did I spend on food this month?'],
        };
      } else {
        return {
          id,
          sender: 'assistant',
          text: 'Your top business expense is Supplier Payments representing 28% (₦823,200) of total outflow, followed by Payroll at 25% (₦735,000) and Logistics at 16% (₦470,400).',
          timestamp: now,
          metrics: [
            { label: '1st: Supplier', value: '28%', subtext: '₦823,200 total' },
            { label: '2nd: Payroll', value: '25%', subtext: '₦735,000 total' },
            { label: '3rd: Logistics', value: '16%', subtext: '₦470,400 total' },
          ],
          supportingCategories: ['Supplier', 'Salaries', 'Logistics'],
          quickFollowUps: ['Can I afford my usual expenses?', 'How much money came in this month?'],
        };
      }
    }

    if (q.includes('money came in') || q.includes('income') || q.includes('revenue')) {
      const inVal = isBusiness ? '₦4,820,000' : '₦1,840,000';
      const trend = isBusiness ? '+14% growth' : '+12.4% vs last month';
      return {
        id,
        sender: 'assistant',
        text: `A total of ${inVal} arrived this month across salary and verified client invoice settlements (${trend}).`,
        timestamp: now,
        metrics: [
          { label: 'Total Inflow', value: inVal, subtext: trend },
          { label: 'Net Surplus', value: isBusiness ? '+₦1,880,000' : '+₦624,600', subtext: 'Retained Liquidity' },
        ],
        quickFollowUps: ['Where did I spend the most?', 'Can I afford my usual expenses?'],
      };
    }

    if (q.includes('afford') || q.includes('can i afford') || q.includes('runway')) {
      return {
        id,
        sender: 'assistant',
        text: 'With your current balance of ₦428,500 and upcoming rent (₦150,000) due Oct 1, you have sufficient liquidity for the next 14 days. However, your spending pace may reduce your cushion to approximately ₦92,000 by mid-October without incoming client receivables.',
        timestamp: now,
        metrics: [
          { label: 'Current Balance', value: '₦428,500', subtext: 'Available today' },
          { label: 'Upcoming Bills', value: '₦175,000', subtext: 'Next 14 days' },
          { label: 'Projected 30D', value: '₦92,000', subtext: 'Estimated reserve', isPositive: false },
        ],
        quickFollowUps: ['Why did my expenses increase?', 'What are my recurring payments?'],
      };
    }

    return {
      id,
      sender: 'assistant',
      text: 'Based on your recent transactions, your net cash flow is healthy at +₦624,600 with total monthly inflow of ₦1,840,000 against outflow of ₦1,215,400.',
      timestamp: now,
      metrics: [
        { label: 'Current Balance', value: '₦428,500', subtext: 'Available' },
        { label: 'Net Cash Flow', value: '+₦624,600', subtext: 'Positive margin' },
      ],
      quickFollowUps: [
        'Why did my expenses increase?',
        'How much did I spend on food this month?',
        'What are my recurring payments?',
        'Where did I spend the most?',
      ],
    };
  }
}
