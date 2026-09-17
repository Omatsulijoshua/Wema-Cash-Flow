import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cash_flow_provider.dart';
import '../services/financial_engine.dart';

class ScenarioSelectorWidget extends StatelessWidget {
  const ScenarioSelectorWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CashFlowProvider>();

    final items = [
      {'label': 'Personal — Normal', 'value': DemoScenario.personalNormal},
      {'label': 'Personal — High Spending', 'value': DemoScenario.personalHighSpending},
      {'label': 'Personal — Low Balance', 'value': DemoScenario.personalLowBalance},
      {'label': 'SME — Growing Revenue', 'value': DemoScenario.smeGrowingRevenue},
      {'label': 'SME — Rising Expenses', 'value': DemoScenario.smeRisingExpenses},
    ];

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.tune, size: 14, color: Color(0xFF64748B)),
          const SizedBox(width: 6),
          DropdownButtonHideUnderline(
            child: DropdownButton<DemoScenario>(
              value: provider.currentScenario,
              isDense: true,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Color(0xFF0F172A),
              ),
              items: items.map((item) {
                return DropdownMenuItem<DemoScenario>(
                  value: item['value'] as DemoScenario,
                  child: Text(item['label'] as String),
                );
              }).toList(),
              onChanged: (val) {
                if (val != null) {
                  provider.setScenario(val);
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}
