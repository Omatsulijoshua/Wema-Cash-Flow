import csv
import io
from flask import Blueprint, request, current_app

from app.middleware.auth import require_auth
from app.extensions import supabase
from app.utils import parse_csv_row, categorize
from app.utils.response import success_response, error_response

transactions_bp = Blueprint("transactions", __name__)


@transactions_bp.route("/transactions/import", methods=["POST"])
@require_auth
def import_transactions():
    user_id = request.user_id

    if "file" not in request.files:
        return error_response("MISSING_FILE", "No file uploaded", 400)

    file = request.files["file"]
    if not file.filename:
        return error_response("MISSING_FILE", "No file selected", 400)

    if not file.filename.endswith(".csv"):
        return error_response("INVALID_FILE", "Only CSV files are supported", 400)

    try:
        content = file.read().decode("utf-8-sig")
        reader = csv.DictReader(io.StringIO(content))

        required_columns = {"date", "description", "amount"}
        if not required_columns.issubset(set(reader.fieldnames or [])):
            missing = required_columns - set(reader.fieldnames or [])
            return error_response(
                "INVALID_COLUMNS",
                f"CSV is missing required columns: {', '.join(missing)}",
                400,
            )

        imported = []
        errors = []
        row_number = 1

        for row in reader:
            row_number += 1
            parsed = parse_csv_row(row, user_id)
            if parsed:
                imported.append(parsed)
            else:
                errors.append(f"Row {row_number}: invalid or missing data")

        if imported:
            supabase.client.table("transactions").insert(imported).execute()

        return success_response({
            "imported": len(imported),
            "failed": len(errors),
            "errors": errors[:50],
        }, 201)

    except UnicodeDecodeError:
        return error_response("INVALID_FILE", "File encoding is not supported. Use UTF-8.", 400)
    except Exception as e:
        return error_response("IMPORT_ERROR", str(e), 500)


@transactions_bp.route("/transactions", methods=["GET"])
@require_auth
def get_transactions():
    user_id = request.user_id

    page = request.args.get("page", 1, type=int)
    page_size = request.args.get("page_size", 50, type=int)
    page_size = min(page_size, 100)

    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    category = request.args.get("category")

    try:
        query = supabase.client.table("transactions").select("*", count="exact").eq("user_id", user_id)

        if start_date:
            query = query.gte("date", start_date)
        if end_date:
            query = query.lte("date", end_date)
        if category:
            query = query.eq("category", category)

        query = query.order("date", desc=True)
        query = query.range((page - 1) * page_size, page * page_size - 1)

        result = query.execute()

        return success_response({
            "transactions": result.data,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total": result.count or len(result.data),
            }
        })

    except Exception as e:
        return error_response("QUERY_ERROR", str(e), 500)


@transactions_bp.route("/transactions", methods=["POST"])
@require_auth
def add_transaction():
    user_id = request.user_id
    data = request.get_json()

    if not data:
        return error_response("MISSING_BODY", "Request body is required", 400)

    description = data.get("description", "").strip()
    amount = data.get("amount")
    tx_type = data.get("type", "").strip().lower()
    date = data.get("date", "").strip()

    if not description:
        return error_response("MISSING_FIELD", "description is required", 400)
    if amount is None:
        return error_response("MISSING_FIELD", "amount is required", 400)
    if tx_type not in ("income", "expense"):
        return error_response("INVALID_FIELD", "type must be 'income' or 'expense'", 400)

    try:
        amount = abs(float(amount))
    except (ValueError, TypeError):
        return error_response("INVALID_FIELD", "amount must be a number", 400)

    if amount <= 0:
        return error_response("INVALID_FIELD", "amount must be positive", 400)

    from datetime import datetime
    if not date:
        date = datetime.utcnow().strftime("%Y-%m-%d")

    category = data.get("category", "").strip().lower()
    if not category or category not in ("salary", "food", "transport", "utilities", "shopping", "entertainment", "healthcare", "education", "transfers", "bills", "other"):
        category = categorize(description)

    tx = {
        "user_id": user_id,
        "date": date,
        "description": description,
        "type": tx_type,
        "amount": amount,
        "category": category,
        "source": data.get("source", "manual"),
    }

    try:
        result = supabase.client.table("transactions").insert(tx).execute()
        return success_response(result.data[0] if result.data else tx, 201)
    except Exception as e:
        return error_response("INSERT_ERROR", str(e), 500)
