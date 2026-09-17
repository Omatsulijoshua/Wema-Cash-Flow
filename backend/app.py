import os
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def index():
    return jsonify({"message": "CashFlow API is running", "status": "success"})


@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "service": "cashflow-api"})


@app.route("/api/test")
def test():
    return jsonify({"message": "Flutter to Flask connection successful", "backend": "Flask", "status": "success"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
