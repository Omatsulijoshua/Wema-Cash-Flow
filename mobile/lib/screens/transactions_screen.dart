import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cash_flow_provider.dart';
import '../models/category_item.dart';
import '../models/transaction_item.dart';
import '../widgets/transaction_tile.dart';

class TransactionsScreen extends StatefulWidget {
  const TransactionsScreen({super.key});

  @override
  State<TransactionsScreen> createState() => _TransactionsScreenState();
}

class _TransactionsScreenState extends State<TransactionsScreen> {
  String _searchQuery = '';
  String _selectedCategory = 'All';
  String _selectedType = 'All'; // All, Credit, Debit

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CashFlowProvider>();
    final allTransactions = provider.transactions;

    final filtered = allTransactions.where((t) {
      final matchesSearch = _searchQuery.isEmpty ||
          t.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          t.description.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          t.reference.toLowerCase().contains(_searchQuery.toLowerCase());

      final matchesCat = _selectedCategory == 'All' ||
          t.category.toLowerCase() == _selectedCategory.toLowerCase();

      final matchesType = _selectedType == 'All' ||
          (_selectedType == 'Credit' && t.type == TransactionType.credit) ||
          (_selectedType == 'Debit' && t.type == TransactionType.debit);

      return matchesSearch && matchesCat && matchesType;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 1,
        title: const Text(
          'Transactions',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: Color(0xFF0F172A),
          ),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Center(
              child: Text(
                '${filtered.length} of ${allTransactions.length}',
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF475569),
                ),
              ),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Search & Filter header
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
            child: Column(
              children: [
                // Search field
                TextField(
                  onChanged: (val) => setState(() => _searchQuery = val),
                  decoration: InputDecoration(
                    hintText: 'Search merchant, reference, or note...',
                    hintStyle: const TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
                    prefixIcon: const Icon(Icons.search, color: Color(0xFF64748B), size: 20),
                    filled: true,
                    fillColor: const Color(0xFFF8FAFC),
                    isDense: true,
                    contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: Color(0xFF7B0046)),
                    ),
                  ),
                ),
                const SizedBox(height: 10),

                // Type switcher (All, Inflow, Outflow)
                Row(
                  children: [
                    _buildTypeChip('All'),
                    const SizedBox(width: 8),
                    _buildTypeChip('Credit', label: 'Money In'),
                    const SizedBox(width: 8),
                    _buildTypeChip('Debit', label: 'Money Out'),
                  ],
                ),
                const SizedBox(height: 8),

                // Category chips horizontal scroll
                SizedBox(
                  height: 32,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: [
                      _buildCategoryChip('All'),
                      ...CategoryDirectory.allCategories.map((c) => _buildCategoryChip(c.id, label: c.name)),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Transactions list
          Expanded(
            child: filtered.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Icon(Icons.receipt_long_outlined, size: 48, color: Color(0xFF94A3B8)),
                          SizedBox(height: 14),
                          Text(
                            'No transactions found',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Color(0xFF1E293B)),
                          ),
                          SizedBox(height: 6),
                          Text(
                            'Try adjusting your search query or filters to find what you are looking for.',
                            textAlign: TextAlign.center,
                            style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
                          ),
                        ],
                      ),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    itemCount: filtered.length,
                    itemBuilder: (ctx, idx) => TransactionTile(transaction: filtered[idx]),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildTypeChip(String type, {String? label}) {
    final isSelected = _selectedType == type;
    return GestureDetector(
      onTap: () => setState(() => _selectedType = type),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF7B0046) : const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(6),
        ),
        child: Text(
          label ?? type,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: isSelected ? Colors.white : const Color(0xFF475569),
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryChip(String catId, {String? label}) {
    final isSelected = _selectedCategory == catId;
    return GestureDetector(
      onTap: () => setState(() => _selectedCategory = catId),
      child: Container(
        margin: const EdgeInsets.only(right: 6),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? const Color(0xFF0F172A) : const Color(0xFFE2E8F0),
          ),
        ),
        child: Center(
          child: Text(
            label ?? catId,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: isSelected ? Colors.white : const Color(0xFF475569),
            ),
          ),
        ),
      ),
    );
  }
}
