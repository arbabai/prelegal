import os
from datetime import date

from litellm import completion
from pydantic import ValidationError

from models.chat import ChatMessage, ChatResponse, NDAFieldUpdate

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

SYSTEM_PROMPT = """You are a helpful legal document assistant for Prelegal, helping users create a \
Mutual Non-Disclosure Agreement (MNDA).

Your job is to have a natural, friendly conversation to gather the information needed to fill in the NDA.

The fields you need to collect are:
- purpose: How Confidential Information may be used (e.g. "Evaluating a potential business partnership")
- effectiveDate: Agreement start date in ISO format YYYY-MM-DD (default to today if not specified)
- mndaTerm: Either "expires" (ask for how many years) or "until_terminated"
- mndaTermYears: Number of years as a string (only when mndaTerm is "expires")
- confidentialityTerm: Either "fixed" (ask for how many years) or "perpetual"
- confidentialityTermYears: Number of years as a string (only when confidentialityTerm is "fixed")
- governingLaw: State governing this agreement (e.g. "Delaware")
- jurisdiction: Court location (e.g. "courts located in New Castle, DE")
- modifications: Any modifications to standard terms (optional, skip if none)
- party1: name, title, company, noticeAddress for the first party
- party2: name, title, company, noticeAddress for the second party

Guidelines:
- Ask one or two questions at a time — do not dump all questions at once
- Speak naturally; don't mention field names directly to the user
- When you have determined a value from the conversation, include it in `fields`
- Only include fields you are confident about; leave others as null
- If fields already have values, do not ask about them again
- If the user doesn't know a value (e.g. governing law), suggest a sensible default
- Today's date is {today}

Current document state (already filled fields):
{current_fields}

If no fields are filled and there are no messages yet, introduce yourself briefly and ask for the \
purpose of this NDA to get started."""


def get_response(messages: list[ChatMessage], current_fields: NDAFieldUpdate) -> ChatResponse:
    today = date.today().isoformat()
    filled = {k: v for k, v in current_fields.model_dump().items() if v is not None and v != ""}
    current_fields_str = str(filled) if filled else "None yet."

    system_content = SYSTEM_PROMPT.format(today=today, current_fields=current_fields_str)

    llm_messages = [{"role": "system", "content": system_content}]
    for msg in messages:
        llm_messages.append({"role": msg.role, "content": msg.content})

    response = completion(
        model=MODEL,
        messages=llm_messages,
        response_format=ChatResponse,
        reasoning_effort="low",
        extra_body=EXTRA_BODY,
        api_key=os.environ["OPENROUTER_API_KEY"],
    )

    raw = response.choices[0].message.content
    try:
        return ChatResponse.model_validate_json(raw)
    except (ValidationError, ValueError):
        # If the LLM returns non-JSON prose, wrap it gracefully
        return ChatResponse(message=raw or "Sorry, something went wrong. Please try again.", fields=NDAFieldUpdate())
