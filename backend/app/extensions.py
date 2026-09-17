from supabase import create_client, Client


class SupabaseClient:
    def __init__(self):
        self._client = None

    def init_app(self, app):
        url = app.config.get("SUPABASE_URL", "")
        key = app.config.get("SUPABASE_KEY", "")
        if url and key:
            self._client = create_client(url, key)

    @property
    def client(self) -> Client:
        return self._client


supabase = SupabaseClient()
