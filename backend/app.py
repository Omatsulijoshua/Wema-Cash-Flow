import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import uuid

app = Flask(__name__)
CORS(app)

transactions = []

CATEGORIES = {
    "income": ["salary", "client_payment", "loan_disbursement", "investment_return"],
    "expense": ["rent", "utilities", "salaries", "inventory", "marketing", "transport", "office_supplies", "software", "loan_repayment"]
}

CATEGORY_KEYWORDS = {
    "salary": ["salary", "wages", "payroll"],
    "client_payment": ["client", "invoice", "payment received", "transfer in"],
    "rent": ["rent", "lease", "landlord"],
    "utilities": ["electric", "water", "internet", "airtime", "data"],
    "salaries": ["staff", "employee", "worker"],
    "inventory": ["stock", "inventory", "supplies", "purchase"],
    "marketing": ["ads", "marketing", "promotion", "facebook ads", "google ads"],
    "transport": ["fuel", "uber", "transport", "logistics"],
    "loan_repayment": ["loan payment", "repayment", "credit"],
}


def categorize(description):
    desc = description.lower()
    for cat, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if kw in desc:
                return cat
    return "uncategorized"


@app.route("/")
def index():
    return jsonify({"message": "CashFlow API is running", "status": "success"})


@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "service": "cashflow-api"})


@app.route("/api/test")
def test():
    return jsonify({"message": "Flutter to Flask connection successful", "backend": "Flask", "status": "success"})


@app.route("/api/transactions", methods=["GET"])
def get_transactions():
    return jsonify(transactions)


@app.route("/api/transactions", methods=["POST"])
def add_transaction():
    data = request.get_json()
    tx = {
        "id": str(uuid.uuid4()),
        "date": data.get("date", datetime.now().strftime("%Y-%m-%d")),
        "description": data["description"],
        "amount": data["amount"],
        "type": data["type"],
        "category": categorize(data["description"]),
    }
    transactions.append(tx)
    return jsonify(tx), 201


@app.route("/api/transactions/simulate", methods=["POST"])
def simulate_transactions():
    global transactions
    transactions = []
    now = datetime.now()
    sample = [
        ("Client Payment - Inv001", 450000, "income"),
        ("Client Payment - Inv002", 230000, "income"),
        ("Salary Payment - July", -85000, "expense"),
        ("Rent - Office Q3", -120000, "expense"),
        ("Electricity Bill", -15000, "expense"),
        ("Internet Subscription", -8500, "expense"),
        ("Facebook Ads Campaign", -25000, "expense"),
        ("Inventory Restock", -180000, "expense"),
        ("Fuel - Delivery Van", -12000, "expense"),
        ("Client Payment - Inv003", 370000, "income"),
        ("Staff Wages - Two Staff", -60000, "expense"),
        ("Software Subscription", -20000, "expense"),
        ("Client Payment - Inv004", 150000, "income"),
        ("Water Bill", -5000, "expense"),
        ("Transport - Logistics", -18000, "expense"),
        ("Loan Repayment", -45000, "expense"),
        ("Client Payment - Inv005", 520000, "income"),
        ("Office Supplies", -9000, "expense"),
        ("Airtime & Data", -6000, "expense"),
        ("Staff Wages - Two Staff", -60000, "expense"),
    ]
    for i, (desc, amt, typ) in enumerate(sample):
        tx = {
            "id": str(uuid.uuid4()),
            "date": (now - timedelta(days=30 - i)).strftime("%Y-%m-%d"),
            "description": desc,
            "amount": amt,
            "type": typ,
            "category": categorize(desc),
        }
        transactions.append(tx)
    return jsonify({"count": len(transactions), "message": "Simulated 20 transactions"})


@app.route("/api/insights", methods=["GET"])
def get_insights():
    if not transactions:
        return jsonify({"error": "No transactions available. Simulate or add transactions first."}), 400

    income_total = sum(t["amount"] for t in transactions if t["amount"] > 0)
    expense_total = sum(t["amount"] for t in transactions if t["amount"] < 0)
    net = income_total + expense_total

    category_totals = {}
    for t in transactions:
        if t["amount"] < 0:
            cat = t["category"]
            category_totals[cat] = category_totals.get(cat, 0) + abs(t["amount"])

    top_expense_cat = max(category_totals, key=category_totals.get) if category_totals else "N/A"

    avg_daily_burn = abs(expense_total) / 30
    days_until_zero = net / avg_daily_burn if avg_daily_burn > 0 else float("inf")

    alerts = []
    if net < 0:
        alerts.append("Your expenses exceed income this period.")
    if avg_daily_burn > income_total / 30:
        alerts.append("Your daily spend is higher than your daily income.")
    if days_until_zero < 30:
        alerts.append(f"Based on current spending, funds may run low within {int(days_until_zero)} days.")
    if category_totals.get("loan_repayment", 0) > income_total * 0.2:
        alerts.append("Loan repayments are consuming over 20% of your income.")

    return jsonify({
        "total_income": income_total,
        "total_expenses": abs(expense_total),
        "net_cash_flow": net,
        "avg_daily_burn": round(avg_daily_burn, 2),
        "days_until_low_funds": int(days_until_zero) if days_until_zero != float("inf") else "N/A",
        "category_breakdown": category_totals,
        "top_expense_category": top_expense_cat,
        "alerts": alerts,
    })


@app.route("/api/categories", methods=["GET"])
def get_categories():
    return jsonify(CATEGORIES)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
