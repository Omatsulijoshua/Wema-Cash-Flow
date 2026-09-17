import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cash_flow_provider.dart';
import '../services/financial_engine.dart';
import '../widgets/metric_card.dart';
import '../widgets/cash_flow_chart.dart';
import '../widgets/spending_donut_chart.dart';
import '../widgets/insight_card.dart';
import '../widgets/transaction_tile.dart';
import '../widgets/mode_toggle.dart';
import '../widgets/scenario_selector.dart';
import 'settings_screen.dart';

class HomeScreen extends StatelessWidget {
  final ValueChanged<int>? onNavigateTab;

  const HomeScreen({super.key, this.onNavigateTab});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CashFlowProvider>();
    final summary = provider.summary;
    final isBusiness = provider.isBusinessMode;
    final recentTransactions = provider.transactions.take(5).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 1,
        titleSpacing: 16,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text(
              'Good morning 👋',
              style: TextStyle(
                fontSize: 14,
                color: Color(0xFF64748B),
                fontWeight: FontWeight.w500,
              ),
            ),
            SizedBox(height: 2),
            Text(
              'Wema CashFlow',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: Color(0xFF7B0046),
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Reset Demo Data',
            icon: const Icon(Icons.refresh, color: Color(0xFF64748B)),
            onPressed: () {
              provider.resetDemo();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Demo state restored to baseline'),
                  duration: Duration(seconds: 2),
                ),
              );
            },
          ),
          IconButton(
            tooltip: 'Profile & Settings',
            icon: const CircleAvatar(
              radius: 15,
              backgroundColor: Color(0xFF7B0046),
              child: Text(
                'OA',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
              ),
            ),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (ctx) => const SettingsScreen()),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          provider.resetDemo();
        },
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          children: [
            // Mode and scenario bar
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: const [
                ModeToggleWidget(),
                ScenarioSelectorWidget(),
              ],
            ),
            const SizedBox(height: 16),

            // Greeting subtitle
            Text(
              isBusiness
                  ? 'Here is your enterprise cash runway and revenue performance.'
                  : 'Here\'s what\'s happening with your money.',
              style: const TextStyle(
                fontSize: 14,
                color: Color(0xFF475569),
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 14),

            // Financial KPI Cards Grid
            if (!isBusiness) ...[
              // Current Balance Hero Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF7B0046), Color(0xFF9E1B4C)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(18),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x207B0046),
                      blurRadius: 12,
                      offset: Offset(0, 4),
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
                          'TOTAL LIQUID BALANCE',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1.1,
                            color: Color(0xFFFCE7F3),
                          ),
                        ),
                        Icon(Icons.account_balance_wallet, color: Colors.white70, size: 20),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      FinancialEngine.formatCurrency(summary.currentBalance),
                      style: const TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.18),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Row(
                            children: const [
                              Icon(Icons.shield_outlined, color: Colors.white, size: 12),
                              SizedBox(width: 4),
                              Text(
                                'Wema Bank Verified',
                                style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              // Money In, Out, Net
              Row(
                children: [
                  Expanded(
                    child: FinancialMetricCard(
                      title: 'Money In',
                      amount: FinancialEngine.formatCurrency(summary.moneyIn),
                      trendText: '+${summary.moneyInTrendPercent}%',
                      isPositiveTrend: true,
                      icon: Icons.south_west_rounded,
                      iconColor: const Color(0xFF059669),
                      iconBgColor: const Color(0xFFD1FAE5),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: FinancialMetricCard(
                      title: 'Money Out',
                      amount: FinancialEngine.formatCurrency(summary.moneyOut),
                      trendText: '${summary.moneyOutTrendPercent}%',
                      isPositiveTrend: summary.moneyOutTrendPercent < 0,
                      icon: Icons.north_east_rounded,
                      iconColor: const Color(0xFFDC2626),
                      iconBgColor: const Color(0xFFFEE2E2),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              FinancialMetricCard(
                title: 'Net Cash Flow',
                amount: '+${FinancialEngine.formatCurrency(summary.netCashFlow)}',
                trendText: 'Positive retained liquidity margin',
                isPositiveTrend: true,
                icon: Icons.stacked_line_chart_rounded,
                iconColor: const Color(0xFF2563EB),
                iconBgColor: const Color(0xFFDBEAFE),
              ),
            ] else ...[
              // SME KPI Set
              Row(
                children: [
                  Expanded(
                    child: FinancialMetricCard(
                      title: 'Revenue',
                      amount: FinancialEngine.formatCurrency(summary.moneyIn),
                      trendText: '+${summary.moneyInTrendPercent}% this month',
                      isPositiveTrend: true,
                      icon: Icons.trending_up,
                      iconColor: const Color(0xFF059669),
                      iconBgColor: const Color(0xFFD1FAE5),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: FinancialMetricCard(
                      title: 'Operating Expenses',
                      amount: FinancialEngine.formatCurrency(summary.moneyOut),
                      trendText: '+${summary.moneyOutTrendPercent}% surge',
                      isPositiveTrend: false,
                      icon: Icons.receipt_long,
                      iconColor: const Color(0xFFDC2626),
                      iconBgColor: const Color(0xFFFEE2E2),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: FinancialMetricCard(
                      title: 'Net Cash Flow',
                      amount: FinancialEngine.formatCurrency(summary.netCashFlow),
                      trendText: 'Healthy operating surplus',
                      isPositiveTrend: true,
                      icon: Icons.savings_outlined,
                      iconColor: const Color(0xFF2563EB),
                      iconBgColor: const Color(0xFFDBEAFE),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: FinancialMetricCard(
                      title: 'Est. Cash Runway',
                      amount: '~${summary.runwayDays} Days',
                      trendText: 'Based on current burn rate',
                      isPositiveTrend: summary.runwayDays > 14,
                      icon: Icons.hourglass_top,
                      iconColor: const Color(0xFFD97706),
                      iconBgColor: const Color(0xFFFEF3C7),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              FinancialMetricCard(
                title: 'Outstanding Commitments',
                amount: FinancialEngine.formatCurrency(summary.outstandingCommitments),
                trendText: 'Pending invoices & payables',
                isPositiveTrend: false,
                icon: Icons.pending_actions,
                iconColor: const Color(0xFF64748B),
                iconBgColor: const Color(0xFFF1F5F9),
              ),
            ],

            const SizedBox(height: 20),

            // Cash Flow Trend Chart
            CashFlowChartWidget(points: summary.chartPoints),
            const SizedBox(height: 20),

            // Spending Breakdown Donut
            SpendingDonutChartWidget(
              breakdowns: summary.categoryBreakdowns,
              onCategorySelect: (cat) {
                if (onNavigateTab != null) {
                  onNavigateTab!(1); // Go to transactions tab
                }
              },
            ),
            const SizedBox(height: 20),

            // Key Insights Section Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Key Insights',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF0F172A),
                  ),
                ),
                TextButton(
                  onPressed: () {
                    if (onNavigateTab != null) onNavigateTab!(3);
                  },
                  child: const Text(
                    'See All Insights',
                    style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF7B0046)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Top 2 Insights cards
            ...provider.insights.take(2).map((ins) {
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

            const SizedBox(height: 16),

            // Recent Transactions Section Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Recent Transactions',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF0F172A),
                  ),
                ),
                TextButton(
                  onPressed: () {
                    if (onNavigateTab != null) onNavigateTab!(1);
                  },
                  child: const Text(
                    'View All',
                    style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF7B0046)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Transaction list
            ...recentTransactions.map((tx) => TransactionTile(transaction: tx)),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}
