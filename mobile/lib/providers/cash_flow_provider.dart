import 'dart:async';
import 'package:flutter/material.dart';
import '../models/transaction_item.dart';
import '../models/recurring_payment.dart';
import '../models/import_batch.dart';
import '../models/cash_flow_summary.dart';
import '../models/insight_item.dart';
import '../models/chat_message.dart';
import '../data/mock_data.dart';
import '../services/financial_engine.dart';
import '../services/chat_engine.dart';

class CashFlowProvider extends ChangeNotifier {
  List<TransactionItem> _transactions = [];
  List<RecurringPayment> _recurringPayments = [];
  List<ImportBatch> _importHistory = [];
  List<UploadedFileModel> _uploadedFiles = [];
  List<ChatMessage> _chatMessages = [];

  bool _isBusinessMode = false;
  DemoScenario _currentScenario = DemoScenario.personalNormal;

  // Import State Machine
  bool _isProcessingImport = false;
  int _importStepIndex = 0;
  String _importStepMessage = '';
  bool _importCompleted = false;
  int _detectedCount = 0;
  int _uniqueCount = 0;
  int _duplicatesCount = 0;
  int _reviewsCount = 0;
  List<TransactionItem> _duplicateTransactions = [];
  List<TransactionItem> _reviewTransactions = [];

  // Getters
  List<TransactionItem> get transactions => _transactions;
  List<RecurringPayment> get recurringPayments => _recurringPayments;
  List<ImportBatch> get importHistory => _importHistory;
  List<UploadedFileModel> get uploadedFiles => _uploadedFiles;
  List<ChatMessage> get chatMessages => _chatMessages;
  bool get isBusinessMode => _isBusinessMode;
  DemoScenario get currentScenario => _currentScenario;

  bool get isProcessingImport => _isProcessingImport;
  int get importStepIndex => _importStepIndex;
  String get importStepMessage => _importStepMessage;
  bool get importCompleted => _importCompleted;
  int get detectedCount => _detectedCount;
  int get uniqueCount => _uniqueCount;
  int get duplicatesCount => _duplicatesCount;
  int get reviewsCount => _reviewsCount;
  List<TransactionItem> get duplicateTransactions => _duplicateTransactions;
  List<TransactionItem> get reviewTransactions => _reviewTransactions;

  CashFlowSummary get summary => FinancialEngine.calculateSummary(
        transactions: _transactions,
        isBusinessMode: _isBusinessMode,
        scenario: _currentScenario,
      );

  List<InsightItem> get insights => FinancialEngine.generateInsights(
        isBusinessMode: _isBusinessMode,
        scenario: _currentScenario,
      );

  CashFlowProvider() {
    _initializeData();
  }

  void _initializeData() {
    _transactions = MockData.generateTransactions();
    _recurringPayments = MockData.getRecurringPayments();
    _importHistory = MockData.getImportHistory();
    _isBusinessMode = false;
    _currentScenario = DemoScenario.personalNormal;
    _uploadedFiles = [];
    _isProcessingImport = false;
    _importCompleted = false;

    _chatMessages = [
      ChatMessage(
        id: 'welcome-1',
        sender: MessageSender.assistant,
        text: 'Hello! I am your Wema CashFlow Intelligence Assistant. I have analyzed your recent 6 months of banking activity. What would you like to explore today?',
        timestamp: DateTime.now().subtract(const Duration(minutes: 5)),
        quickFollowUps: const [
          'Why did my expenses increase?',
          'How much did I spend on food this month?',
          'What are my recurring payments?',
          'Where did I spend the most?',
          'Can I afford my usual expenses?',
        ],
      ),
    ];
    notifyListeners();
  }

  void setBusinessMode(bool value) {
    _isBusinessMode = value;
    if (_isBusinessMode && _currentScenario != DemoScenario.smeGrowingRevenue && _currentScenario != DemoScenario.smeRisingExpenses) {
      _currentScenario = DemoScenario.smeGrowingRevenue;
    } else if (!_isBusinessMode && (_currentScenario == DemoScenario.smeGrowingRevenue || _currentScenario == DemoScenario.smeRisingExpenses)) {
      _currentScenario = DemoScenario.personalNormal;
    }
    notifyListeners();
  }

  void setScenario(DemoScenario scenario) {
    _currentScenario = scenario;
    if (scenario == DemoScenario.smeGrowingRevenue || scenario == DemoScenario.smeRisingExpenses) {
      _isBusinessMode = true;
    } else {
      _isBusinessMode = false;
    }
    notifyListeners();
  }

  void resetDemo() {
    _initializeData();
  }

  void updateTransactionCategory(String id, String newCategory) {
    final idx = _transactions.indexWhere((t) => t.id == id);
    if (idx != -1) {
      _transactions[idx] = _transactions[idx].copyWith(
        category: newCategory,
        categoryConfidence: 1.0,
      );
      notifyListeners();
    }
  }

  // Upload Management
  void addUploadedFiles(List<UploadedFileModel> files) {
    _uploadedFiles.addAll(files);
    notifyListeners();
  }

  void removeUploadedFile(String id) {
    _uploadedFiles.removeWhere((f) => f.id == id);
    notifyListeners();
  }

  void clearUploadedFiles() {
    _uploadedFiles.clear();
    _isProcessingImport = false;
    _importCompleted = false;
    notifyListeners();
  }

  void loadSampleFiles() {
    _uploadedFiles = [
      UploadedFileModel(
        id: 'file-1',
        name: 'Wema_Bank_Statement_Aug_Sep.pdf',
        sizeBytes: 1240000,
        fileType: 'application/pdf',
      ),
      UploadedFileModel(
        id: 'file-2',
        name: 'POS_Receipts_Lekki_Shoprite.png',
        sizeBytes: 840000,
        fileType: 'image/png',
      ),
      UploadedFileModel(
        id: 'file-3',
        name: 'Uber_Taxify_Receipts_Sep.png',
        sizeBytes: 620000,
        fileType: 'image/png',
      ),
      UploadedFileModel(
        id: 'file-4',
        name: 'Business_Invoices_Settlement.csv',
        sizeBytes: 310000,
        fileType: 'text/csv',
      ),
    ];
    notifyListeners();
  }

  // Timed State Machine for Simulated Screenshot OCR
  Future<void> simulateOcrImport() async {
    _isProcessingImport = true;
    _importCompleted = false;
    _importStepIndex = 0;
    notifyListeners();

    final steps = [
      'Reading uploaded files and metadata...',
      'Extracting transaction lines and timestamps...',
      'Detecting duplicate transactions across statements...',
      'Normalizing amounts and merchant descriptions...',
      'Running intelligent categorization engine...',
      'Calculating net cash flow, runaways and trends...',
      'Generating actionable financial insights...',
    ];

    for (int i = 0; i < steps.length; i++) {
      _importStepIndex = i;
      _importStepMessage = steps[i];
      notifyListeners();
      await Future.delayed(const Duration(milliseconds: 650));
    }

    _detectedCount = 287;
    _uniqueCount = 274;
    _duplicatesCount = 13;
    _reviewsCount = 6;

    // Seed duplicate list for interactive review
    _duplicateTransactions = [
      TransactionItem(
        id: 'dup-1',
        title: 'Uber Nigeria Ride',
        description: 'Duplicate detected from statement & receipt screenshot',
        amount: 8500.0,
        type: TransactionType.debit,
        category: 'Transport',
        categoryConfidence: 0.98,
        date: DateTime(2026, 9, 15, 18, 45),
        reference: 'WMA-CARD-881293',
        balanceAfter: 178500.0,
        isDuplicate: true,
      ),
      TransactionItem(
        id: 'dup-2',
        title: 'Swift 4G Fibre Internet',
        description: 'Auto-debit matching invoice screenshot',
        amount: 20000.0,
        type: TransactionType.debit,
        category: 'Utilities',
        categoryConfidence: 0.97,
        date: DateTime(2026, 9, 3, 10, 0),
        reference: 'SWF-REC-773194',
        balanceAfter: 336700.0,
        isDuplicate: true,
      ),
      TransactionItem(
        id: 'dup-3',
        title: 'Shoprite Lekki Retail',
        description: 'Duplicate transaction matched via exact timestamp',
        amount: 45200.0,
        type: TransactionType.debit,
        category: 'Shopping',
        categoryConfidence: 0.96,
        date: DateTime(2026, 9, 14, 16, 20),
        reference: 'POS-SHPR-441209',
        balanceAfter: 187000.0,
        isDuplicate: true,
      ),
    ];

    // Seed review list for low-confidence confirmation
    _reviewTransactions = [
      TransactionItem(
        id: 'rev-1',
        title: 'PAY_GATE*TRF 009214',
        description: 'Ambiguous merchant reference detected in receipt OCR',
        amount: 14500.0,
        type: TransactionType.debit,
        category: 'Other',
        categoryConfidence: 0.62,
        date: DateTime(2026, 9, 11, 14, 12),
        reference: 'UNK-REC-009214',
        balanceAfter: 280000.0,
        needsReview: true,
      ),
      TransactionItem(
        id: 'rev-2',
        title: 'DIRECT CREDIT REF 88123',
        description: 'Uncategorized third-party inflow from corporate entity',
        amount: 85000.0,
        type: TransactionType.credit,
        category: 'Business Revenue',
        categoryConfidence: 0.68,
        date: DateTime(2026, 9, 9, 16, 40),
        reference: 'UNK-IN-88123',
        balanceAfter: 365000.0,
        needsReview: true,
      ),
    ];

    // Add new entry to import history
    _importHistory.insert(
      0,
      ImportBatch(
        id: 'imp-${DateTime.now().millisecondsSinceEpoch}',
        date: DateTime.now(),
        fileCount: _uploadedFiles.isEmpty ? 4 : _uploadedFiles.length,
        totalDetected: _detectedCount,
        uniqueCount: _uniqueCount,
        duplicateCount: _duplicatesCount,
        reviewNeededCount: _reviewsCount,
        status: 'Completed',
      ),
    );

    _isProcessingImport = false;
    _importCompleted = true;
    notifyListeners();
  }

  void removeDuplicateItem(String id) {
    _duplicateTransactions.removeWhere((t) => t.id == id);
    _duplicatesCount = (_duplicatesCount - 1).clamp(0, 99);
    notifyListeners();
  }

  void resolveReviewItem(String id, String category) {
    _reviewTransactions.removeWhere((t) => t.id == id);
    _reviewsCount = (_reviewsCount - 1).clamp(0, 99);
    notifyListeners();
  }

  // Ask Wema Chat
  Future<void> sendChatMessage(String text) async {
    final userMsg = ChatMessage(
      id: 'msg-${DateTime.now().millisecondsSinceEpoch}',
      sender: MessageSender.user,
      text: text,
      timestamp: DateTime.now(),
    );
    _chatMessages.add(userMsg);
    notifyListeners();

    // Simulate intelligent analytical processing
    await Future.delayed(const Duration(milliseconds: 500));

    final aiReply = ChatEngine.answerQuery(
      query: text,
      summary: summary,
      isBusinessMode: _isBusinessMode,
    );

    _chatMessages.add(aiReply);
    notifyListeners();
  }
}
