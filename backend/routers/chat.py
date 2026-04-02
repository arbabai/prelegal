from fastapi import APIRouter

from models.chat import ChatRequest, ChatResponse
from services import nda_ai

router = APIRouter(prefix="/api")


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    return nda_ai.get_response(req.messages, req.currentFields)
