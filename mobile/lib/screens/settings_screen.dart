import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cash_flow_provider.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CashFlowProvider>();
    final isBusiness = provider.isBusinessMode;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 1,
        title: const Text(
          'Settings & Profile',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: Color(0xFF0F172A),
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Profile Header
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 28,
                  backgroundColor: Color(0xFF7B0046),
                  child: Text(
                    'OA',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Olumide Adeleke',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        isBusiness ? 'Wema SME Commercial Account' : 'Wema ALAT Premium Tier 3',
                        style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: const [
                          Icon(Icons.verified, color: Color(0xFF059669), size: 14),
                          SizedBox(width: 4),
                          Text(
                            'BVN Verified · 0129482910',
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF059669)),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Account & Preferences
          _buildSectionCard('Account Configuration', [
            _buildSwitchTile(
              'Business (SME) Mode',
              'Switch between personal finances and SME cash runway analytics',
              isBusiness,
              (v) => provider.setBusinessMode(v),
            ),
            _buildInfoTile('Default Currency', 'Nigerian Naira (₦ NGN)', Icons.currency_exchange),
            _buildInfoTile('Financial Year', 'Calendar Year (Jan - Dec)', Icons.calendar_today_outlined),
          ]),
          const SizedBox(height: 16),

          // Intelligence & Notifications
          _buildSectionCard('Intelligence Preferences', [
            _buildSwitchTile(
              'Unusual Spending Alerts',
              'Notify when category spending exceeds 25% weekly deviation',
              true,
              (v) {},
            ),
            _buildSwitchTile(
              'Recurring Payment Reminders',
              'Warn 7 days before high-value bills (rent, utilities) are due',
              true,
              (v) {},
            ),
            _buildSwitchTile(
              '30-Day Balance Forecast',
              'Display projected cash runway estimates on dashboard',
              true,
              (v) {},
            ),
          ]),
          const SizedBox(height: 16),

          // Privacy & Security
          _buildSectionCard('Security & Privacy', [
            _buildInfoTile('Processing Mode', 'Local In-Browser / On-Device Simulation', Icons.shield_outlined),
            _buildInfoTile('Zero Cloud Storage', 'Receipts and statements are processed in memory', Icons.lock_outline),
          ]),
          const SizedBox(height: 16),

          // Demo Controls
          _buildSectionCard('Demo Controls', [
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.refresh, color: Color(0xFFDC2626), size: 20),
              ),
              title: const Text('Reset Demo State', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
              subtitle: const Text('Restore default 6-month transactions and insights', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
              trailing: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFDC2626),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                onPressed: () {
                  provider.resetDemo();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Demo reset successfully!')),
                  );
                },
                child: const Text('Reset Demo', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              ),
            ),
          ]),

          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildSectionCard(String title, List<Widget> children) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
          ),
          const SizedBox(height: 10),
          const Divider(height: 1, color: Color(0xFFF1F5F9)),
          ...children,
        ],
      ),
    );
  }

  Widget _buildSwitchTile(String title, String subtitle, bool value, ValueChanged<bool> onChanged) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF1E293B))),
                const SizedBox(height: 2),
                Text(subtitle, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
              ],
            ),
          ),
          Switch(
            value: value,
            activeThumbColor: Colors.white,
            activeTrackColor: const Color(0xFF7B0046),
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }

  Widget _buildInfoTile(String title, String subtitle, IconData icon) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, size: 18, color: const Color(0xFF64748B)),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF1E293B))),
                const SizedBox(height: 2),
                Text(subtitle, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
