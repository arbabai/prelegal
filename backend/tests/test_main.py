import sqlite3
import tempfile
from pathlib import Path
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def tmp_db(tmp_path: Path):
    """Patch DB_PATH to a temp directory so tests don't pollute the real DB."""
    db_path = tmp_path / "data" / "prelegal.db"
    with patch("main.DB_PATH", db_path):
        yield db_path


@pytest.fixture()
def client(tmp_db):
    # Import after patching so lifespan picks up the patched DB_PATH
    from main import app

    with TestClient(app) as c:
        yield c


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_db_initialized(tmp_db, client):
    """After startup the users table should exist."""
    conn = sqlite3.connect(tmp_db)
    cursor = conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
    )
    tables = [row[0] for row in cursor.fetchall()]
    conn.close()
    assert "users" in tables


def test_db_users_schema(tmp_db, client):
    """Users table should have the expected columns."""
    conn = sqlite3.connect(tmp_db)
    cursor = conn.execute("PRAGMA table_info(users)")
    columns = {row[1] for row in cursor.fetchall()}
    conn.close()
    assert {"id", "email", "password_hash", "created_at"}.issubset(columns)


def test_frontend_fallback_when_no_build(tmp_db, client):
    """When frontend_build dir is missing, root returns 503 (not 500)."""
    import main as main_module

    original = main_module.FRONTEND_BUILD
    try:
        main_module.FRONTEND_BUILD = Path("/nonexistent_dir")
        response = client.get("/")
        assert response.status_code == 503
    finally:
        main_module.FRONTEND_BUILD = original
