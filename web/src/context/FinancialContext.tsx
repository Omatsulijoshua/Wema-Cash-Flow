'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
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
import { FinancialEngine } from '../services/FinancialEngine';
import { CategorizationEngine } from '../services/CategorizationEngine';
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
  clearAllData: () => void;
  resetDemo: () => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransactionCategory: (id: string, category: string) => void;
  addUploadedFiles: (files: UploadedFile[]) => void;
  removeUploadedFile: (id: string) => void;
  clearUploadedFiles: () => void;
  importCsvContent: (csvText: string, fileName?: string) => { imported: number; duplicates: number };
  simulateImport: () => Promise<void>;
  keepDuplicate: (id: string) => void;
  removeDuplicate: (id: string) => void;
  resolveReview: (id: string, category: string) => void;
  sendChatMessage: (text: string) => Promise<void>;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

const STORAGE_KEY = 'wema_cashflow_transactions';
const BATCH_STORAGE_KEY = 'wema_cashflow_batches';

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([]);
  const [importHistory, setImportHistory] = useState<ImportBatch[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isBusiness, setIsBusiness] = useState(false);
  const [scenario, setScenarioState] = useState<DemoScenario>('personal_normal');

  // Import Pipeline State Machine
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [processingMessage, setProcessingMessage] = useState('');
  const [isImportCompleted, setIsImportCompleted] = useState(false);
  const [duplicates, setDuplicates] = useState<Transaction[]>([]);
  const [needsReviewList, setNeedsReviewList] = useState<Transaction[]>([]);
  const [duplicatesCount, setDuplicatesCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);

  // Load persisted user transactions from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTransactions(parsed);
        }
      }
      const savedBatches = localStorage.getItem(BATCH_STORAGE_KEY);
      if (savedBatches) {
        const parsedBatches = JSON.parse(savedBatches);
        if (Array.isArray(parsedBatches)) {
          setImportHistory(parsedBatches);
        }
      }
    } catch {
      // Ignore parse errors
    }

    setChatMessages([
      {
        id: 'welcome-1',
        sender: 'assistant',
        text: 'Hello! I am your Wema CashFlow Intelligence Assistant. When you upload a bank statement or CSV file, I will analyze your spending patterns, detect recurring payments, and answer any financial questions.',
        timestamp: new Date().toISOString(),
        quickFollowUps: [
          'How do I import my statement?',
          'What CSV format is supported?',
        ],
      },
    ]);
  }, []);

  // Save transactions to localStorage
  const saveTransactions = (newTxs: Transaction[]) => {
    setTransactions(newTxs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTxs));
    } catch {
      // Ignore storage errors
    }
  };

  // Detect recurring payments dynamically from debit transactions
  useEffect(() => {
    if (transactions.length === 0) {
      setRecurringPayments([]);
      return;
    }

    const merchantMap = new Map<string, Transaction[]>();
    for (const tx of transactions) {
      if (tx.type === 'debit') {
        const key = tx.title.trim().toLowerCase();
        const list = merchantMap.get(key) || [];
        list.push(tx);
        merchantMap.set(key, list);
      }
    }

    const detected: RecurringPayment[] = [];
    let idx = 1;
    for (const [, txs] of merchantMap.entries()) {
      if (txs.length >= 2) {
        const first = txs[0];
        const amountsMatch = txs.every(t => Math.abs(t.amount - first.amount) < 500);
        if (amountsMatch) {
          detected.push({
            id: `rec-${idx++}`,
            title: first.title,
            amount: first.amount,
            frequency: 'Monthly',
            category: first.category,
            nextDueDate: '2026-10-01',
            status: 'active',
            provider: first.title,
            channel: first.paymentChannel || 'TRANSFER',
          });
        }
      }
    }
    setRecurringPayments(detected);
  }, [transactions]);

  // Dynamically compute cash flow summary & insights
  const summary = useMemo(() => {
    return FinancialEngine.calculateSummary(transactions, isBusiness);
  }, [transactions, isBusiness]);

  const insights = useMemo(() => {
    return FinancialEngine.generateInsights(transactions, summary, isBusiness);
  }, [transactions, summary, isBusiness]);

  const setBusinessMode = (val: boolean) => {
    setIsBusiness(val);
  };

  const setScenario = (scen: DemoScenario) => {
    setScenarioState(scen);
  };

  const clearAllData = () => {
    saveTransactions([]);
    setRecurringPayments([]);
    setImportHistory([]);
    setUploadedFiles([]);
    setDuplicates([]);
    setNeedsReviewList([]);
    setDuplicatesCount(0);
    setReviewsCount(0);
    setIsImportCompleted(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(BATCH_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    const updated = [newTx, ...transactions];
    saveTransactions(updated);
  };

  const updateTransactionCategory = (id: string, newCategory: string) => {
    const updated = transactions.map(t =>
      t.id === id ? { ...t, category: newCategory, categoryConfidence: 1.0, needsReview: false } : t
    );
    saveTransactions(updated);
    setNeedsReviewList(prev => prev.filter(p => p.id !== id));
    setReviewsCount(prev => Math.max(0, prev - 1));
  };

  const addUploadedFiles = (files: UploadedFile[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeUploadedFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearUploadedFiles = () => {
    setUploadedFiles([]);
    setIsImportCompleted(false);
  };

  // Real CSV Statement Parser
  const importCsvContent = (csvText: string, fileName?: string): { imported: number; duplicates: number } => {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      return { imported: 0, duplicates: 0 };
    }

    // Split CSV row with quotes handling
    const parseRow = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const header = parseRow(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

    // Map column indices
    let dateIdx = header.findIndex(h => h.includes('date'));
    let descIdx = header.findIndex(h => h.includes('desc') || h.includes('narrat') || h.includes('detail') || h.includes('title') || h.includes('merchant') || h.includes('remark'));
    let amountIdx = header.findIndex(h => h.includes('amount') || h.includes('val') || h.includes('sum'));
    let typeIdx = header.findIndex(h => h.includes('type') || h === 'drcr' || h === 'crdr' || h === 'dc');
    let debitIdx = header.findIndex(h => h.includes('debit') || h.includes('outflow') || h.includes('withdrawal'));
    let creditIdx = header.findIndex(h => h.includes('credit') || h.includes('inflow') || h.includes('deposit'));
    let catIdx = header.findIndex(h => h.includes('cat') || h.includes('tag'));
    let balIdx = header.findIndex(h => h.includes('bal'));

    if (dateIdx === -1) dateIdx = 0;
    if (descIdx === -1) descIdx = 1;
    if (amountIdx === -1 && debitIdx === -1 && creditIdx === -1) amountIdx = 2;

    const newTransactions: Transaction[] = [];
    const foundDuplicates: Transaction[] = [];
    const foundReview: Transaction[] = [];

    // Map of existing transactions to detect duplicates
    const existingSignatures = new Set(
      transactions.map(t => `${t.date.split('T')[0]}_${t.title.toLowerCase().trim()}_${t.amount}`)
    );

    for (let i = 1; i < lines.length; i++) {
      const row = parseRow(lines[i]);
      if (row.length <= Math.max(dateIdx, descIdx)) continue;

      const rawDate = row[dateIdx] || new Date().toISOString().split('T')[0];
      const rawDesc = row[descIdx] || 'Bank Transaction';

      let amount = 0;
      let type: 'credit' | 'debit' = 'debit';

      if (debitIdx !== -1 && row[debitIdx] && parseFloat(row[debitIdx].replace(/[^0-9.-]/g, '')) > 0) {
        amount = Math.abs(parseFloat(row[debitIdx].replace(/[^0-9.-]/g, '')));
        type = 'debit';
      } else if (creditIdx !== -1 && row[creditIdx] && parseFloat(row[creditIdx].replace(/[^0-9.-]/g, '')) > 0) {
        amount = Math.abs(parseFloat(row[creditIdx].replace(/[^0-9.-]/g, '')));
        type = 'credit';
      } else if (amountIdx !== -1 && row[amountIdx]) {
        const parsedAmt = parseFloat(row[amountIdx].replace(/[^0-9.-]/g, ''));
        amount = Math.abs(parsedAmt);
        if (parsedAmt < 0) {
          type = 'debit';
        } else if (typeIdx !== -1 && row[typeIdx]) {
          const rawType = row[typeIdx].toLowerCase();
          type = rawType.includes('cr') || rawType.includes('in') || rawType.includes('dep') ? 'credit' : 'debit';
        } else {
          type = 'debit';
        }
      }

      if (isNaN(amount) || amount === 0) continue;

      // Auto-categorize
      let category = 'Other';
      let confidence = 0.85;

      if (catIdx !== -1 && row[catIdx]) {
        category = row[catIdx];
        confidence = 0.95;
      } else {
        const catResult = CategorizationEngine.categorize(rawDesc);
        category = catResult.category;
        confidence = catResult.confidence;
      }

      const cleanDate = rawDate.includes('-') ? rawDate : new Date().toISOString().split('T')[0];
      const signature = `${cleanDate}_${rawDesc.toLowerCase().trim()}_${amount}`;

      const txItem: Transaction = {
        id: `tx-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
        title: rawDesc,
        description: `Imported from ${fileName || 'CSV statement'}`,
        amount,
        type,
        category,
        categoryConfidence: confidence,
        date: cleanDate,
        reference: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        balanceAfter: balIdx !== -1 && row[balIdx] ? parseFloat(row[balIdx].replace(/[^0-9.-]/g, '')) : 0,
        status: 'Completed',
        paymentChannel: 'TRANSFER',
        needsReview: confidence < 0.7,
      };

      if (existingSignatures.has(signature)) {
        txItem.isDuplicate = true;
        foundDuplicates.push(txItem);
      } else {
        existingSignatures.add(signature);
        newTransactions.push(txItem);
        if (confidence < 0.7) {
          foundReview.push(txItem);
        }
      }
    }

    if (newTransactions.length > 0) {
      const merged = [...newTransactions, ...transactions];
      saveTransactions(merged);
    }

    if (foundDuplicates.length > 0) {
      setDuplicates(prev => [...foundDuplicates, ...prev]);
      setDuplicatesCount(prev => prev + foundDuplicates.length);
    }

    if (foundReview.length > 0) {
      setNeedsReviewList(prev => [...foundReview, ...prev]);
      setReviewsCount(prev => prev + foundReview.length);
    }

    const newBatch: ImportBatch = {
      id: `batch-${Date.now()}`,
      date: new Date().toISOString(),
      fileCount: 1,
      totalDetected: newTransactions.length + foundDuplicates.length,
      uniqueCount: newTransactions.length,
      duplicateCount: foundDuplicates.length,
      reviewNeededCount: foundReview.length,
      status: 'Completed',
    };

    setImportHistory(prev => {
      const updated = [newBatch, ...prev];
      try {
        localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    return {
      imported: newTransactions.length,
      duplicates: foundDuplicates.length,
    };
  };

  const simulateImport = async () => {
    if (uploadedFiles.length === 0) return;
    setIsProcessing(true);
    setProcessingStep(1);
    setProcessingMessage('1/7 File Received: Validating format and integrity...');

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    await delay(600);
    setProcessingStep(2);
    setProcessingMessage('2/7 OCR Extraction: Detecting text and amount symbols...');

    await delay(600);
    setProcessingStep(3);
    setProcessingMessage('3/7 Entity Parsing: Extracting dates, narrations, and values...');

    await delay(600);
    setProcessingStep(4);
    setProcessingMessage('4/7 Duplicate Detection: Cross-referencing existing ledger...');

    await delay(600);
    setProcessingStep(5);
    setProcessingMessage('5/7 Auto-Categorization: Applying 17 Nigerian banking rules...');

    await delay(600);
    setProcessingStep(6);
    setProcessingMessage('6/7 Confidence Scoring: Flagging ambiguous transactions...');

    await delay(500);
    setProcessingStep(7);
    setProcessingMessage('7/7 Processing Complete: Ready for review!');

    await delay(400);

    setIsProcessing(false);
    setIsImportCompleted(true);
  };

  const keepDuplicate = (id: string) => {
    const dup = duplicates.find(d => d.id === id);
    if (dup) {
      saveTransactions([dup, ...transactions]);
    }
    setDuplicates(prev => prev.filter(d => d.id !== id));
    setDuplicatesCount(prev => Math.max(0, prev - 1));
  };

  const removeDuplicate = (id: string) => {
    setDuplicates(prev => prev.filter(d => d.id !== id));
    setDuplicatesCount(prev => Math.max(0, prev - 1));
  };

  const resolveReview = (id: string, category: string) => {
    updateTransactionCategory(id, category);
  };

  const sendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Small delay to simulate thinking
    await new Promise(res => setTimeout(res, 350));

    const response = ChatService.answerQuery(text, summary, transactions, isBusiness);
    setChatMessages(prev => [...prev, response]);
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
        clearAllData,
        resetDemo: clearAllData,
        addTransaction,
        updateTransactionCategory,
        addUploadedFiles,
        removeUploadedFile,
        clearUploadedFiles,
        importCsvContent,
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

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};

export const useFinancialData = useFinancial;
