enum ImportFileStatus { uploaded, analyzing, processed, failed, needsReview }

class UploadedFileModel {
  final String id;
  final String name;
  final int sizeBytes;
  final String fileType; // image/png, image/jpeg, application/pdf, text/csv, etc.
  ImportFileStatus status;
  final int detectedTransactions;
  final String? previewUri;

  UploadedFileModel({
    required this.id,
    required this.name,
    required this.sizeBytes,
    required this.fileType,
    this.status = ImportFileStatus.uploaded,
    this.detectedTransactions = 0,
    this.previewUri,
  });

  String get formattedSize {
    if (sizeBytes < 1024) return '$sizeBytes B';
    if (sizeBytes < 1024 * 1024) return '${(sizeBytes / 1024).toStringAsFixed(1)} KB';
    return '${(sizeBytes / (1024 * 1024)).toStringAsFixed(1)} MB';
  }
}

class ImportBatch {
  final String id;
  final DateTime date;
  final int fileCount;
  final int totalDetected;
  final int uniqueCount;
  final int duplicateCount;
  final int reviewNeededCount;
  final String status;

  ImportBatch({
    required this.id,
    required this.date,
    required this.fileCount,
    required this.totalDetected,
    required this.uniqueCount,
    required this.duplicateCount,
    required this.reviewNeededCount,
    this.status = 'Completed',
  });
}
