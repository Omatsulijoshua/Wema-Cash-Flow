import uuid
import re
from datetime import datetime
from typing import List, Dict, Optional


CATEGORY_KEYWORDS = {
    "salary": ["salary", "wages", "payroll", "income", "earning"],
    "food": ["food", "restaurant", "grocery", "groceries", "meal", "lunch", "dinner", "breakfast", "cafe", "eatery", "canteen"],
    "transport": ["fuel", "uber", "transport", "logistics", "bus", "taxi", "ride", "parking", "toll"],
    "utilities": ["electric", "electricity", "water", "internet", "airtime", "data", "utility", "power", "gas"],
    "shopping": ["shopping", "store", "shop", "market", "purchase", "mall", "retail"],
    "entertainment": ["entertainment", "movie", "netflix", "spotify", "music", "game", "gaming", "bar", "club"],
    "healthcare": ["hospital", "clinic", "pharmacy", "health", "medical", "doctor", "medicine", "drug"],
    "education": ["school", "university", "education", "tuition", "course", "training", "book", "tutorial"],
    "transfers": ["transfer", "sent", "received", "send", "wire", "remittance"],
    "bills": ["bill", "subscription", "fee", "rent", "lease", "insurance", "premium", "recharge"],
}


def categorize(description: str) -> str:
    desc = description.lower().strip()
    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            if keyword in desc:
                return category
    return "other"


def parse_csv_row(row: Dict, user_id: str) -> Optional[Dict]:
    try:
        date_str = row.get("date", "").strip()
        if not date_str:
            return None

        for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y", "%Y/%m/%d"):
            try:
                parsed_date = datetime.strptime(date_str, fmt)
                date_str = parsed_date.strftime("%Y-%m-%d")
                break
            except ValueError:
                continue
        else:
            return None

        desc = row.get("description", "").strip()
        if not desc:
            return None

        type_str = row.get("type", "").strip().lower()
        if type_str not in ("income", "expense"):
            if type_str in ("credit", "cr", "+"):
                type_str = "income"
            elif type_str in ("debit", "dr", "-"):
                type_str = "expense"
            else:
                return None

        amount_str = row.get("amount", "0").strip().replace(",", "").replace("₦", "").replace("$", "")
        try:
            amount = abs(float(amount_str))
        except (ValueError, TypeError):
            return None

        if amount <= 0:
            return None

        balance_str = row.get("balance", "").strip().replace(",", "").replace("₦", "").replace("$", "")
        balance = None
        if balance_str:
            try:
                balance = float(balance_str)
            except (ValueError, TypeError):
                balance = None

        category = row.get("category", "").strip().lower()
        if not category or category not in CATEGORY_KEYWORDS:
            category = categorize(desc)

        return {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "date": date_str,
            "description": desc,
            "type": type_str,
            "amount": amount,
            "category": category,
            "balance": balance,
            "source": "csv",
        }
    except Exception:
        return None
