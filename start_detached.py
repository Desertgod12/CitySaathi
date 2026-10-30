import subprocess
import os
import sys

project_dir = r"C:\Users\hp\.gemini\antigravity\scratch\citysaathi"
log_frontend = os.path.join(project_dir, "frontend.log")
log_backend = os.path.join(project_dir, "backend.log")

# Start Vite dev server detached
DETACHED_FLAGS = 0x00000008 | 0x00000200 # DETACHED_PROCESS | CREATE_NEW_PROCESS_GROUP

with open(log_frontend, "w", encoding="utf-8") as f_out:
    p_frontend = subprocess.Popen(
        ["cmd.exe", "/c", "npm run dev -- --host 0.0.0.0 --port 5173"],
        cwd=project_dir,
        stdout=f_out,
        stderr=subprocess.STDOUT,
        creationflags=DETACHED_FLAGS,
        close_fds=True
    )

with open(log_backend, "w", encoding="utf-8") as b_out:
    p_backend = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"],
        cwd=project_dir,
        stdout=b_out,
        stderr=subprocess.STDOUT,
        creationflags=DETACHED_FLAGS,
        close_fds=True
    )

pid_file = os.path.join(project_dir, "servers.pid")
with open(pid_file, "w") as pf:
    pf.write(f"frontend:{p_frontend.pid}\nbackend:{p_backend.pid}\n")

print(f"Started detached frontend (PID {p_frontend.pid}) and backend (PID {p_backend.pid})")
