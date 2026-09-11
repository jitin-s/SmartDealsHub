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
    import traceback
    err_trace = traceback.format_exc()
    print(f"[Vercel Function Error] Failed to import app:\n{err_trace}")
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse

    app = FastAPI(title="Diagnosis Mode")

    @app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"])
    async def fallback_route(full_path: str):
        return JSONResponse(
            status_code=500,
            content={
                "status": "serverless_initialization_error",
                "error": str(e),
                "trace": err_trace
            }
        )


