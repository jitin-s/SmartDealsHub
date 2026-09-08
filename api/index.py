import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
backend_dir = os.path.join(root_dir, "backend")

# Ensure both api/ and backend/ are in sys.path
for p in (current_dir, backend_dir, root_dir):
    if os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)

try:
    from app.main import app
except Exception as e:
    print(f"[Vercel Function Error] Failed to import app: {e}")
    # Minimal fallback app to diagnose if ever needed
    from fastapi import FastAPI
    app = FastAPI(title="Diagnosis Mode")
    @app.get("/api/health")
    @app.get("/")
    def health():
        return {"status": "error", "message": f"App import error: {e}"}

handler = app

