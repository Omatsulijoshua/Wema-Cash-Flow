'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Transaction,
  RecurringPayment,
  ImportBatch,
  UploadedFile,
  ChatMessage,
  DemoScenario,
  CashFlowSummary,
  Insight,
} from '../types/financial';
import {
  generateMockTransactions,
  MOCK_RECURRING_PAYMENTS,
  MOCK_IMPORT_HISTORY,
} from '../data/mockTransactions';
import { FinancialEngine } from '../services/FinancialEngine';
import { ChatService } from '../services/ChatService';

interface FinancialContextType {
  transactions: Transaction[];
  recurringPayments: RecurringPayment[];
  importHistory: ImportBatch[];
  uploadedFiles: UploadedFile[];
  chatMessages: ChatMessage[];
  isBusiness: boolean;
  scenario: DemoScenario;
  summary: CashFlowSummary;
  insights: Insight[];
  isProcessing: boolean;
  processingStep: number;
  processingMessage: string;
  isImportCompleted: boolean;
  duplicates: Transaction[];
  needsReviewList: Transaction[];
  duplicatesCount: number;
  reviewsCount: number;

  setBusinessMode: (value: boolean) => void;
  setScenario: (scen: DemoScenario) => void;
  resetDemo: () => void;
  updateTransactionCategory: (id: string, category: string) => void;
  addUploadedFiles: (files: UploadedFile[]) => void;
  removeUploadedFile: (id: string) => void;
  clearUploadedFiles: () => void;
  loadSampleFiles: () => void;
  simulateImport: () => Promise<void>;
  keepDuplicate: (id: string) => void;
  removeDuplicate: (id: string) => void;
  resolveReview: (id: string, category: string) => void;
  sendChatMessage: (text: string) => Promise<void>;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([]);
  const [importHistory, setImportHistory] = useState<ImportBatch[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isBusiness, setIsBusiness] = useState(false);
  const [scenario, setScenarioState] = useState<DemoScenario>('personal_normal');

  // Import State Machine
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [processingMessage, setProcessingMessage] = useState('');
  const [isImportCompleted, setIsImportCompleted] = useState(false);
  const [duplicates, setDuplicates] = useState<Transaction[]>([]);
  const [needsReviewList, setNeedsReviewList] = useState<Transaction[]>([]);
  const [duplicatesCount, setDuplicatesCount] = useState(13);
  const [reviewsCount, setReviewsCount] = useState(6);

  const initData = () => {
    setTransactions(generateMockTransactions());
    setRecurringPayments(MOCK_RECURRING_PAYMENTS);
    setImportHistory(MOCK_IMPORT_HISTORY);
    setIsBusiness(false);
    setScenarioState('personal_normal');
    setUploadedFiles([]);
    setIsProcessing(false);
    setIsImportCompleted(false);
    setDuplicatesCount(13);
    setReviewsCount(6);

    setChatMessages([
      {
        id: 'welcome-1',
        sender: 'assistant',
        text: 'Hello! I am your Wema CashFlow Intelligence Assistant. I have analyzed your recent transaction history and cash flow patterns. Ask me anything about your money, expenses, or runway!',
        timestamp: new Date().toISOString(),
        quickFollowUps: [
          'Why did my expenses increase?',
          'How much did I spend on food this month?',
          'What are my recurring payments?',
          'Where did I spend the most?',
          'Can I afford my usual expenses?',
        ],
      },
    ]);
  };

  useEffect(() => {
    initData();
  }, []);

  const summary = FinancialEngine.calculateSummary(isBusiness, scenario);
  const insights = FinancialEngine.generateInsights(isBusiness, scenario);

  const setBusinessMode = (val: boolean) => {
    setIsBusiness(val);
    if (val && scenario !== 'sme_growing_revenue' && scenario !== 'sme_rising_expenses') {
      setScenarioState('sme_growing_revenue');
    } else if (!val && (scenario === 'sme_growing_revenue' || scenario === 'sme_rising_expenses')) {
      setScenarioState('personal_normal');
    }
  };

  const setScenario = (scen: DemoScenario) => {
    setScenarioState(scen);
    if (scen === 'sme_growing_revenue' || scen === 'sme_rising_expenses') {
      setIsBusiness(true);
    } else {
      setIsBusiness(false);
    }
  };

  const resetDemo = () => {
    initData();
  };

  const updateTransactionCategory = (id: string, category: string) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, category, categoryConfidence: 1.0 } : t))
    );
  };

  const addUploadedFiles = (files: UploadedFile[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeUploadedFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearUploadedFiles = () => {
    setUploadedFiles([]);
    setIsProcessing(false);
    setIsImportCompleted(false);
  };

  const loadSampleFiles = () => {
    setUploadedFiles([
      {
        id: 'file-1',
        name: 'Wema_Bank_Statement_Aug_Sep.pdf',
        sizeBytes: 1240000,
        fileType: 'application/pdf',
        status: 'uploaded',
      },
      {
        id: 'file-2',
        name: 'POS_Receipts_Lekki_Shoprite.png',
        sizeBytes: 840000,
        fileType: 'image/png',
        status: 'uploaded',
      },
      {
        id: 'file-3',
        name: 'Uber_Taxify_Receipts_Sep.png',
        sizeBytes: 620000,
        fileType: 'image/png',
        status: 'uploaded',
      },
      {
        id: 'file-4',
        name: 'Business_Invoices_Settlement.csv',
        sizeBytes: 310000,
        fileType: 'text/csv',
        status: 'uploaded',
      },
    ]);
  };

  const simulateImport = async () => {
    setIsProcessing(true);
    setIsImportCompleted(false);
    setProcessingStep(0);

    const steps = [
      'Reading uploaded files and metadata...',
      'Extracting transaction lines and timestamps...',
      'Detecting duplicate transactions across statements...',
      'Normalizing amounts and merchant descriptions...',
      'Running intelligent categorization engine...',
      'Calculating net cash flow, runaways and trends...',
      'Generating actionable financial insights...',
    ];

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i);
      setProcessingMessage(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 550));
    }

    setDuplicatesCount(13);
    setReviewsCount(6);

    setDuplicates([
      {
        id: 'dup-1',
        title: 'Uber Nigeria Ride',
        description: 'Duplicate detected from statement & receipt screenshot',
        amount: 8500,
        type: 'debit',
        category: 'Transport',
        categoryConfidence: 0.98,
        date: '2026-09-15T18:45:00Z',
        reference: 'WMA-CARD-881293',
        balanceAfter: 178500,
        status: 'Completed',
        paymentChannel: 'POS',
        isDuplicate: true,
      },
      {
        id: 'dup-2',
        title: 'Swift 4G Fibre Internet',
        description: 'Auto-debit matching invoice screenshot',
        amount: 20000,
        type: 'debit',
        category: 'Utilities',
        categoryConfidence: 0.97,
        date: '2026-09-03T10:00:00Z',
        reference: 'SWF-REC-773194',
        balanceAfter: 336700,
        status: 'Completed',
        paymentChannel: 'WEB',
        isDuplicate: true,
      },
      {
        id: 'dup-3',
        title: 'Shoprite Lekki Retail',
        description: 'Duplicate transaction matched via exact timestamp',
        amount: 45200,
        type: 'debit',
        category: 'Shopping',
        categoryConfidence: 0.96,
        date: '2026-09-14T16:20:00Z',
        reference: 'POS-SHPR-441209',
        balanceAfter: 187000,
        status: 'Completed',
        paymentChannel: 'POS',
        isDuplicate: true,
      },
    ]);

    setNeedsReviewList([
      {
        id: 'rev-1',
        title: 'PAY_GATE*TRF 009214',
        description: 'Ambiguous merchant reference detected in receipt OCR',
        amount: 14500,
        type: 'debit',
        category: 'Other',
        categoryConfidence: 0.62,
        date: '2026-09-11T14:12:00Z',
        reference: 'UNK-REC-009214',
        balanceAfter: 280000,
        status: 'Completed',
        paymentChannel: 'TRANSFER',
        needsReview: true,
      },
      {
        id: 'rev-2',
        title: 'DIRECT CREDIT REF 88123',
        description: 'Uncategorized third-party inflow from corporate entity',
        amount: 85000,
        type: 'credit',
        category: 'Business Revenue',
        categoryConfidence: 0.68,
        date: '2026-09-09T16:40:00Z',
        reference: 'UNK-IN-88123',
        balanceAfter: 365000,
        status: 'Completed',
        paymentChannel: 'TRANSFER',
        needsReview: true,
      },
    ]);

    setImportHistory(prev => [
      {
        id: `imp-${Date.now()}`,
        date: new Date().toISOString(),
        fileCount: uploadedFiles.length || 4,
        totalDetected: 287,
        uniqueCount: 274,
        duplicateCount: 13,
        reviewNeededCount: 6,
        status: 'Completed',
      },
      ...prev,
    ]);

    setIsProcessing(false);
    setIsImportCompleted(true);
  };

  const keepDuplicate = (id: string) => {
    setDuplicates(prev => prev.filter(d => d.id !== id));
    setDuplicatesCount(prev => Math.max(0, prev - 1));
  };

  const removeDuplicate = (id: string) => {
    setDuplicates(prev => prev.filter(d => d.id !== id));
    setDuplicatesCount(prev => Math.max(0, prev - 1));
  };

  const resolveReview = (id: string, category: string) => {
    setNeedsReviewList(prev => prev.filter(r => r.id !== id));
    setReviewsCount(prev => Math.max(0, prev - 1));
    updateTransactionCategory(id, category);
  };

  const sendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setChatMessages(prev => [...prev, userMsg]);

    await new Promise(r => setTimeout(r, 450));

    const reply = ChatService.answerQuery(text, summary, isBusiness);
    setChatMessages(prev => [...prev, reply]);
  };

  return (
    <FinancialContext.Provider
      value={{
        transactions,
        recurringPayments,
        importHistory,
        uploadedFiles,
        chatMessages,
        isBusiness,
        scenario,
        summary,
        insights,
        isProcessing,
        processingStep,
        processingMessage,
        isImportCompleted,
        duplicates,
        needsReviewList,
        duplicatesCount,
        reviewsCount,

        setBusinessMode,
        setScenario,
        resetDemo,
        updateTransactionCategory,
        addUploadedFiles,
        removeUploadedFile,
        clearUploadedFiles,
        loadSampleFiles,
        simulateImport,
        keepDuplicate,
        removeDuplicate,
        resolveReview,
        sendChatMessage,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancialData = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancialData must be used within FinancialProvider');
  }
  return context;
};
