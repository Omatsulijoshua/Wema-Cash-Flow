export interface CategorizationResult {
  category: string;
  confidence: number;
}

export class CategorizationEngine {
  private static rules: Record<string, string[]> = {
    Salary: ['salary', 'payroll', 'wema monthly', 'staff wage', 'allowance'],
    'Business Revenue': ['client payment', 'retainer', 'invoice', 'milestone', 'revenue', 'consultancy', 'settlement'],
    Transport: ['uber', 'bolt', 'taxify', 'fuel', 'nnpc', 'oando', 'total', 'toll', 'danfo', 'brt'],
    Food: ['kfc', 'chowdeck', 'restaurant', 'foodcourt', 'bukka', 'chicken', 'dominos', 'coldstone', 'pizza', 'mr biggs'],
    Shopping: ['shoprite', 'spar', 'jumia', 'konga', 'supermarket', 'mall', 'slot', 'hubmart', 'market'],
    Utilities: ['electricity', 'ekedc', 'ikedc', 'phcn', 'water', 'waste', 'lawma', 'fibre', 'swift', 'dstv', 'gotv'],
    Rent: ['rent', 'landlord', 'estate management', 'housing', 'service charge', 'tenancy'],
    Airtime: ['airtime', 'vtu', 'recharge', 'glo topup', '9mobile'],
    Data: ['data', 'broadband', 'mifi', 'spectranet', 'smile 4g', 'gigabyte'],
    Subscription: ['netflix', 'spotify', 'apple music', 'canva', 'github', 'prime video', 'youtube premium'],
    Supplier: ['supplier', 'raw materials', 'wholesaler', 'inventory', 'procurement', 'vendor payout'],
    Salaries: ['payroll batch', 'staff salary', 'bonus pay'],
    Logistics: ['logistics', 'delivery', 'dispatch', 'haulage', 'freight', 'courier', 'dhl', 'fedex', 'gig logistics'],
    'Bank Charges': ['stamp duty', 'sms alert', 'maintenance fee', 'nip charge', 'vat on web', 'cbn levy'],
    ATM: ['atm cash', 'atm withdrawal', 'quickteller atm'],
    POS: ['pos terminal', 'merchant pos', 'card purchase pos'],
    Transfer: ['transfer to', 'trf to', 'nip transfer', 'direct debit', 'wire'],
  };

  static categorize(description: string): CategorizationResult {
    const clean = description.toLowerCase();

    for (const [category, keywords] of Object.entries(this.rules)) {
      for (const keyword of keywords) {
        if (clean.includes(keyword)) {
          const confidence = Math.min(0.99, +(0.93 + keyword.length * 0.006).toFixed(2));
          return { category, confidence };
        }
      }
    }

    return { category: 'Other', confidence: 0.65 };
  }
}
