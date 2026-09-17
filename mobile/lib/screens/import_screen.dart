import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/cash_flow_provider.dart';
import '../services/financial_engine.dart';

class ImportScreen extends StatelessWidget {
  const ImportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CashFlowProvider>();
    final files = provider.uploadedFiles;
    final isProcessing = provider.isProcessingImport;
    final isCompleted = provider.importCompleted;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 1,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text(
              'Import Transactions',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
              ),
            ),
            SizedBox(height: 2),
            Text(
              'Turn screenshots and statements into financial intelligence',
              style: TextStyle(
                fontSize: 12,
                color: Color(0xFF64748B),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Upload dropzone card
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: const Color(0xFFCBD5E1),
                style: BorderStyle.solid,
                width: 1.5,
              ),
            ),
            child: Column(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFCE7F3),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.cloud_upload_outlined,
                    color: Color(0xFF7B0046),
                    size: 28,
                  ),
                ),
                const SizedBox(height: 14),
                const Text(
                  'Upload Transaction Statements & Screenshots',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Supported formats: JPG, PNG, PDF, CSV, Excel (multi-file selection enabled)',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 12,
                    color: Color(0xFF64748B),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF7B0046),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      ),
                      onPressed: () {
                        provider.loadSampleFiles();
                      },
                      icon: const Icon(Icons.folder_open, size: 18),
                      label: const Text('Load Demo Files (4 files)', style: TextStyle(fontWeight: FontWeight.w600)),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Uploaded files list
          if (files.isNotEmpty) ...[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Uploaded Files (${files.length})',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF0F172A),
                  ),
                ),
                TextButton(
                  onPressed: () => provider.clearUploadedFiles(),
                  child: const Text(
                    'Clear All',
                    style: TextStyle(fontSize: 12, color: Color(0xFFDC2626)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            ...files.map((f) {
              final isPdf = f.name.endsWith('.pdf');
              final isCsv = f.name.endsWith('.csv');
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: isPdf
                            ? const Color(0xFFFEE2E2)
                            : (isCsv ? const Color(0xFFD1FAE5) : const Color(0xFFDBEAFE)),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(
                        isPdf
                            ? Icons.picture_as_pdf
                            : (isCsv ? Icons.table_chart : Icons.image),
                        size: 20,
                        color: isPdf
                            ? const Color(0xFFDC2626)
                            : (isCsv ? const Color(0xFF059669) : const Color(0xFF2563EB)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            f.name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            f.formattedSize,
                            style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, size: 18, color: Color(0xFF94A3B8)),
                      onPressed: () => provider.removeUploadedFile(f.id),
                    ),
                  ],
                ),
              );
            }),
            const SizedBox(height: 12),

            // Start Analysis Button
            if (!isProcessing && !isCompleted)
              SizedBox(
                width: double.infinity,
                height: 46,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF7B0046),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  onPressed: () => provider.simulateOcrImport(),
                  icon: const Icon(Icons.bolt, size: 20),
                  label: const Text(
                    'Start AI Intelligence Extraction',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
                  ),
                ),
              ),
          ],

          // Processing State Machine Animation
          if (isProcessing) ...[
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: const [
                      SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.5,
                          valueColor: AlwaysStoppedAnimation(Color(0xFF7B0046)),
                        ),
                      ),
                      SizedBox(width: 12),
                      Text(
                        'Analyzing your transactions...',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: (provider.importStepIndex + 1) / 7.0,
                      backgroundColor: const Color(0xFFF1F5F9),
                      valueColor: const AlwaysStoppedAnimation(Color(0xFF7B0046)),
                      minHeight: 6,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildStageRow(0, 'Reading uploaded files', provider.importStepIndex),
                  _buildStageRow(1, 'Extracting transaction information', provider.importStepIndex),
                  _buildStageRow(2, 'Detecting duplicate transactions', provider.importStepIndex),
                  _buildStageRow(3, 'Normalizing transaction data', provider.importStepIndex),
                  _buildStageRow(4, 'Categorizing transactions', provider.importStepIndex),
                  _buildStageRow(5, 'Calculating cash flow', provider.importStepIndex),
                  _buildStageRow(6, 'Generating insights', provider.importStepIndex),
                ],
              ),
            ),
          ],

          // Completed Simulation Result
          if (isCompleted) ...[
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF86EFAC)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: const [
                      Icon(Icons.check_circle, color: Color(0xFF16A34A), size: 22),
                      SizedBox(width: 8),
                      Text(
                        'Intelligence Extraction Completed',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF166534),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  _buildResultPill('287 transactions detected', const Color(0xFF1E293B)),
                  _buildResultPill('274 unique transactions', const Color(0xFF16A34A)),
                  _buildResultPill('${provider.duplicatesCount} duplicate transactions removed', const Color(0xFFDC2626)),
                  _buildResultPill('274 transactions categorized', const Color(0xFF2563EB)),
                  _buildResultPill('${provider.reviewsCount} transactions need review', const Color(0xFFD97706)),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Duplicates Review Section
            if (provider.duplicateTransactions.isNotEmpty) ...[
              Text(
                '${provider.duplicateTransactions.length} Possible Duplicates Detected',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 8),
              ...provider.duplicateTransactions.map((dup) {
                return Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFFECACA)),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              dup.title,
                              style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                            ),
                            Text(
                              dup.description,
                              style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              FinancialEngine.formatCurrency(dup.amount),
                              style: const TextStyle(fontWeight: FontWeight.w700, color: Color(0xFFDC2626), fontSize: 13),
                            ),
                          ],
                        ),
                      ),
                      TextButton(
                        onPressed: () => provider.removeDuplicateItem(dup.id),
                        child: const Text('Remove', style: TextStyle(color: Color(0xFFDC2626), fontWeight: FontWeight.w600)),
                      ),
                      TextButton(
                        onPressed: () => provider.removeDuplicateItem(dup.id),
                        child: const Text('Keep', style: TextStyle(color: Color(0xFF059669), fontWeight: FontWeight.w600)),
                      ),
                    ],
                  ),
                );
              }),
            ],
          ],

          const SizedBox(height: 24),

          // Import History
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Text(
                'Import History',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF0F172A),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ...provider.importHistory.map((batch) {
            final dateStr = DateFormat('MMMM dd, yyyy').format(batch.date);
            return Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        dateStr,
                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFFD1FAE5),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text(
                          'Completed',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Color(0xFF065F46)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    '${batch.fileCount} files · ${batch.totalDetected} transactions found · ${batch.duplicateCount} duplicates removed',
                    style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                  ),
                ],
              ),
            );
          }),

          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildStageRow(int index, String title, int currentIndex) {
    final isDone = currentIndex > index;
    final isRunning = currentIndex == index;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(
            isDone ? Icons.check_circle : (isRunning ? Icons.radio_button_checked : Icons.radio_button_unchecked),
            size: 16,
            color: isDone ? const Color(0xFF16A34A) : (isRunning ? const Color(0xFF7B0046) : const Color(0xFF94A3B8)),
          ),
          const SizedBox(width: 8),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              fontWeight: isRunning ? FontWeight.w700 : FontWeight.w500,
              color: isDone ? const Color(0xFF15803D) : (isRunning ? const Color(0xFF0F172A) : const Color(0xFF94A3B8)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResultPill(String text, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        children: [
          Icon(Icons.check, size: 16, color: color),
          const SizedBox(width: 8),
          Text(
            text,
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: color),
          ),
        ],
      ),
    );
  }
}
