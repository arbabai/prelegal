from fastapi import APIRouter

from models.chat import ChatRequest, ChatResponse, GenericChatRequest, GenericChatResponse
from services import nda_ai, generic_ai

router = APIRouter(prefix="/api")


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    return nda_ai.get_response(req.messages, req.currentFields)


@router.post("/chat/generic", response_model=GenericChatResponse)
def chat_generic(req: GenericChatRequest) -> GenericChatResponse:
    return generic_ai.get_response(req.documentType, req.messages, req.currentFields)
