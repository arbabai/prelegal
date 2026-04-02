import os
from datetime import date

from litellm import completion
from pydantic import ValidationError

from models.chat import ChatMessage, GenericChatResponse
from services.doc_registry import REGISTRY

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

SYSTEM_PROMPT = """You are a helpful legal document assistant for Prelegal, helping users create a \
{doc_name}.

{doc_description}

Your job is to have a natural, friendly conversation to gather the information needed to fill in \
this document.

The fields you need to collect are:
{field_list}

Guidelines:
- Ask one or two questions at a time — do not dump all questions at once
- Speak naturally; do not mention field key names to the user (use the labels instead)
- When you have determined a value from the conversation, include it in `fields` using the exact \
key name shown above
- Only include fields you are confident about; leave others out entirely
- If fields already have values, do not ask about them again
- If the user doesn't know a value, suggest a sensible default
- Today's date is {today}

{prompt_fragment}

Current document state (already filled fields):
{current_fields}

If no fields are filled and there are no messages yet, introduce yourself briefly, mention the \
document you're helping create, and ask for the first piece of information to get started."""

UNSUPPORTED_MESSAGE = (
    "I'm sorry, but I don't recognize that document type. "
    "Here are the documents I can help you create:\n\n"
    + "\n".join(f"• **{cfg.name}**" for cfg in REGISTRY.values() if cfg.slug != "mutual-nda-standard")
    + "\n\nThe **Mutual NDA** is also available via the dedicated NDA creator. "
    "Which of these would you like to work on?"
)


def get_response(
    document_type: str,
    messages: list[ChatMessage],
    current_fields: dict[str, str | None],
) -> GenericChatResponse:
    config = REGISTRY.get(document_type)
    if config is None:
        return GenericChatResponse(message=UNSUPPORTED_MESSAGE, fields={})

    today = date.today().isoformat()

    # Build field list for system prompt
    field_lines = "\n".join(
        f'- {f.key}: {f.label} — {f.description}' for f in config.fields
    )

    # Summarise already-filled fields
    filled = {
        k: v for k, v in (current_fields or {}).items()
        if v is not None and v != ""
    }
    current_fields_str = str(filled) if filled else "None yet."

    system_content = SYSTEM_PROMPT.format(
        doc_name=config.name,
        doc_description=config.description,
        field_list=field_lines if field_lines else "(no fill-in fields for this document)",
        today=today,
        prompt_fragment=config.prompt_fragment,
        current_fields=current_fields_str,
    )

    llm_messages = [{"role": "system", "content": system_content}]
    for msg in messages:
        llm_messages.append({"role": msg.role, "content": msg.content})

    response = completion(
        model=MODEL,
        messages=llm_messages,
        response_format=GenericChatResponse,
        reasoning_effort="low",
        extra_body=EXTRA_BODY,
        api_key=os.environ["OPENROUTER_API_KEY"],
    )

    raw = response.choices[0].message.content
    try:
        result = GenericChatResponse.model_validate_json(raw)
    except (ValidationError, ValueError):
        return GenericChatResponse(
            message=raw or "Sorry, something went wrong. Please try again.",
            fields={},
        )

    # Filter fields to only known keys for this document type
    known_keys = {f.key for f in config.fields}
    result.fields = {k: v for k, v in result.fields.items() if k in known_keys}
    return result
