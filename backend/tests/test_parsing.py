from app.utils import parse_csv_row


def test_parse_valid_csv_row():
    row = {"date": "2025-07-15", "description": "Client Payment", "amount": "450000", "type": "income"}
    result = parse_csv_row(row, "user-123")
    assert result is not None
    assert result["user_id"] == "user-123"
    assert result["date"] == "2025-07-15"
    assert result["description"] == "Client Payment"
    assert result["type"] == "income"
    assert result["amount"] == 450000.0


def test_parse_csv_row_missing_date():
    row = {"description": "Payment", "amount": "100", "type": "expense"}
    result = parse_csv_row(row, "user-123")
    assert result is None


def test_parse_csv_row_missing_description():
    row = {"date": "2025-07-15", "amount": "100", "type": "expense"}
    result = parse_csv_row(row, "user-123")
    assert result is None


def test_parse_csv_row_invalid_amount():
    row = {"date": "2025-07-15", "description": "Payment", "amount": "abc", "type": "expense"}
    result = parse_csv_row(row, "user-123")
    assert result is None


def test_parse_csv_row_zero_amount():
    row = {"date": "2025-07-15", "description": "Payment", "amount": "0", "type": "expense"}
    result = parse_csv_row(row, "user-123")
    assert result is None


def test_parse_csv_row_invalid_type():
    row = {"date": "2025-07-15", "description": "Payment", "amount": "100", "type": "invalid"}
    result = parse_csv_row(row, "user-123")
    assert result is None


def test_parse_csv_row_credit_as_income():
    row = {"date": "2025-07-15", "description": "Credit", "amount": "500", "type": "credit"}
    result = parse_csv_row(row, "user-123")
    assert result is not None
    assert result["type"] == "income"


def test_parse_csv_row_debit_as_expense():
    row = {"date": "2025-07-15", "description": "Debit", "amount": "500", "type": "debit"}
    result = parse_csv_row(row, "user-123")
    assert result is not None
    assert result["type"] == "expense"


def test_parse_csv_row_auto_categorize():
    row = {"date": "2025-07-15", "description": "Uber ride to office", "amount": "2000", "type": "expense"}
    result = parse_csv_row(row, "user-123")
    assert result is not None
    assert result["category"] == "transport"
