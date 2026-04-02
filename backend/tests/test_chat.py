from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient
from pathlib import Path


@pytest.fixture()
def tmp_db(tmp_path: Path):
    db_path = tmp_path / "data" / "prelegal.db"
    with patch("main.DB_PATH", db_path):
        yield db_path


@pytest.fixture()
def client(tmp_db):
    from main import app
    with TestClient(app) as c:
        yield c


VALID_REQUEST = {
    "messages": [],
    "currentFields": {
        "purpose": "",
        "effectiveDate": "2026-04-02",
        "mndaTerm": "expires",
        "mndaTermYears": "1",
        "confidentialityTerm": "fixed",
        "confidentialityTermYears": "1",
        "governingLaw": "",
        "jurisdiction": "",
        "modifications": "",
        "party1": {"name": "", "title": "", "company": "", "noticeAddress": ""},
        "party2": {"name": "", "title": "", "company": "", "noticeAddress": ""},
    },
}


def test_chat_missing_body(client):
    """POST /api/chat without a body returns 422."""
    response = client.post("/api/chat")
    assert response.status_code == 422


def test_chat_invalid_body(client):
    """POST /api/chat with a malformed body returns 422."""
    response = client.post("/api/chat", json={"foo": "bar"})
    assert response.status_code == 422


def test_chat_returns_message_and_fields(client):
    """A valid request returns a JSON object with message and fields."""
    from models.chat import ChatResponse, NDAFieldUpdate

    mock_result = ChatResponse(
        message="Hi! What's the purpose of this NDA?",
        fields=NDAFieldUpdate(),
    )

    with patch("services.nda_ai.get_response", return_value=mock_result):
        response = client.post("/api/chat", json=VALID_REQUEST)

    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Hi! What's the purpose of this NDA?"
    assert "fields" in data


def test_chat_fields_populated(client):
    """Fields returned by the AI are included in the response."""
    from models.chat import ChatResponse, NDAFieldUpdate, PartyFields

    mock_result = ChatResponse(
        message="Got it — let me fill in Party 1 details.",
        fields=NDAFieldUpdate(
            purpose="Evaluating a software partnership",
            party1=PartyFields(name="Alice Smith", company="Acme Corp"),
        ),
    )

    with patch("services.nda_ai.get_response", return_value=mock_result):
        response = client.post("/api/chat", json=VALID_REQUEST)

    assert response.status_code == 200
    data = response.json()
    assert data["fields"]["purpose"] == "Evaluating a software partnership"
    assert data["fields"]["party1"]["name"] == "Alice Smith"
