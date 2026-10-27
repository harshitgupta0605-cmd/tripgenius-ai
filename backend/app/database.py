from typing import Optional
from backend.app.config import settings

supabase_client = None

def get_supabase():
    global supabase_client
    if supabase_client is None:
        if settings.SUPABASE_URL and settings.SUPABASE_KEY:
            try:
                from supabase import create_client
                supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            except Exception as e:
                print(f"[Supabase Init Warning] Could not connect: {e}")
                supabase_client = None
    return supabase_client
