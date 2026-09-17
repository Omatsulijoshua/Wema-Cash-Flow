import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'providers/cash_flow_provider.dart';
import 'screens/home_screen.dart';
import 'screens/transactions_screen.dart';
import 'screens/cash_flow_screen.dart';
import 'screens/insights_screen.dart';
import 'screens/ask_wema_screen.dart';
import 'screens/import_screen.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => CashFlowProvider(),
      child: const WemaCashFlowApp(),
    ),
  );
}

class WemaCashFlowApp extends StatelessWidget {
  const WemaCashFlowApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Wema CashFlow',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF7B0046),
          primary: const Color(0xFF7B0046),
          secondary: const Color(0xFF059669),
          surface: Colors.white,
          error: const Color(0xFFDC2626),
        ),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(
          Theme.of(context).textTheme,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Color(0xFF0F172A),
          elevation: 0,
        ),
      ),
      home: const MainAppShell(),
    );
  }
}

class MainAppShell extends StatefulWidget {
  const MainAppShell({super.key});

  @override
  State<MainAppShell> createState() => _MainAppShellState();
}

class _MainAppShellState extends State<MainAppShell> {
  int _currentIndex = 0;
  bool _hasSeenOnboarding = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_hasSeenOnboarding) {
        _showOnboardingDialog();
      }
    });
  }

  void _showOnboardingDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => _OnboardingDialog(
        onDismiss: () {
          setState(() => _hasSeenOnboarding = true);
          Navigator.pop(ctx);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      HomeScreen(onNavigateTab: (idx) => setState(() => _currentIndex = idx)),
      const TransactionsScreen(),
      const CashFlowScreen(),
      InsightsScreen(onNavigateTab: (idx) => setState(() => _currentIndex = idx)),
      const AskWemaScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: const Color(0xFF7B0046),
        foregroundColor: Colors.white,
        elevation: 3,
        icon: const Icon(Icons.document_scanner_outlined, size: 20),
        label: const Text('Import', style: TextStyle(fontWeight: FontWeight.w700)),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (ctx) => const ImportScreen()),
          );
        },
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        backgroundColor: Colors.white,
        indicatorColor: const Color(0xFFFCE7F3),
        elevation: 2,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard, color: Color(0xFF7B0046)),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.receipt_long_outlined),
            selectedIcon: Icon(Icons.receipt_long, color: Color(0xFF7B0046)),
            label: 'Transactions',
          ),
          NavigationDestination(
            icon: Icon(Icons.auto_graph_outlined),
            selectedIcon: Icon(Icons.auto_graph, color: Color(0xFF7B0046)),
            label: 'Cash Flow',
          ),
          NavigationDestination(
            icon: Icon(Icons.insights_outlined),
            selectedIcon: Icon(Icons.insights, color: Color(0xFF7B0046)),
            label: 'Insights',
          ),
          NavigationDestination(
            icon: Icon(Icons.chat_bubble_outline),
            selectedIcon: Icon(Icons.chat_bubble, color: Color(0xFF7B0046)),
            label: 'Ask Wema',
          ),
        ],
      ),
    );
  }
}

class _OnboardingDialog extends StatefulWidget {
  final VoidCallback onDismiss;

  const _OnboardingDialog({required this.onDismiss});

  @override
  State<_OnboardingDialog> createState() => _OnboardingDialogState();
}

class _OnboardingDialogState extends State<_OnboardingDialog> {
  int _page = 0;
  final PageController _controller = PageController();

  final List<Map<String, dynamic>> _screens = [
    {
      'icon': Icons.account_balance_wallet_outlined,
      'title': 'Understand your money better.',
      'subtitle': 'Wema CashFlow turns your transaction history into simple, useful financial insights.',
    },
    {
      'icon': Icons.upload_file_outlined,
      'title': 'Import your transactions.',
      'subtitle': 'Support for Screenshots, Statements, PDF, CSV and Excel with automatic duplicate removal.',
    },
    {
      'icon': Icons.auto_awesome,
      'title': 'Get intelligent insights.',
      'subtitle': 'Stay ahead of spending surges, predict cash runway, and track upcoming recurring payments.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      backgroundColor: Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              height: 230,
              child: PageView.builder(
                controller: _controller,
                itemCount: _screens.length,
                onPageChanged: (i) => setState(() => _page = i),
                itemBuilder: (ctx, idx) {
                  final item = _screens[idx];
                  return Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 64,
                        height: 64,
                        decoration: const BoxDecoration(
                          color: Color(0xFFFCE7F3),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(item['icon'] as IconData, color: const Color(0xFF7B0046), size: 32),
                      ),
                      const SizedBox(height: 18),
                      Text(
                        item['title'] as String,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        item['subtitle'] as String,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 13,
                          height: 1.4,
                          color: Color(0xFF64748B),
                        ),
                      ),
                    ],
                  );
                },
              ),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(_screens.length, (idx) {
                return Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: _page == idx ? 20 : 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: _page == idx ? const Color(0xFF7B0046) : const Color(0xFFE2E8F0),
                    borderRadius: BorderRadius.circular(3),
                  ),
                );
              }),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 46,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF7B0046),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {
                  if (_page < _screens.length - 1) {
                    _controller.nextPage(
                      duration: const Duration(milliseconds: 250),
                      curve: Curves.easeInOut,
                    );
                  } else {
                    widget.onDismiss();
                  }
                },
                child: Text(
                  _page == _screens.length - 1 ? 'Explore Demo' : 'Next',
                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                ),
              ),
            ),
            const SizedBox(height: 10),
            TextButton(
              onPressed: widget.onDismiss,
              child: const Text(
                'Continue with Demo Account',
                style: TextStyle(color: Color(0xFF64748B), fontSize: 12, fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
