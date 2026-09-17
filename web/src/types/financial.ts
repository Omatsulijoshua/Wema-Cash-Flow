export type TransactionType = 'credit' | 'debit';

export type PaymentChannel = 'POS' | 'WEB' | 'TRANSFER' | 'USSD' | 'ATM';

export interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  categoryConfidence: number; // 0.0 - 1.0
  date: string; // ISO format or YYYY-MM-DD
  reference: string;
  balanceAfter: number;
  status: 'Completed' | 'Pending' | 'Failed';
  paymentChannel: PaymentChannel;
  isDuplicate?: boolean;
  needsReview?: boolean;
}

export interface CategoryInfo {
  id: string;
  name: string;
  color: string;
  iconName: string;
  isBusiness?: boolean;
}

export type DemoScenario =
  | 'personal_normal'
  | 'personal_high_spending'
  | 'personal_low_balance'
  | 'sme_growing_revenue'
  | 'sme_rising_expenses';

export type InsightType =
  | 'spending_increase'
  | 'spending_decrease'
  | 'income_increase'
  | 'income_decrease'
  | 'recurring_payment'
  | 'unusual_spending'
  | 'low_balance_forecast'
  | 'positive_cash_flow'
  | 'high_expense_category'
  | 'revenue_trend';

export type InsightSeverity = 'info' | 'positive' | 'warning' | 'critical';

export interface Contributor {
  category: string;
  amount: number;
  formattedAmount: string;
}

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  severity: InsightSeverity;
  metric: string;
  comparison: string;
  date: string;
  category?: string;
  ctaText?: string;
  ctaRoute?: string;
  contributors?: Contributor[];
  supportingTransactionIds?: string[];
}

export interface RecurringPayment {
  id: string;
  title: string;
  category: string;
  amount: number;
  frequency: 'Monthly' | 'Weekly' | 'Yearly';
  nextDueDate: string;
  status: 'active' | 'upcoming' | 'recently_detected';
  provider: string;
  channel: string;
}

export interface CashFlowPoint {
  dateLabel: string;
  income: number;
  expense: number;
  net: number;
  balance: number;
  isForecast?: boolean;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface CashFlowSummary {
  currentBalance: number;
  moneyIn: number;
  moneyOut: number;
  netCashFlow: number;
  moneyInTrendPercent: number;
  moneyOutTrendPercent: number;
  projectedBalance30D: number;
  runwayDays: number;
  outstandingCommitments: number;
  chartPoints: CashFlowPoint[];
  categoryBreakdowns: CategoryBreakdown[];
}

export interface UploadedFile {
  id: string;
  name: string;
  sizeBytes: number;
  fileType: string;
  status: 'uploaded' | 'analyzing' | 'processed' | 'failed' | 'needs_review';
  detectedTransactions?: number;
  previewUrl?: string;
}

export interface ImportBatch {
  id: string;
  date: string;
  fileCount: number;
  totalDetected: number;
  uniqueCount: number;
  duplicateCount: number;
  reviewNeededCount: number;
  status: string;
}

export interface ChatMetricHighlight {
  label: string;
  value: string;
  subtext?: string;
  isPositive?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  metrics?: ChatMetricHighlight[];
  supportingCategories?: string[];
  quickFollowUps?: string[];
}
