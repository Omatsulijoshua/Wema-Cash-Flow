import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cash_flow_provider.dart';
import '../widgets/insight_card.dart';
import '../widgets/mode_toggle.dart';
import '../widgets/scenario_selector.dart';

class InsightsScreen extends StatelessWidget {
  final ValueChanged<int>? onNavigateTab;

  const InsightsScreen({super.key, this.onNavigateTab});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CashFlowProvider>();
    final insights = provider.insights;

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
              'Financial Insights',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
              ),
            ),
            SizedBox(height: 2),
            Text(
              'A clearer picture of what\'s happening with your money.',
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
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              ModeToggleWidget(),
              ScenarioSelectorWidget(),
            ],
          ),
          const SizedBox(height: 16),

          // Insights banner
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFF0FDF4),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFBBF7D0)),
            ),
            child: Row(
              children: const [
                Icon(Icons.auto_awesome, color: Color(0xFF16A34A), size: 18),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Insights are computed dynamically from your 6-month transaction history and current spending velocity.',
                    style: TextStyle(fontSize: 12, color: Color(0xFF166534), fontWeight: FontWeight.w500),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          if (insights.isEmpty)
            Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  children: const [
                    Icon(Icons.lightbulb_outline, size: 48, color: Color(0xFF94A3B8)),
                    SizedBox(height: 12),
                    Text(
                      'We\'re still learning your cash-flow patterns.',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Color(0xFF475569)),
                    ),
                  ],
                ),
              ),
            )
          else
            ...insights.map((ins) {
              return InsightCardWidget(
                insight: ins,
                onCtaTap: () {
                  if (onNavigateTab != null) {
                    if (ins.ctaRoute == '/transactions') onNavigateTab!(1);
                    if (ins.ctaRoute == '/cash-flow') onNavigateTab!(2);
                    if (ins.ctaRoute == '/recurring') onNavigateTab!(2);
                  }
                },
              );
            }),

          const SizedBox(height: 40),
        ],
      ),
    );
  }
}
