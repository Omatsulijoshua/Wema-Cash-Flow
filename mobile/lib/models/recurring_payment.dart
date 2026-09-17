enum RecurringStatus { active, upcoming, recentlyDetected }

class RecurringPayment {
  final String id;
  final String title;
  final String category;
  final double amount;
  final String frequency; // Monthly, Weekly, Yearly
  final DateTime nextDueDate;
  final RecurringStatus status;
  final String provider;
  final String channel;

  RecurringPayment({
    required this.id,
    required this.title,
    required this.category,
    required this.amount,
    required this.frequency,
    required this.nextDueDate,
    required this.status,
    required this.provider,
    required this.channel,
  });
}
