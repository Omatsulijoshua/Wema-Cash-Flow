import '../models/transaction_item.dart';
import '../models/recurring_payment.dart';
import '../models/import_batch.dart';

class MockData {
  static List<TransactionItem> generateTransactions() {
    final List<TransactionItem> list = [
      // September 2026 (Current Month)
      TransactionItem(
        id: 'tx-201',
        title: 'Client Payment - Dev Retainer',
        description: 'Inflow from TechCorp Solutions via NIBSS instant transfer',
        amount: 250000.0,
        type: TransactionType.credit,
        category: 'Business Revenue',
        categoryConfidence: 0.99,
        date: DateTime(2026, 9, 16, 14, 30),
        reference: 'WMA-NIBSS-992140',
        balanceAfter: 428500.0,
        paymentChannel: 'TRANSFER',
      ),
      TransactionItem(
        id: 'tx-202',
        title: 'Uber Nigeria',
        description: 'UBER TRIP *VI to Ikeja Mainland',
        amount: 8500.0,
        type: TransactionType.debit,
        category: 'Transport',
        categoryConfidence: 0.98,
        date: DateTime(2026, 9, 15, 18, 45),
        reference: 'WMA-CARD-881293',
        balanceAfter: 178500.0,
        paymentChannel: 'POS',
      ),
      TransactionItem(
        id: 'tx-203',
        title: 'Shoprite Palms Lekki',
        description: 'POS Purchase SHOPRITE RETAIL LEKKI',
        amount: 45200.0,
        type: TransactionType.debit,
        category: 'Shopping',
        categoryConfidence: 0.97,
        date: DateTime(2026, 9, 14, 16, 20),
        reference: 'POS-SHPR-441209',
        balanceAfter: 187000.0,
        paymentChannel: 'POS',
      ),
      TransactionItem(
        id: 'tx-204',
        title: 'FoodCourt Victoria Island',
        description: 'Lunch platter & refreshments',
        amount: 12400.0,
        type: TransactionType.debit,
        category: 'Food',
        categoryConfidence: 0.96,
        date: DateTime(2026, 9, 14, 13, 10),
        reference: 'POS-FCVI-112094',
        balanceAfter: 232200.0,
        paymentChannel: 'POS',
      ),
      TransactionItem(
        id: 'tx-205',
        title: 'MTN Broadband Data 50GB',
        description: 'MTN VTU Web Topup data bundle',
        amount: 10000.0,
        type: TransactionType.debit,
        category: 'Data',
        categoryConfidence: 0.99,
        date: DateTime(2026, 9, 13, 9, 15),
        reference: 'VTU-MTN-994321',
        balanceAfter: 244600.0,
        paymentChannel: 'WEB',
      ),
      TransactionItem(
        id: 'tx-206',
        title: 'Chowdeck Delivery',
        description: 'CHOWDECK *Burgers & Grills Marina',
        amount: 8200.0,
        type: TransactionType.debit,
        category: 'Food',
        categoryConfidence: 0.95,
        date: DateTime(2026, 9, 12, 20, 05),
        reference: 'CHW-WEB-773402',
        balanceAfter: 254600.0,
        paymentChannel: 'WEB',
      ),
      TransactionItem(
        id: 'tx-207',
        title: 'Eko Electricity (EKEDC)',
        description: 'Prepaid Meter Token 04291884392',
        amount: 35000.0,
        type: TransactionType.debit,
        category: 'Utilities',
        categoryConfidence: 0.99,
        date: DateTime(2026, 9, 10, 11, 40),
        reference: 'EKEDC-BIL-553109',
        balanceAfter: 262800.0,
        paymentChannel: 'WEB',
      ),
      TransactionItem(
        id: 'tx-208',
        title: 'Spar Victoria Island',
        description: 'SPAR GROCERY STORE VI LAGOS',
        amount: 28500.0,
        type: TransactionType.debit,
        category: 'Shopping',
        categoryConfidence: 0.96,
        date: DateTime(2026, 9, 8, 17, 30),
        reference: 'POS-SPAR-339281',
        balanceAfter: 297800.0,
        paymentChannel: 'POS',
      ),
      TransactionItem(
        id: 'tx-209',
        title: 'Bolt Ride Ikoyi',
        description: 'Taxify / Bolt ride to Admiralty',
        amount: 5400.0,
        type: TransactionType.debit,
        category: 'Transport',
        categoryConfidence: 0.98,
        date: DateTime(2026, 9, 5, 21, 15),
        reference: 'BLT-APP-229103',
        balanceAfter: 326300.0,
        paymentChannel: 'POS',
      ),
      TransactionItem(
        id: 'tx-210',
        title: 'Netflix Standard Plan',
        description: 'NETFLIX.COM MONTHLY SUBSCRIPTION',
        amount: 5000.0,
        type: TransactionType.debit,
        category: 'Subscription',
        categoryConfidence: 0.99,
        date: DateTime(2026, 9, 4, 3, 00),
        reference: 'NFLX-REC-001923',
        balanceAfter: 331700.0,
        paymentChannel: 'WEB',
      ),
      TransactionItem(
        id: 'tx-211',
        title: 'Swift 4G Fibre Internet',
        description: 'Swift Networks Monthly Unlimited',
        amount: 20000.0,
        type: TransactionType.debit,
        category: 'Utilities',
        categoryConfidence: 0.97,
        date: DateTime(2026, 9, 3, 10, 00),
        reference: 'SWF-REC-773194',
        balanceAfter: 336700.0,
        paymentChannel: 'WEB',
      ),
      TransactionItem(
        id: 'tx-212',
        title: 'Consultancy Retainer Fee',
        description: 'Direct credit from Apex Holdings Ltd',
        amount: 740000.0,
        type: TransactionType.credit,
        category: 'Business Revenue',
        categoryConfidence: 0.98,
        date: DateTime(2026, 9, 2, 11, 20),
        reference: 'NIBSS-APX-883100',
        balanceAfter: 356700.0,
        paymentChannel: 'TRANSFER',
      ),
      TransactionItem(
        id: 'tx-213',
        title: 'Monthly Residential Rent',
        description: 'TRANSFER TO ESTATE MANAGEMENT RENT',
        amount: 150000.0,
        type: TransactionType.debit,
        category: 'Rent',
        categoryConfidence: 0.99,
        date: DateTime(2026, 9, 1, 9, 00),
        reference: 'TRF-EST-110293',
        balanceAfter: -383300.0 + 740000,
        paymentChannel: 'TRANSFER',
      ),
      TransactionItem(
        id: 'tx-214',
        title: 'Salary Credit - Tech Lead',
        description: 'MONTHLY SALARY DISBURSEMENT ALAT WEMA',
        amount: 850000.0,
        type: TransactionType.credit,
        category: 'Salary',
        categoryConfidence: 0.99,
        date: DateTime(2026, 8, 28, 8, 30),
        reference: 'SAL-WEMA-009214',
        balanceAfter: 533300.0,
        paymentChannel: 'TRANSFER',
      ),
      TransactionItem(
        id: 'tx-215',
        title: 'Total Energies Fuel',
        description: 'TOTAL ENERGIES ADMIRALTY LEKKI POS',
        amount: 32000.0,
        type: TransactionType.debit,
        category: 'Transport',
        categoryConfidence: 0.96,
        date: DateTime(2026, 9, 7, 8, 40),
        reference: 'POS-TOT-772914',
        balanceAfter: 358300.0,
        paymentChannel: 'POS',
      ),
      TransactionItem(
        id: 'tx-216',
        title: 'Cowrywise Savings Debit',
        description: 'COWRYWISE EMERGENCY VAULT DEPOSIT',
        amount: 50000.0,
        type: TransactionType.debit,
        category: 'Other',
        categoryConfidence: 0.94,
        date: DateTime(2026, 9, 5, 6, 00),
        reference: 'CW-SAV-449102',
        balanceAfter: 390300.0,
        paymentChannel: 'WEB',
      ),
      TransactionItem(
        id: 'tx-217',
        title: 'Airtel Airtime Recharge',
        description: 'AIRTEL VTU RECHARGE VIA ALAT',
        amount: 5000.0,
        type: TransactionType.debit,
        category: 'Airtime',
        categoryConfidence: 0.99,
        date: DateTime(2026, 9, 9, 12, 10),
        reference: 'VTU-AIR-229103',
        balanceAfter: 440300.0,
        paymentChannel: 'USSD',
      ),
      TransactionItem(
        id: 'tx-218',
        title: 'ATM Cash Withdrawal Wema Marina',
        description: 'ATM CASH WEMA BANK BROAD ST BRANCH',
        amount: 20000.0,
        type: TransactionType.debit,
        category: 'ATM',
        categoryConfidence: 0.99,
        date: DateTime(2026, 9, 11, 15, 20),
        reference: 'ATM-WEM-551029',
        balanceAfter: 445300.0,
        paymentChannel: 'ATM',
      ),
      TransactionItem(
        id: 'tx-219',
        title: 'NIP Electronic Stamp Duty & Charges',
        description: 'CBN MANDATORY ELECTRONIC MONEY LEVY',
        amount: 350.0,
        type: TransactionType.debit,
        category: 'Bank Charges',
        categoryConfidence: 0.99,
        date: DateTime(2026, 9, 16, 23, 59),
        reference: 'FEE-CBN-001923',
        balanceAfter: 428150.0,
        paymentChannel: 'TRANSFER',
      ),
      TransactionItem(
        id: 'tx-220',
        title: 'Amazon Web Services (AWS)',
        description: 'AWS EMEA CLOUD HOSTING SERVICES',
        amount: 62400.0,
        type: TransactionType.debit,
        category: 'Business Revenue', // Business expense
        categoryConfidence: 0.92,
        date: DateTime(2026, 9, 6, 4, 15),
        reference: 'AWS-REC-661029',
        balanceAfter: 465650.0,
        paymentChannel: 'WEB',
      ),
    ];

    // Seed additional transactions across past 6 months to reach ~220 transactions
    final categories = [
      'Food', 'Transport', 'Shopping', 'Utilities', 'Business Revenue',
      'Airtime', 'Data', 'Subscription', 'Bank Charges', 'Transfer'
    ];

    final descriptions = {
      'Food': ['KFC Mega Chicken', 'The Place Restaurant', 'Bukka Hut Lekki', 'Item7 Dodo Rice', 'Dominos Pizza & ColdStone'],
      'Transport': ['Uber Trip Ride', 'Bolt Tech Ride', 'NNPC Fuel Station', 'Oando Mega Station V.I.', 'Lekki Concession Tollway'],
      'Shopping': ['Shoprite Ikeja Mall', 'Spar Supermarket Ilupeju', 'Jumia Online Store', 'Slot Systems Computer Village', 'Hubmart Stores VI'],
      'Utilities': ['IKEDC Prepaid Token', 'EKEDC Bill Payment', 'Lagos Water Corp', 'Waste Management LAWMA', 'DSTV Premium HD'],
      'Business Revenue': ['Freelance UI/UX Milestone', 'Direct Client Retainer', 'AdSense Payout Google', 'Sub-contract Web Build', 'Consulting Advisory'],
      'Airtime': ['MTN VTU ₦2,000 Topup', 'Airtel Instant Topup', 'Glo 4G Recharge', '9mobile Airtime Recharge'],
      'Data': ['MTN 30-Day Broadband', 'Airtel 40GB Monthly', 'Spectranet LTE Mifi', 'Smile 4G Topup'],
      'Subscription': ['Spotify Premium Individual', 'Apple Music Family Plan', 'Canva Pro Annual', 'GitHub Copilot Monthly'],
      'Bank Charges': ['SMS Alert Charge Wema', 'Card Maintenance Levy', 'NIP Transfer Fee ₦10', 'VAT On Web Service'],
      'Transfer': ['Transfer to Mum (Family)', 'Transfer to Sola Friend', 'Transfer to Ade Colleague', 'Emergency Fund Stash']
    };

    int idCounter = 1;
    for (int month = 4; month <= 8; month++) {
      // Inflow for each month
      list.add(TransactionItem(
        id: 'tx-gen-${idCounter++}',
        title: 'Salary Credit - Tech Lead',
        description: 'MONTHLY SALARY DISBURSEMENT ALAT WEMA',
        amount: 850000.0,
        type: TransactionType.credit,
        category: 'Salary',
        categoryConfidence: 0.99,
        date: DateTime(2026, month, 27, 9, 0),
        reference: 'SAL-GEN-$month-$idCounter',
        balanceAfter: 500000.0 + (month * 15000),
        paymentChannel: 'TRANSFER',
      ));

      list.add(TransactionItem(
        id: 'tx-gen-${idCounter++}',
        title: 'Client Milestone Retainer',
        description: 'Project Inflow via NIBSS Settlement',
        amount: month == 7 ? 950000.0 : 750000.0,
        type: TransactionType.credit,
        category: 'Business Revenue',
        categoryConfidence: 0.98,
        date: DateTime(2026, month, 12, 14, 0),
        reference: 'REV-GEN-$month-$idCounter',
        balanceAfter: 720000.0 + (month * 20000),
        paymentChannel: 'TRANSFER',
      ));

      // Monthly Rent
      list.add(TransactionItem(
        id: 'tx-gen-${idCounter++}',
        title: 'Monthly Residential Rent',
        description: 'TRANSFER TO ESTATE MANAGEMENT RENT',
        amount: 150000.0,
        type: TransactionType.debit,
        category: 'Rent',
        categoryConfidence: 0.99,
        date: DateTime(2026, month, 1, 9, 30),
        reference: 'RNT-GEN-$month-$idCounter',
        balanceAfter: 450000.0,
        paymentChannel: 'TRANSFER',
      ));

      // Recurring Subscriptions
      list.add(TransactionItem(
        id: 'tx-gen-${idCounter++}',
        title: 'Netflix Standard Plan',
        description: 'NETFLIX.COM MONTHLY SUBSCRIPTION',
        amount: 5000.0,
        type: TransactionType.debit,
        category: 'Subscription',
        categoryConfidence: 0.99,
        date: DateTime(2026, month, 4, 3, 0),
        reference: 'NFLX-GEN-$month-$idCounter',
        balanceAfter: 445000.0,
        paymentChannel: 'WEB',
      ));

      list.add(TransactionItem(
        id: 'tx-gen-${idCounter++}',
        title: 'Swift 4G Fibre Internet',
        description: 'Swift Networks Monthly Unlimited',
        amount: 20000.0,
        type: TransactionType.debit,
        category: 'Utilities',
        categoryConfidence: 0.97,
        date: DateTime(2026, month, 3, 10, 0),
        reference: 'SWF-GEN-$month-$idCounter',
        balanceAfter: 425000.0,
        paymentChannel: 'WEB',
      ));

      // Diverse daily debits for realistic density
      for (int day = 2; day <= 28; day += 2) {
        final cat = categories[day % categories.length];
        final titles = descriptions[cat] ?? ['General Expense'];
        final title = titles[day % titles.length];
        double amt = 2500.0 + ((day * 730) % 38000);

        // Adjust transport higher in month 5, food higher in month 8
        if (month == 5 && cat == 'Transport') amt *= 1.4;
        if (month == 8 && cat == 'Food') amt *= 1.35;

        list.add(TransactionItem(
          id: 'tx-gen-${idCounter++}',
          title: title,
          description: '$title POS/WEB TXN REF #$idCounter',
          amount: amt,
          type: TransactionType.debit,
          category: cat,
          categoryConfidence: 0.91 + ((day % 8) * 0.01),
          date: DateTime(2026, month, day, 10 + (day % 10), (day * 13) % 60),
          reference: 'TXN-$month$day-$idCounter',
          balanceAfter: 350000.0 + ((day * 3200) % 150000),
          paymentChannel: (day % 3 == 0) ? 'POS' : (day % 3 == 1 ? 'WEB' : 'TRANSFER'),
        ));
      }
    }

    // Sort descending by date
    list.sort((a, b) => b.date.compareTo(a.date));
    return list;
  }

  static List<RecurringPayment> getRecurringPayments() {
    return [
      RecurringPayment(
        id: 'rec-1',
        title: 'Estate Landlord Rent',
        category: 'Rent',
        amount: 150000.0,
        frequency: 'Monthly',
        nextDueDate: DateTime(2026, 10, 1),
        status: RecurringStatus.upcoming,
        provider: 'Victoria Crest Management',
        channel: 'TRANSFER',
      ),
      RecurringPayment(
        id: 'rec-2',
        title: 'Swift Fibre Internet',
        category: 'Utilities',
        amount: 20000.0,
        frequency: 'Monthly',
        nextDueDate: DateTime(2026, 9, 25),
        status: RecurringStatus.upcoming,
        provider: 'Swift Networks Ltd',
        channel: 'WEB',
      ),
      RecurringPayment(
        id: 'rec-3',
        title: 'Netflix Premium 4K',
        category: 'Subscription',
        amount: 5000.0,
        frequency: 'Monthly',
        nextDueDate: DateTime(2026, 9, 28),
        status: RecurringStatus.upcoming,
        provider: 'Netflix Services',
        channel: 'WEB',
      ),
      RecurringPayment(
        id: 'rec-4',
        title: 'Spotify Family Subscription',
        category: 'Subscription',
        amount: 2200.0,
        frequency: 'Monthly',
        nextDueDate: DateTime(2026, 10, 5),
        status: RecurringStatus.active,
        provider: 'Spotify AB',
        channel: 'WEB',
      ),
      RecurringPayment(
        id: 'rec-5',
        title: 'DSTV Compact Plus',
        category: 'Utilities',
        amount: 19800.0,
        frequency: 'Monthly',
        nextDueDate: DateTime(2026, 10, 8),
        status: RecurringStatus.active,
        provider: 'MultiChoice Nigeria',
        channel: 'WEB',
      ),
      RecurringPayment(
        id: 'rec-6',
        title: 'Cowrywise Automated Savings',
        category: 'Other',
        amount: 50000.0,
        frequency: 'Monthly',
        nextDueDate: DateTime(2026, 10, 5),
        status: RecurringStatus.active,
        provider: 'Cowrywise FinTech',
        channel: 'DIRECT DEBIT',
      ),
    ];
  }

  static List<ImportBatch> getImportHistory() {
    return [
      ImportBatch(
        id: 'imp-003',
        date: DateTime(2026, 9, 17, 10, 24),
        fileCount: 12,
        totalDetected: 287,
        uniqueCount: 274,
        duplicateCount: 13,
        reviewNeededCount: 6,
        status: 'Completed',
      ),
      ImportBatch(
        id: 'imp-002',
        date: DateTime(2026, 8, 15, 14, 10),
        fileCount: 8,
        totalDetected: 184,
        uniqueCount: 180,
        duplicateCount: 4,
        reviewNeededCount: 2,
        status: 'Completed',
      ),
      ImportBatch(
        id: 'imp-001',
        date: DateTime(2026, 7, 02, 11, 45),
        fileCount: 5,
        totalDetected: 112,
        uniqueCount: 110,
        duplicateCount: 2,
        reviewNeededCount: 1,
        status: 'Completed',
      ),
    ];
  }
}
