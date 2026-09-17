import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import '../models/transaction_item.dart';
import '../models/recurring_payment.dart';
import '../models/import_batch.dart';
import '../models/cash_flow_summary.dart';
import '../models/insight_item.dart';
import '../models/chat_message.dart';
import '../services/financial_engine.dart';
import '../services/categorization_engine.dart';
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
  int get detectedCount => _transactions.length + _duplicateTransactions.length;
  int get uniqueCount => _transactions.length;
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
        transactions: _transactions,
        summary: summary,
        isBusinessMode: _isBusinessMode,
      );

  CashFlowProvider() {
    _initializeData();
  }

  void _initializeData() {
    _transactions = [];
    _recurringPayments = [];
    _importHistory = [];
    _isBusinessMode = false;
    _currentScenario = DemoScenario.personalNormal;
    _uploadedFiles = [];
    _isProcessingImport = false;
    _importCompleted = false;
    _duplicatesCount = 0;
    _reviewsCount = 0;
    _duplicateTransactions = [];
    _reviewTransactions = [];

    _chatMessages = [
      ChatMessage(
        id: 'welcome-1',
        sender: MessageSender.assistant,
        text:
            'Hello! I am your Wema CashFlow Intelligence Assistant. When you import transactions or statements, I will analyze your spending patterns, detect recurring commitments, and answer any financial questions.',
        timestamp: DateTime.now(),
        quickFollowUps: const [
          'How do I import a CSV?',
          'What are the features of Wema CashFlow?',
        ],
      ),
    ];
    notifyListeners();
  }

  void setBusinessMode(bool value) {
    _isBusinessMode = value;
    notifyListeners();
  }

  void setScenario(DemoScenario scenario) {
    _currentScenario = scenario;
    notifyListeners();
  }

  void clearAllData() {
    _transactions = [];
    _recurringPayments = [];
    _importHistory = [];
    _uploadedFiles = [];
    _duplicateTransactions = [];
    _reviewTransactions = [];
    _duplicatesCount = 0;
    _reviewsCount = 0;
    _importCompleted = false;
    notifyListeners();
  }

  void resetDemo() {
    clearAllData();
  }

  void addTransaction(TransactionItem item) {
    _transactions.insert(0, item);
    _detectRecurringPayments();
    notifyListeners();
  }

  void updateTransactionCategory(String id, String newCategory) {
    final index = _transactions.indexWhere((t) => t.id == id);
    if (index != -1) {
      final old = _transactions[index];
      _transactions[index] = old.copyWith(
        category: newCategory,
        categoryConfidence: 1.0,
        needsReview: false,
      );
      _reviewTransactions.removeWhere((t) => t.id == id);
      _reviewsCount = _reviewTransactions.length;
      notifyListeners();
    }
  }

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
    _importCompleted = false;
    notifyListeners();
  }

  void loadSampleFiles() {
    _uploadedFiles = [
      UploadedFileModel(
        id: 'up-1',
        name: 'wema_bank_statement.csv',
        sizeBytes: 24576,
        fileType: 'text/csv',
      ),
    ];
    notifyListeners();
  }

  // Real CSV Statement Parser for Flutter
  void importCsv(String csvContent, {String? fileName}) {
    final lines = csvContent.split(RegExp(r'\r?\n')).where((l) => l.trim().isNotEmpty).toList();
    if (lines.length < 2) return;

    final header = lines[0].toLowerCase().split(',');
    int dateIdx = header.indexWhere((h) => h.contains('date'));
    int descIdx = header.indexWhere((h) => h.contains('desc') || h.contains('narrat') || h.contains('title'));
    int amtIdx = header.indexWhere((h) => h.contains('amount') || h.contains('sum') || h.contains('val'));
    int typeIdx = header.indexWhere((h) => h.contains('type') || h.contains('dr') || h.contains('cr'));
    int catIdx = header.indexWhere((h) => h.contains('cat'));

    if (dateIdx == -1) dateIdx = 0;
    if (descIdx == -1) descIdx = 1;
    if (amtIdx == -1) amtIdx = 2;

    final List<TransactionItem> newItems = [];
    final Set<String> existingSignatures = _transactions
        .map((t) => '${t.date.toIso8601String().split("T")[0]}_${t.title.trim().toLowerCase()}_${t.amount}')
        .toSet();

    for (int i = 1; i < lines.length; i++) {
      final cols = lines[i].split(',').map((c) => c.trim().replaceAll('"', '')).toList();
      if (cols.length <= max(dateIdx, max(descIdx, amtIdx))) continue;

      final rawDate = cols[dateIdx];
      final title = cols[descIdx];
      final rawAmt = double.tryParse(cols[amtIdx].replaceAll(RegExp(r'[^0-9.-]'), '')) ?? 0.0;
      if (rawAmt == 0.0) continue;

      TransactionType type = TransactionType.debit;
      if (typeIdx != -1 && cols.length > typeIdx) {
        final tStr = cols[typeIdx].toLowerCase();
        if (tStr.contains('cr') || tStr.contains('in') || tStr.contains('dep')) {
          type = TransactionType.credit;
        }
      }

      DateTime date;
      try {
        date = DateTime.parse(rawDate);
      } catch (_) {
        date = DateTime.now();
      }

      String category = 'Other';
      double confidence = 0.85;

      if (catIdx != -1 && cols.length > catIdx && cols[catIdx].isNotEmpty) {
        category = cols[catIdx];
        confidence = 0.95;
      } else {
        final catResult = CategorizationEngine.categorize(title);
        category = catResult.category;
        confidence = catResult.confidence;
      }

      final signature = '${date.toIso8601String().split("T")[0]}_${title.trim().toLowerCase()}_${rawAmt.abs()}';

      final item = TransactionItem(
        id: 'tx-${DateTime.now().millisecondsSinceEpoch}-$i',
        title: title,
        description: 'Imported from ${fileName ?? "statement"}',
        amount: rawAmt.abs(),
        type: type,
        category: category,
        categoryConfidence: confidence,
        date: date,
        reference: 'REF-${100000 + i}',
        balanceAfter: 0.0,
        status: 'Completed',
        paymentChannel: 'TRANSFER',
      );

      if (existingSignatures.contains(signature)) {
        _duplicateTransactions.add(item);
      } else {
        existingSignatures.add(signature);
        newItems.add(item);
        if (confidence < 0.7) {
          _reviewTransactions.add(item);
        }
      }
    }

    if (newItems.isNotEmpty) {
      _transactions.insertAll(0, newItems);
      _detectRecurringPayments();
    }

    _duplicatesCount = _duplicateTransactions.length;
    _reviewsCount = _reviewTransactions.length;

    _importHistory.insert(
      0,
      ImportBatch(
        id: 'imp-${DateTime.now().millisecondsSinceEpoch}',
        date: DateTime.now(),
        fileCount: 1,
        totalDetected: newItems.length + _duplicateTransactions.length,
        uniqueCount: newItems.length,
        duplicateCount: _duplicateTransactions.length,
        reviewNeededCount: _reviewTransactions.length,
        status: 'Completed',
      ),
    );

    notifyListeners();
  }

  void _detectRecurringPayments() {
    final Map<String, List<TransactionItem>> map = {};
    for (final t in _transactions) {
      if (t.type == TransactionType.debit) {
        final key = t.title.toLowerCase().trim();
        map.putIfAbsent(key, () => []).add(t);
      }
    }

    final List<RecurringPayment> detected = [];
    int idCount = 1;
    for (final entry in map.entries) {
      if (entry.value.length >= 2) {
        final first = entry.value.first;
        final bool amountsMatch = entry.value.every((t) => (t.amount - first.amount).abs() < 500);
        if (amountsMatch) {
          detected.add(RecurringPayment(
            id: 'rec-${idCount++}',
            title: first.title,
            category: first.category,
            amount: first.amount,
            frequency: 'Monthly',
            nextDueDate: DateTime(2026, 10, 1),
            status: RecurringStatus.active,
            provider: first.title,
            channel: 'TRANSFER',
          ));
        }
      }
    }
    _recurringPayments = detected;
  }

  Future<void> simulateImport() async {
    if (_uploadedFiles.isEmpty) return;

    _isProcessingImport = true;
    _importStepIndex = 1;
    _importStepMessage = '1/7 File Received: Validating format and integrity...';
    notifyListeners();

    final steps = [
      '2/7 OCR Extraction: Detecting text and amount symbols...',
      '3/7 Entity Parsing: Extracting dates, narrations, and values...',
      '4/7 Duplicate Detection: Cross-referencing existing ledger...',
      '5/7 Auto-Categorization: Applying 17 Nigerian banking rules...',
      '6/7 Confidence Scoring: Flagging ambiguous transactions...',
      '7/7 Processing Complete: Ready for review!',
    ];

    for (int i = 0; i < steps.length; i++) {
      await Future.delayed(const Duration(milliseconds: 500));
      _importStepIndex = i + 2;
      _importStepMessage = steps[i];
      notifyListeners();
    }

    _isProcessingImport = false;
    _importCompleted = true;
    notifyListeners();
  }

  Future<void> simulateOcrImport() => simulateImport();

  void keepDuplicate(String id) {
    final dupIndex = _duplicateTransactions.indexWhere((d) => d.id == id);
    if (dupIndex != -1) {
      final dup = _duplicateTransactions.removeAt(dupIndex);
      _transactions.insert(0, dup);
      _duplicatesCount = _duplicateTransactions.length;
      notifyListeners();
    }
  }

  void removeDuplicate(String id) {
    _duplicateTransactions.removeWhere((d) => d.id == id);
    _duplicatesCount = _duplicateTransactions.length;
    notifyListeners();
  }

  void removeDuplicateItem(String id) => removeDuplicate(id);

  Future<void> sendMessage(String text) async {
    final userMsg = ChatMessage(
      id: 'usr-${DateTime.now().millisecondsSinceEpoch}',
      sender: MessageSender.user,
      text: text,
      timestamp: DateTime.now(),
    );
    _chatMessages.add(userMsg);
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 400));

    final botMsg = ChatEngine.answerQuery(
      query: text,
      summary: summary,
      transactions: _transactions,
      isBusinessMode: _isBusinessMode,
    );
    _chatMessages.add(botMsg);
    notifyListeners();
  }

  Future<void> sendChatMessage(String text) => sendMessage(text);
}
