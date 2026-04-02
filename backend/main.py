import sqlite3
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import FileResponse, HTMLResponse, Response
from fastapi.staticfiles import StaticFiles

from routers.chat import router as chat_router

load_dotenv()

FRONTEND_BUILD = Path(__file__).parent.parent / "frontend_build"
DB_PATH = Path(__file__).parent / "data" / "prelegal.db"


def init_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    # Always recreate from scratch so the DB is fresh on each container start.
    DB_PATH.unlink(missing_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("""
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(chat_router)

# Mount Next.js static assets (_next/static, etc.)
if (FRONTEND_BUILD / "_next").exists():
    app.mount("/_next", StaticFiles(directory=FRONTEND_BUILD / "_next"), name="next_assets")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


def _safe_resolve(base: Path, rel: str) -> Path | None:
    """Resolve `base / rel` and return it only if it stays within `base`."""
    resolved_base = base.resolve()
    candidate = (base / rel).resolve()
    if not str(candidate).startswith(str(resolved_base)):
        return None
    return candidate


@app.get("/{full_path:path}")
def serve_frontend(full_path: str) -> Response:
    base = FRONTEND_BUILD

    if not base.exists():
        return HTMLResponse(
            "<html><body><h1>503 — Frontend not built</h1></body></html>",
            status_code=503,
        )

    # Serve root
    if not full_path or full_path == "/":
        return FileResponse(base / "index.html")

    # Try exact file match (e.g. favicon.ico, images) — path-traversal safe
    exact = _safe_resolve(base, full_path)
    if exact is not None and exact.is_file():
        return FileResponse(exact)

    # Try Next.js static export: page.html (without trailingSlash)
    html_file = _safe_resolve(base, f"{full_path}.html")
    if html_file is not None and html_file.is_file():
        return FileResponse(html_file)

    # Try directory index (with trailingSlash)
    index_file = _safe_resolve(base, f"{full_path}/index.html")
    if index_file is not None and index_file.is_file():
        return FileResponse(index_file)

    # SPA fallback
    return FileResponse(base / "index.html")
