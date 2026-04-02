from unittest.mock import patch

from pathlib import Path

import pytest
from fastapi.testclient import TestClient


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
    "documentType": "pilot-agreement",
    "messages": [],
    "currentFields": {
        "provider": "",
        "customer": "",
        "effectiveDate": "",
        "productDescription": "",
        "pilotPeriod": "",
        "evaluationPurpose": "",
        "generalCapAmount": "",
        "governingLaw": "",
        "chosenCourts": "",
        "noticeAddress": "",
    },
}


def test_generic_chat_missing_body(client):
    """POST /api/chat/generic without a body returns 422."""
    response = client.post("/api/chat/generic")
    assert response.status_code == 422


def test_generic_chat_invalid_body(client):
    """POST /api/chat/generic with a malformed body returns 422."""
    response = client.post("/api/chat/generic", json={"foo": "bar"})
    assert response.status_code == 422


def test_generic_chat_unknown_document_type(client):
    """Unknown documentType returns 200 with a fallback message and empty fields."""
    response = client.post("/api/chat/generic", json={
        "documentType": "lease-agreement",
        "messages": [],
        "currentFields": {},
    })
    assert response.status_code == 200
    data = response.json()
    assert data["fields"] == {}
    assert "lease" in data["message"].lower() or "don't recognize" in data["message"].lower() or "sorry" in data["message"].lower()


def test_generic_chat_returns_message_and_fields(client):
    """A valid request returns a JSON object with message and fields."""
    from models.chat import GenericChatResponse

    mock_result = GenericChatResponse(
        message="Hi! I'm here to help you create a Pilot Agreement. Who is the provider?",
        fields={},
    )

    with patch("services.generic_ai.get_response", return_value=mock_result):
        response = client.post("/api/chat/generic", json=VALID_REQUEST)

    assert response.status_code == 200
    data = response.json()
    assert "Pilot Agreement" in data["message"]
    assert "fields" in data


def test_generic_chat_fields_populated(client):
    """Fields returned by the AI are included in the response."""
    from models.chat import GenericChatResponse

    mock_result = GenericChatResponse(
        message="Got it — Acme Corp is the provider and Beta Corp is the customer.",
        fields={"provider": "Acme Corp", "customer": "Beta Corp"},
    )

    with patch("services.generic_ai.get_response", return_value=mock_result):
        response = client.post("/api/chat/generic", json=VALID_REQUEST)

    assert response.status_code == 200
    data = response.json()
    assert data["fields"]["provider"] == "Acme Corp"
    assert data["fields"]["customer"] == "Beta Corp"
