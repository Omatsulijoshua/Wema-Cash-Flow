def test_import_requires_auth(client):
    response = client.post("/api/transactions/import")
    assert response.status_code == 401
    data = response.get_json()
    assert data["success"] is False
    assert data["error"]["code"] == "MISSING_TOKEN"


def test_get_transactions_requires_auth(client):
    response = client.get("/api/transactions")
    assert response.status_code == 401
    data = response.get_json()
    assert data["success"] is False
    assert data["error"]["code"] == "MISSING_TOKEN"


def test_add_transaction_requires_auth(client):
    response = client.post("/api/transactions", json={})
    assert response.status_code == 401
    data = response.get_json()
    assert data["success"] is False
    assert data["error"]["code"] == "MISSING_TOKEN"
