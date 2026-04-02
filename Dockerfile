# ── Stage 1: Build the Next.js frontend ─────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

COPY frontend/ ./
RUN npm run build


# ── Stage 2: Run the FastAPI backend ────────────────────────────────
FROM python:3.12-slim AS runner
# Copy uv binary from the official uv image (avoids pip network download)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
WORKDIR /app

# Install Python dependencies (frozen ensures reproducible builds)
COPY backend/pyproject.toml backend/uv.lock backend/
RUN uv sync --directory backend --no-dev --frozen

# Copy backend source
COPY backend/main.py backend/

# Copy built frontend
COPY --from=frontend-builder /app/frontend/out frontend_build/

EXPOSE 8000

CMD ["uv", "run", "--directory", "backend", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
