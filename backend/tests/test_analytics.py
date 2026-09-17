def test_analytics_summary_requires_auth(client):
    response = client.get("/api/analytics/summary")
    assert response.status_code == 401
    data = response.get_json()
    assert data["success"] is False
    assert data["error"]["code"] == "MISSING_TOKEN"


def test_analytics_categories_requires_auth(client):
    response = client.get("/api/analytics/categories")
    assert response.status_code == 401
    data = response.get_json()
    assert data["success"] is False
    assert data["error"]["code"] == "MISSING_TOKEN"


def test_analytics_trends_requires_auth(client):
    response = client.get("/api/analytics/trends")
    assert response.status_code == 401
    data = response.get_json()
    assert data["success"] is False
    assert data["error"]["code"] == "MISSING_TOKEN"
