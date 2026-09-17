enum TransactionType { debit, credit }

class TransactionItem {
  final String id;
  final String title;
  final String description;
  final double amount;
  final TransactionType type;
  String category;
  final double categoryConfidence;
  final DateTime date;
  final String reference;
  final double balanceAfter;
  final String status;
  final String paymentChannel; // POS, WEB, USSD, ATM, TRANSFER
  final bool isDuplicate;
  final bool needsReview;

  TransactionItem({
    required this.id,
    required this.title,
    required this.description,
    required this.amount,
    required this.type,
    required this.category,
    required this.categoryConfidence,
    required this.date,
    required this.reference,
    required this.balanceAfter,
    this.status = 'Completed',
    this.paymentChannel = 'TRANSFER',
    this.isDuplicate = false,
    this.needsReview = false,
  });

  TransactionItem copyWith({
    String? category,
    double? categoryConfidence,
    bool? isDuplicate,
    bool? needsReview,
  }) {
    return TransactionItem(
      id: id,
      title: title,
      description: description,
      amount: amount,
      type: type,
      category: category ?? this.category,
      categoryConfidence: categoryConfidence ?? this.categoryConfidence,
      date: date,
      reference: reference,
      balanceAfter: balanceAfter,
      status: status,
      paymentChannel: paymentChannel,
      isDuplicate: isDuplicate ?? this.isDuplicate,
      needsReview: needsReview ?? this.needsReview,
    );
  }
}
