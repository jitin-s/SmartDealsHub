import os
import sys
import time
import subprocess
import webbrowser
import signal

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")

# Locate virtual environment python
if os.name == "nt":
    VENV_PYTHON = os.path.join(BACKEND_DIR, ".venv", "Scripts", "python.exe")
    NPM_CMD = "npm.cmd"
else:
    VENV_PYTHON = os.path.join(BACKEND_DIR, ".venv", "bin", "python")
    NPM_CMD = "npm"

if not os.path.exists(VENV_PYTHON):
    VENV_PYTHON = sys.executable

def main():
    print("=" * 60)
    print("  🚀 Starting SmartDeals Hub (Backend + Frontend)")
    print("=" * 60)

    # 1. Start Backend FastAPI Server
    print("[1/2] Launching Backend API on http://localhost:8000 ...")
    backend_cmd = [
        VENV_PYTHON,
        "-m", "uvicorn",
        "app.main:app",
        "--host", "0.0.0.0",
        "--port", "8000"
    ]
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=BACKEND_DIR
    )

    # 2. Start Frontend Vite Dev Server
    print("[2/2] Launching Frontend Web App on http://localhost:5173 ...")
    frontend_cmd = [
        NPM_CMD,
        "run", "dev",
        "--",
        "--host", "0.0.0.0",
        "--port", "5173"
    ]
    frontend_proc = subprocess.Popen(
        frontend_cmd,
        cwd=FRONTEND_DIR
    )

    # Wait a moment for servers to spin up
    time.sleep(2)
    print("\n" + "=" * 60)
    print("  ✅ Both servers are running!")
    print("  👉 Frontend Web App: http://localhost:5173")
    print("  👉 Backend API Docs: http://localhost:8000/docs")
    print("  Press Ctrl+C at any time to stop both servers.")
    print("=" * 60 + "\n")

    # Automatically launch browser
    try:
        webbrowser.open("http://localhost:5173")
    except Exception:
        pass

    def cleanup(signum=None, frame=None):
        print("\nStopping servers...")
        try:
            backend_proc.terminate()
        except Exception:
            pass
        try:
            frontend_proc.terminate()
        except Exception:
            pass
        sys.exit(0)

    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    try:
        while True:
            # Check if any child died unexpectedly
            if backend_proc.poll() is not None:
                print("[ERROR] Backend process exited unexpectedly.")
                break
            if frontend_proc.poll() is not None:
                print("[ERROR] Frontend process exited unexpectedly.")
                break
            time.sleep(1)
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    main()
