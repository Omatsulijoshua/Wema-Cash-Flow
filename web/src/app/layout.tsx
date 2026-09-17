import type { Metadata } from 'next';
import './globals.css';
import { FinancialProvider } from '../context/FinancialContext';

export const metadata: Metadata = {
  title: 'Wema CashFlow — Banking Intelligence Platform',
  description: 'Turn your transactions into financial intelligence. Real-time cash flow, auto-categorization, balance forecasts, and AI insights.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#FAFAFA] text-slate-900 antialiased">
        <FinancialProvider>{children}</FinancialProvider>
      </body>
    </html>
  );
}
