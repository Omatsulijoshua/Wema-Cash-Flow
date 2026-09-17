import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cash_flow_provider.dart';

class ModeToggleWidget extends StatelessWidget {
  const ModeToggleWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CashFlowProvider>();
    final isBusiness = provider.isBusinessMode;

    return Container(
      height: 36,
      decoration: BoxDecoration(
        color: const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      padding: const EdgeInsets.all(3),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          GestureDetector(
            onTap: () => provider.setBusinessMode(false),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: !isBusiness ? Colors.white : Colors.transparent,
                borderRadius: BorderRadius.circular(16),
                boxShadow: !isBusiness
                    ? const [
                        BoxShadow(
                          color: Color(0x15000000),
                          blurRadius: 4,
                          offset: Offset(0, 1),
                        ),
                      ]
                    : null,
              ),
              alignment: Alignment.center,
              child: Text(
                'Personal',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: !isBusiness ? FontWeight.w700 : FontWeight.w500,
                  color: !isBusiness ? const Color(0xFF7B0046) : const Color(0xFF64748B),
                ),
              ),
            ),
          ),
          GestureDetector(
            onTap: () => provider.setBusinessMode(true),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: isBusiness ? Colors.white : Colors.transparent,
                borderRadius: BorderRadius.circular(16),
                boxShadow: isBusiness
                    ? const [
                        BoxShadow(
                          color: Color(0x15000000),
                          blurRadius: 4,
                          offset: Offset(0, 1),
                        ),
                      ]
                    : null,
              ),
              alignment: Alignment.center,
              child: Text(
                'Business (SME)',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: isBusiness ? FontWeight.w700 : FontWeight.w500,
                  color: isBusiness ? const Color(0xFF7B0046) : const Color(0xFF64748B),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
