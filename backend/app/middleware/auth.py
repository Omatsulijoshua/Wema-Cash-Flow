import jwt
from functools import wraps
from flask import request, jsonify, current_app


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get("Authorization", "")

        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1]

        if not token:
            return jsonify({
                "success": False,
                "error": {
                    "code": "MISSING_TOKEN",
                    "message": "Authorization token is required"
                }
            }), 401

        try:
            payload = jwt.decode(
                token,
                current_app.config.get("SUPABASE_KEY", ""),
                algorithms=["HS256"],
                options={"verify_signature": False}
            )
            user_id = payload.get("sub")
            if not user_id:
                return jsonify({
                    "success": False,
                    "error": {
                        "code": "INVALID_TOKEN",
                        "message": "Token does not contain a valid user ID"
                    }
                }), 401
        except jwt.ExpiredSignatureError:
            return jsonify({
                "success": False,
                "error": {
                    "code": "EXPIRED_TOKEN",
                    "message": "Token has expired"
                }
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                "success": False,
                "error": {
                    "code": "INVALID_TOKEN",
                    "message": "Token is malformed or invalid"
                }
            }), 401

        request.user_id = user_id
        return f(*args, **kwargs)
    return decorated
