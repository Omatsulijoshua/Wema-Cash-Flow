import os
from flask import Flask
from flask_cors import CORS

from app.config import Config
from app.extensions import supabase
from app.routes.health import health_bp
from app.routes.transactions import transactions_bp
from app.routes.analytics import analytics_bp
from app.routes.insights import insights_bp
from app.routes.forecast import forecast_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, origins=Config.CORS_ORIGINS)

    supabase.init_app(app)

    app.register_blueprint(health_bp)
    app.register_blueprint(transactions_bp, url_prefix="/api")
    app.register_blueprint(analytics_bp, url_prefix="/api")
    app.register_blueprint(insights_bp, url_prefix="/api")
    app.register_blueprint(forecast_bp, url_prefix="/api")

    return app
