import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../models/cash_flow_summary.dart';
import '../models/category_item.dart';
import '../services/financial_engine.dart';

class SpendingDonutChartWidget extends StatefulWidget {
  final List<CategoryBreakdownItem> breakdowns;
  final ValueChanged<String>? onCategorySelect;

  const SpendingDonutChartWidget({
    super.key,
    required this.breakdowns,
    this.onCategorySelect,
  });

  @override
  State<SpendingDonutChartWidget> createState() => _SpendingDonutChartWidgetState();
}

class _SpendingDonutChartWidgetState extends State<SpendingDonutChartWidget> {
  int _touchedIndex = -1;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
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
            children: const [
              Text(
                'Where Your Money Goes',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF0F172A),
                ),
              ),
              Text(
                'This Month',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF64748B),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 180,
            child: PieChart(
              PieChartData(
                pieTouchData: PieTouchData(
                  touchCallback: (FlTouchEvent event, pieTouchResponse) {
                    setState(() {
                      if (!event.isInterestedForInteractions ||
                          pieTouchResponse == null ||
                          pieTouchResponse.touchedSection == null) {
                        _touchedIndex = -1;
                        return;
                      }
                      _touchedIndex = pieTouchResponse.touchedSection!.touchedSectionIndex;
                    });
                  },
                ),
                borderData: FlBorderData(show: false),
                sectionsSpace: 2,
                centerSpaceRadius: 50,
                sections: widget.breakdowns.asMap().entries.map((e) {
                  final idx = e.key;
                  final item = e.value;
                  final isTouched = idx == _touchedIndex;
                  final radius = isTouched ? 38.0 : 32.0;
                  final cat = CategoryDirectory.getCategory(item.category);

                  return PieChartSectionData(
                    color: cat.color,
                    value: item.percentage,
                    title: '${item.percentage.toInt()}%',
                    radius: radius,
                    titleStyle: TextStyle(
                      fontSize: isTouched ? 12 : 10,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
          const SizedBox(height: 16),
          // Category Breakdown List
          ...widget.breakdowns.map((item) {
            final cat = CategoryDirectory.getCategory(item.category);
            return InkWell(
              onTap: () {
                if (widget.onCategorySelect != null) {
                  widget.onCategorySelect!(item.category);
                }
              },
              borderRadius: BorderRadius.circular(8),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
                child: Row(
                  children: [
                    Container(
                      width: 10,
                      height: 10,
                      decoration: BoxDecoration(
                        color: cat.color,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        cat.name,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF1E293B),
                        ),
                      ),
                    ),
                    Text(
                      FinancialEngine.formatCurrency(item.amount),
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        '${item.percentage.toInt()}%',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF475569),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}
