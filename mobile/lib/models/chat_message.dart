enum MessageSender { user, assistant }

class ChatMetricHighlight {
  final String label;
  final String value;
  final String? subtext;
  final bool isPositive;

  const ChatMetricHighlight({
    required this.label,
    required this.value,
    this.subtext,
    this.isPositive = true,
  });
}

class ChatMessage {
  final String id;
  final MessageSender sender;
  final String text;
  final DateTime timestamp;
  final List<ChatMetricHighlight> metrics;
  final List<String> supportingCategories;
  final List<String> quickFollowUps;

  ChatMessage({
    required this.id,
    required this.sender,
    required this.text,
    required this.timestamp,
    this.metrics = const [],
    this.supportingCategories = const [],
    this.quickFollowUps = const [],
  });
}
