from typing import Literal, Optional

from pydantic import BaseModel


class PartyFields(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    company: Optional[str] = None
    noticeAddress: Optional[str] = None


class NDAFieldUpdate(BaseModel):
    purpose: Optional[str] = None
    effectiveDate: Optional[str] = None
    mndaTerm: Optional[Literal["expires", "until_terminated"]] = None
    mndaTermYears: Optional[str] = None
    confidentialityTerm: Optional[Literal["fixed", "perpetual"]] = None
    confidentialityTermYears: Optional[str] = None
    governingLaw: Optional[str] = None
    jurisdiction: Optional[str] = None
    modifications: Optional[str] = None
    party1: Optional[PartyFields] = None
    party2: Optional[PartyFields] = None


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    currentFields: NDAFieldUpdate


class ChatResponse(BaseModel):
    """Structured output from the LLM and HTTP response to the frontend."""
    message: str
    fields: NDAFieldUpdate


# ── Generic multi-document models ────────────────────────────────────────────
# Field keys must match the keys defined in frontend/src/lib/docConfigs.ts

class GenericChatRequest(BaseModel):
    documentType: str
    messages: list[ChatMessage]
    currentFields: dict[str, Optional[str]]


class GenericChatResponse(BaseModel):
    """Structured output for any non-NDA document type."""
    message: str
    fields: dict[str, Optional[str]] = {}
