import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)

# Ensure backend directory is in sys.path across all Vercel/Lambda filesystem layouts
candidate_paths = [
    os.path.join(root_dir, "backend"),
    os.path.join(current_dir, "backend"),
    os.path.join(current_dir, "..", "backend"),
    root_dir,
    current_dir,
]

for p in candidate_paths:
    abs_p = os.path.abspath(p)
    if os.path.exists(abs_p) and abs_p not in sys.path:
        sys.path.insert(0, abs_p)

try:
    from app.main import app
    handler = app
except Exception as e:
    import traceback
    err_trace = traceback.format_exc()
    print(f"[Vercel Function Error] Failed to import app:\n{err_trace}")
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse

    app = FastAPI(title="SmartDeals Hub - Serverless Diagnosis Mode")

    @app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"])
    async def fallback_route(full_path: str):
        return JSONResponse(
            status_code=500,
            content={
                "status": "serverless_initialization_error",
                "error": str(e),
                "trace": err_trace,
                "sys_path": sys.path,
                "cwd": os.getcwd(),
                "dir_contents": os.listdir(".") if os.path.exists(".") else []
            }
        )
    handler = app



