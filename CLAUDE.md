# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

~~Before we start: The initial implementation is front-end only prototype that only supports the Mutual NDA documents with no AI chat.~~

The project now has a full-stack foundation with AI chat (see Implementation Status below). The NDA creator remains the only supported document.

## Development process

When instructed to build a feature:
1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools

## AI design

When writing code to make calls to LLMs, use your Cerebras skill to use LiteLLM via OpenRouter to the `openrouter/openai/gpt-oss-120b` model with Cerebras as the inference provider. You should use Structured Outputs so that you can interpret the results and populate fields in the legal document.

There is an OPENROUTER_API_KEY in the .env file in the project root.

## Technical design

The entire project should be packaged into a Docker container.  
The backend should be in backend/ and be a uv project, using FastAPI.  
The frontend should be in frontend/  
The database should use SQLLite and be created from scratch each time the Docker container is brought up, allowing for a users table with sign up and sign in.  
Consider statically building the frontend and serving it via FastAPI, if that will work.  
There should be scripts in scripts/ for:  
```bash
# Mac
scripts/start-mac.sh    # Start
scripts/stop-mac.sh     # Stop

# Linux
scripts/start-linux.sh
scripts/stop-linux.sh

# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1
```
Backend available at http://localhost:8000

## Color Scheme
- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`


## Implementation Status

### Completed (PL-1 → PL-5)

**Frontend** (`frontend/`)
- Next.js 16 + React 19 + TypeScript + Tailwind CSS v4
- Static export (`output: "export"`) — built to `frontend/out/`, served by FastAPI
- `/` — Login screen (fake auth, navigates to `/nda` on submit)
- `/nda` — Mutual NDA Creator: AI chat panel (left) + live document preview (right), PDF via `window.print()`
  - AI sends an opening message on load and asks conversational questions to populate fields
  - All NDA cover page and signature fields are inline-editable directly in the document
  - `useNDAChat` hook manages messages + form state; stale-closure-safe via `useRef` pattern
  - `deepMerge` with null filtering for partial AI field patches

**Backend** (`backend/`)
- FastAPI + uv project; runs at `http://localhost:8000`
- SQLite DB at `backend/data/prelegal.db`, recreated fresh on each container start
- `users` table: `id`, `email`, `password_hash`, `created_at`
- `POST /api/chat` — AI chat endpoint; returns `{ message, fields }` JSON
  - `backend/models/chat.py` — Pydantic models (`ChatRequest`, `ChatResponse`, `NDAFieldUpdate`)
  - `backend/services/nda_ai.py` — LiteLLM call with structured outputs + graceful fallback
  - `backend/routers/chat.py` — FastAPI router
- Catch-all route serves the static frontend (path-traversal safe)
- `GET /health` endpoint
- Tests in `backend/tests/` (`test_main.py` + `test_chat.py`)
- Dependencies: `litellm`, `python-dotenv` (in addition to `fastapi`, `uvicorn`)

**Infrastructure**
- Multi-stage `Dockerfile`: Node 20 builds frontend → Python 3.12 + uv serves backend
- uv binary copied from `ghcr.io/astral-sh/uv:latest` (no pip install needed)
- `docker-compose.yml`: `docker compose up --build` starts everything on port 8000
- `scripts/start-{mac,linux}.sh`, `scripts/stop-{mac,linux}.sh`
- `scripts/start-windows.ps1`, `scripts/stop-windows.ps1`
- `.env` at project root must contain `OPENROUTER_API_KEY` for AI chat to work

### Not yet implemented
- Real authentication (sign up / sign in against the DB)
- Support for documents other than Mutual NDA
