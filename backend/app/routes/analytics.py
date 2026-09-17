from flask import Blueprint, request

from app.middleware.auth import require_auth
from app.extensions import supabase
from app.utils.response import success_response, error_response

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/analytics/summary", methods=["GET"])
@require_auth
def summary():
    user_id = request.user_id

    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    try:
        query = supabase.client.table("transactions").select("*").eq("user_id", user_id)

        if start_date:
            query = query.gte("date", start_date)
        if end_date:
            query = query.lte("date", end_date)

        result = query.execute()
        transactions = result.data

        total_income = sum(t["amount"] for t in transactions if t["type"] == "income")
        total_expenses = sum(t["amount"] for t in transactions if t["type"] == "expense")
        net_cash_flow = total_income - total_expenses

        latest_balance = None
        sorted_txns = sorted(transactions, key=lambda x: x["date"], reverse=True)
        for t in sorted_txns:
            if t.get("balance") is not None:
                latest_balance = t["balance"]
                break

        return success_response({
            "total_income": round(total_income, 2),
            "total_expenses": round(total_expenses, 2),
            "net_cash_flow": round(net_cash_flow, 2),
            "transaction_count": len(transactions),
            "latest_balance": latest_balance,
        })

    except Exception as e:
        return error_response("ANALYTICS_ERROR", str(e), 500)


@analytics_bp.route("/analytics/categories", methods=["GET"])
@require_auth
def categories():
    user_id = request.user_id

    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    try:
        query = supabase.client.table("transactions").select("*").eq("user_id", user_id).eq("type", "expense")

        if start_date:
            query = query.gte("date", start_date)
        if end_date:
            query = query.lte("date", end_date)

        result = query.execute()
        transactions = result.data

        category_totals = {}
        for t in transactions:
            cat = t.get("category", "other")
            category_totals[cat] = category_totals.get(cat, 0) + t["amount"]

        sorted_categories = [
            {"category": cat, "total": round(total, 2)}
            for cat, total in sorted(category_totals.items(), key=lambda x: x[1], reverse=True)
        ]

        total_expenses = sum(t["amount"] for t in transactions)
        for item in sorted_categories:
            item["percentage"] = round((item["total"] / total_expenses * 100), 1) if total_expenses > 0 else 0

        return success_response({
            "categories": sorted_categories,
            "total_expenses": round(total_expenses, 2),
        })

    except Exception as e:
        return error_response("ANALYTICS_ERROR", str(e), 500)


@analytics_bp.route("/analytics/trends", methods=["GET"])
@require_auth
def trends():
    user_id = request.user_id

    try:
        result = supabase.client.table("transactions").select("*").eq("user_id", user_id).order("date").execute()
        transactions = result.data

        monthly = {}
        for t in transactions:
            month = t["date"][:7]
            if month not in monthly:
                monthly[month] = {"income": 0, "expense": 0}
            if t["type"] == "income":
                monthly[month]["income"] += t["amount"]
            else:
                monthly[month]["expense"] += t["amount"]

        trends = [
            {
                "month": month,
                "income": round(data["income"], 2),
                "expense": round(data["expense"], 2),
                "net": round(data["income"] - data["expense"], 2),
            }
            for month, data in sorted(monthly.items())
        ]

        return success_response({"trends": trends})

    except Exception as e:
        return error_response("ANALYTICS_ERROR", str(e), 500)
