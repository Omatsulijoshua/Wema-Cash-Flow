def test_health(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["status"] == "ok"
    assert data["service"] == "cashflow-api"
