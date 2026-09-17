import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:wema_cash_flow/main.dart';
import 'package:wema_cash_flow/providers/cash_flow_provider.dart';

void main() {
  testWidgets('WemaCashFlowApp smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (_) => CashFlowProvider(),
        child: const WemaCashFlowApp(),
      ),
    );

    // Pump a frame to verify initial render
    await tester.pump();
    expect(find.text('Wema CashFlow'), findsWidgets);
  });
}
