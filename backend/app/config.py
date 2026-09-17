import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key")
    SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
    SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*").split(",")
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB
