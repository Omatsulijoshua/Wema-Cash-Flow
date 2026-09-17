import 'package:flutter/material.dart';

class CategoryItem {
  final String id;
  final String name;
  final IconData icon;
  final Color color;
  final bool isBusiness;

  const CategoryItem({
    required this.id,
    required this.name,
    required this.icon,
    required this.color,
    this.isBusiness = false,
  });
}

class CategoryDirectory {
  static const List<CategoryItem> allCategories = [
    CategoryItem(
      id: 'Salary',
      name: 'Salary',
      icon: Icons.payments_outlined,
      color: Color(0xFF059669),
    ),
    CategoryItem(
      id: 'Business Revenue',
      name: 'Business Revenue',
      icon: Icons.storefront_outlined,
      color: Color(0xFF0D9488),
      isBusiness: true,
    ),
    CategoryItem(
      id: 'Transport',
      name: 'Transport',
      icon: Icons.directions_car_outlined,
      color: Color(0xFF2563EB),
    ),
    CategoryItem(
      id: 'Food',
      name: 'Food & Dining',
      icon: Icons.restaurant_outlined,
      color: Color(0xFFEA580C),
    ),
    CategoryItem(
      id: 'Shopping',
      name: 'Shopping',
      icon: Icons.shopping_bag_outlined,
      color: Color(0xFF9333EA),
    ),
    CategoryItem(
      id: 'Utilities',
      name: 'Utilities & Bills',
      icon: Icons.bolt_outlined,
      color: Color(0xFFD97706),
    ),
    CategoryItem(
      id: 'Rent',
      name: 'Rent & Housing',
      icon: Icons.home_outlined,
      color: Color(0xFFDC2626),
    ),
    CategoryItem(
      id: 'Airtime',
      name: 'Airtime & Recharge',
      icon: Icons.phone_android_outlined,
      color: Color(0xFF0891B2),
    ),
    CategoryItem(
      id: 'Data',
      name: 'Internet & Data',
      icon: Icons.wifi_outlined,
      color: Color(0xFF0284C7),
    ),
    CategoryItem(
      id: 'Subscription',
      name: 'Subscriptions',
      icon: Icons.subscriptions_outlined,
      color: Color(0xFF7C3AED),
    ),
    CategoryItem(
      id: 'Supplier',
      name: 'Supplier Payments',
      icon: Icons.inventory_2_outlined,
      color: Color(0xFFB45309),
      isBusiness: true,
    ),
    CategoryItem(
      id: 'Salaries',
      name: 'Payroll & Salaries',
      icon: Icons.badge_outlined,
      color: Color(0xFF059669),
      isBusiness: true,
    ),
    CategoryItem(
      id: 'Logistics',
      name: 'Logistics & Delivery',
      icon: Icons.local_shipping_outlined,
      color: Color(0xFF4F46E5),
      isBusiness: true,
    ),
    CategoryItem(
      id: 'Loan',
      name: 'Loan & Repayments',
      icon: Icons.account_balance_outlined,
      color: Color(0xFF475569),
    ),
    CategoryItem(
      id: 'Bank Charges',
      name: 'Bank Charges & Fees',
      icon: Icons.receipt_long_outlined,
      color: Color(0xFF64748B),
    ),
    CategoryItem(
      id: 'Transfer',
      name: 'Transfers',
      icon: Icons.swap_horiz_outlined,
      color: Color(0xFF3B82F6),
    ),
    CategoryItem(
      id: 'ATM',
      name: 'ATM Cash Withdrawal',
      icon: Icons.local_atm_outlined,
      color: Color(0xFF0D9488),
    ),
    CategoryItem(
      id: 'POS',
      name: 'POS Terminal',
      icon: Icons.point_of_sale_outlined,
      color: Color(0xFF16A34A),
    ),
    CategoryItem(
      id: 'Marketing',
      name: 'Marketing & Ads',
      icon: Icons.campaign_outlined,
      color: Color(0xFFE11D48),
      isBusiness: true,
    ),
    CategoryItem(
      id: 'Other',
      name: 'Other',
      icon: Icons.more_horiz_outlined,
      color: Color(0xFF94A3B8),
    ),
  ];

  static CategoryItem getCategory(String id) {
    return allCategories.firstWhere(
      (c) => c.id.toLowerCase() == id.toLowerCase(),
      orElse: () => const CategoryItem(
        id: 'Other',
        name: 'Other',
        icon: Icons.more_horiz_outlined,
        color: Color(0xFF94A3B8),
      ),
    );
  }
}
