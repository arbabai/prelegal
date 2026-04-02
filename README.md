# Prelegal

**Legal agreements, drafted in minutes.**

Prelegal is a SaaS product that guides users through creating professional legal documents via a conversational AI assistant. Instead of staring at a blank contract template, users chat with an AI that asks the right questions and fills in the document as they go.

---

## What It Does

Users log in, pick a document type, and are presented with a split-screen interface:

- **Left panel** — An AI chat assistant that asks natural questions to gather the details needed for the document (party names, effective dates, governing law, fees, etc.)
- **Right panel** — A live document preview that updates in real time as the AI populates fields. Every field is also directly click-to-edit for manual corrections.

When done, users download a clean PDF with one click.

If a user asks the AI for a document type that isn't supported (e.g. a residential lease), the assistant explains what's available and suggests the closest match.

---

## Supported Document Types

All documents are based on [Common Paper](https://commonpaper.com) open-source standard terms.

| Document | Description |
|---|---|
| **Mutual NDA** | Non-disclosure agreement for two parties sharing confidential information |
| **Cloud Service Agreement** | Terms for selling/buying SaaS or cloud software |
| **Design Partner Agreement** | Early product access in exchange for structured feedback |
| **Service Level Agreement** | Uptime commitments, service credits, and termination rights |
| **Professional Services Agreement** | Consulting/services engagements with IP assignment and payment terms |
| **Data Processing Agreement** | GDPR-compliant data processor / controller terms |
| **Partnership Agreement** | Business partnership obligations, trademark licensing, and confidentiality |
| **Software License Agreement** | On-premise software licensing with usage restrictions |
| **Pilot Agreement** | Short-term product evaluation before a commercial commitment |
| **Business Associate Agreement** | HIPAA-compliant PHI handling between covered entity and business associate |
| **AI Addendum** | AI/ML service addendum covering input/output ownership and training restrictions |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend | Python 3.12, FastAPI, uv |
| AI | LiteLLM → OpenRouter → GPT-4o (Cerebras inference) with structured outputs |
| Database | SQLite (recreated fresh on each container start) |
| Packaging | Docker (multi-stage build), Docker Compose |

---

## Getting Started

### Prerequisites

- Docker and Docker Compose
- An [OpenRouter](https://openrouter.ai) API key

### Setup

1. Clone the repo
2. Create a `.env` file in the project root:
   ```
   OPENROUTER_API_KEY=your_key_here
   ```
3. Start the app:

   **Mac / Linux**
   ```bash
   ./scripts/start-mac.sh      # or start-linux.sh
   ```

   **Windows (PowerShell)**
   ```powershell
   .\scripts\start-windows.ps1
   ```

4. Open [http://localhost:8000](http://localhost:8000)

To stop:
```bash
./scripts/stop-mac.sh      # or stop-linux.sh / stop-windows.ps1
```

### Local Development (without Docker)

**Backend:**
```bash
cd backend
uv run uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev      # proxies /api/* to localhost:8000
```

---

## Project Structure

```
prelegal/
├── backend/
│   ├── models/chat.py          # Pydantic request/response models
│   ├── routers/chat.py         # POST /api/chat and /api/chat/generic
│   ├── services/
│   │   ├── nda_ai.py           # NDA-specific AI service
│   │   ├── generic_ai.py       # Generic AI service for all other doc types
│   │   └── doc_registry.py     # Field definitions for all 11 non-NDA document types
│   ├── tests/                  # 13 pytest tests
│   └── main.py                 # FastAPI app, DB init, static frontend serving
├── frontend/
│   ├── src/app/
│   │   ├── page.tsx            # Login screen (/)
│   │   ├── documents/          # Document selection grid (/documents)
│   │   ├── nda/                # Mutual NDA creator (/nda)
│   │   └── document/[slug]/    # Generic document creator (/document/[slug])
│   ├── src/components/
│   │   ├── ChatPanel.tsx       # AI chat UI (shared by all document types)
│   │   ├── NDADocument.tsx     # NDA-specific document renderer
│   │   ├── KeyTermsDocument.tsx# Generic document renderer
│   │   └── InlineEdit.tsx      # Shared inline-editable field components
│   ├── src/hooks/
│   │   ├── useNDAChat.ts       # NDA chat state management
│   │   └── useDocumentChat.ts  # Generic chat state management
│   └── src/lib/docConfigs.ts   # Frontend field registry for all document types
├── templates/                  # Source markdown templates (Common Paper standard terms)
├── catalog.json                # Document catalog (names, descriptions, template paths)
├── Dockerfile
└── docker-compose.yml
```

---

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/api/chat` | NDA AI chat — `{ messages, currentFields: NDAFieldUpdate }` |
| `POST` | `/api/chat/generic` | Generic AI chat — `{ documentType, messages, currentFields }` |

---

## Running Tests

```bash
cd backend
uv run pytest tests/ -v
```

---

## Roadmap

- Real authentication (sign up / sign in persisted to SQLite)
- Full standard terms rendered inline in each document preview
- Document history and saved drafts per user
- E-signature integration
