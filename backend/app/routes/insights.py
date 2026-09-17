from flask import Blueprint, request

from app.middleware.auth import require_auth
from app.extensions import supabase
from app.utils.response import success_response, error_response

insights_bp = Blueprint("insights", __name__)


@insights_bp.route("/insights", methods=["GET"])
@require_auth
def get_insights():
    user_id = request.user_id

    try:
        result = supabase.client.table("transactions").select("*").eq("user_id", user_id).order("date").execute()
        transactions = result.data

        if not transactions:
            return success_response({
                "insights": [],
                "message": "No transactions found. Import data to receive insights.",
            })

        total_income = sum(t["amount"] for t in transactions if t["type"] == "income")
        total_expenses = sum(t["amount"] for t in transactions if t["type"] == "expense")
        net = total_income - total_expenses

        category_totals = {}
        for t in transactions:
            if t["type"] == "expense":
                cat = t.get("category", "other")
                category_totals[cat] = category_totals.get(cat, 0) + t["amount"]

        top_category = max(category_totals, key=category_totals.get) if category_totals else None

        monthly = {}
        for t in transactions:
            month = t["date"][:7]
            if month not in monthly:
                monthly[month] = {"income": 0, "expense": 0}
            if t["type"] == "income":
                monthly[month]["income"] += t["amount"]
            else:
                monthly[month]["expense"] += t["amount"]

        insights = []

        if top_category:
            insights.append({
                "type": "top_spending_category",
                "title": "Highest Spending Category",
                "message": f"Your highest spending category is {top_category} with ₦{category_totals[top_category]:,.2f}.",
                "value": round(category_totals[top_category], 2),
                "category": top_category,
            })

        sorted_months = sorted(monthly.items())
        if len(sorted_months) >= 2:
            recent = sorted_months[-1][1]
            previous = sorted_months[-2][1]

            if previous["expense"] > 0:
                change_pct = ((recent["expense"] - previous["expense"]) / previous["expense"]) * 100
                if change_pct > 10:
                    insights.append({
                        "type": "spending_increase",
                        "title": "Spending Increased",
                        "message": f"Your spending increased by {abs(change_pct):.1f}% compared to last month.",
                        "value": round(change_pct, 1),
                    })
                elif change_pct < -10:
                    insights.append({
                        "type": "spending_decrease",
                        "title": "Spending Decreased",
                        "message": f"Your spending decreased by {abs(change_pct):.1f}% compared to last month.",
                        "value": round(change_pct, 1),
                    })

        if total_income > 0:
            expense_ratio = total_expenses / total_income
            if expense_ratio > 0.9:
                insights.append({
                    "type": "high_expense_ratio",
                    "title": "High Expense-to-Income Ratio",
                    "message": f"You are spending {expense_ratio * 100:.1f}% of your income. Consider reducing expenses.",
                    "value": round(expense_ratio * 100, 1),
                })

        if net < 0:
            insights.append({
                "type": "negative_cash_flow",
                "title": "Negative Cash Flow",
                "message": f"Your expenses exceeded your income by ₦{abs(net):,.2f}.",
                "value": round(abs(net), 2),
            })
        elif net > 0:
            insights.append({
                "type": "positive_cash_flow",
                "title": "Positive Cash Flow",
                "message": f"You saved ₦{net:,.2f} after all expenses.",
                "value": round(net, 2),
            })

        recurring = {}
        for t in transactions:
            if t["type"] == "expense":
                desc = t["description"].lower().strip()
                recurring[desc] = recurring.get(desc, 0) + 1

        for desc, count in recurring.items():
            if count >= 3:
                insights.append({
                    "type": "recurring_expense",
                    "title": "Recurring Expense Detected",
                    "message": f"\"{desc}\" appears {count} times. Consider reviewing this recurring expense.",
                    "frequency": count,
                })

        return success_response({"insights": insights})

    except Exception as e:
        return error_response("INSIGHTS_ERROR", str(e), 500)
