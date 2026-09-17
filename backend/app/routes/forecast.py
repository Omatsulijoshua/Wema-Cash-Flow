from flask import Blueprint, request

from app.middleware.auth import require_auth
from app.extensions import supabase
from app.utils.response import success_response, error_response

forecast_bp = Blueprint("forecast", __name__)


@forecast_bp.route("/forecast", methods=["GET"])
@require_auth
def get_forecast():
    user_id = request.user_id
    months_ahead = request.args.get("months", 3, type=int)
    months_ahead = min(months_ahead, 12)

    try:
        result = supabase.client.table("transactions").select("*").eq("user_id", user_id).order("date").execute()
        transactions = result.data

        if len(transactions) < 2:
            return success_response({
                "forecast": [],
                "message": "Not enough transaction history to generate a forecast. At least 2 months of data required.",
                "method": "insufficient_data",
            })

        monthly = {}
        for t in transactions:
            month = t["date"][:7]
            if month not in monthly:
                monthly[month] = {"income": 0, "expense": 0}
            if t["type"] == "income":
                monthly[month]["income"] += t["amount"]
            else:
                monthly[month]["expense"] += t["amount"]

        sorted_months = sorted(monthly.items())

        incomes = [m[1]["income"] for m in sorted_months]
        expenses = [m[1]["expense"] for m in sorted_months]

        avg_income = sum(incomes) / len(incomes) if incomes else 0
        avg_expense = sum(expenses) / len(expenses) if expenses else 0

        if len(incomes) >= 3:
            recent_incomes = incomes[-3:]
            income_trend = (recent_incomes[-1] - recent_incomes[0]) / len(recent_incomes) if len(recent_incomes) > 1 else 0
        else:
            income_trend = 0

        if len(expenses) >= 3:
            recent_expenses = expenses[-3:]
            expense_trend = (recent_expenses[-1] - recent_expenses[0]) / len(recent_expenses) if len(recent_expenses) > 1 else 0
        else:
            expense_trend = 0

        last_month = sorted_months[-1][0]
        forecast = []

        for i in range(1, months_ahead + 1):
            year = int(last_month[:4])
            month = int(last_month[5:7]) + i
            while month > 12:
                month -= 12
                year += 1
            forecast_month = f"{year}-{month:02d}"

            forecasted_income = max(0, avg_income + income_trend * i)
            forecasted_expense = max(0, avg_expense + expense_trend * i)

            forecast.append({
                "month": forecast_month,
                "income": round(forecasted_income, 2),
                "expense": round(forecasted_expense, 2),
                "net": round(forecasted_income - forecasted_expense, 2),
            })

        return success_response({
            "forecast": forecast,
            "method": "linear_average",
            "disclaimer": "This forecast is an estimate based on historical averages and trends. It is not financial advice.",
            "based_on_months": len(sorted_months),
        })

    except Exception as e:
        return error_response("FORECAST_ERROR", str(e), 500)
