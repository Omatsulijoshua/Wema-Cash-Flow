from app.utils import categorize


def test_categorize_salary():
    assert categorize("Salary Payment") == "salary"


def test_categorize_food():
    assert categorize("Restaurant lunch") == "food"
    assert categorize("Grocery store") == "food"


def test_categorize_transport():
    assert categorize("Uber ride") == "transport"
    assert categorize("Fuel payment") == "transport"


def test_categorize_utilities():
    assert categorize("Electricity bill") == "utilities"
    assert categorize("Internet subscription") == "utilities"


def test_categorize_shopping():
    assert categorize("Shopping mall") == "shopping"


def test_categorize_entertainment():
    assert categorize("Netflix subscription") == "entertainment"


def test_categorize_healthcare():
    assert categorize("Hospital visit") == "healthcare"


def test_categorize_education():
    assert categorize("University tuition") == "education"


def test_categorize_transfers():
    assert categorize("Transfer to friend") == "transfers"


def test_categorize_bills():
    assert categorize("Rent payment") == "bills"
    assert categorize("Insurance premium") == "bills"


def test_categorize_other():
    assert categorize("Some random description") == "other"
