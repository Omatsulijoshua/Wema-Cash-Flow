import 'package:flutter/material.dart';

class FinancialMetricCard extends StatelessWidget {
  final String title;
  final String amount;
  final String? trendText;
  final bool? isPositiveTrend;
  final IconData icon;
  final Color? iconColor;
  final Color? iconBgColor;

  const FinancialMetricCard({
    super.key,
    required this.title,
    required this.amount,
    this.trendText,
    this.isPositiveTrend,
    required this.icon,
    this.iconColor,
    this.iconBgColor,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveIconColor = iconColor ?? const Color(0xFF7B0046);
    final effectiveBgColor = iconBgColor ?? const Color(0xFFF1F5F9);

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x08000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF64748B),
                  letterSpacing: 0.1,
                ),
              ),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: effectiveBgColor,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  icon,
                  size: 18,
                  color: effectiveIconColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            amount,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: Color(0xFF0F172A),
              letterSpacing: -0.5,
            ),
          ),
          if (trendText != null) ...[
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(
                  (isPositiveTrend ?? true) ? Icons.trending_up : Icons.trending_down,
                  size: 15,
                  color: (isPositiveTrend ?? true)
                      ? const Color(0xFF059669)
                      : const Color(0xFFDC2626),
                ),
                const SizedBox(width: 4),
                Text(
                  trendText!,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: (isPositiveTrend ?? true)
                        ? const Color(0xFF059669)
                        : const Color(0xFFDC2626),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
