#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
echo "Starting Prelegal..."
docker compose up --build -d
echo "Prelegal is running at http://localhost:8000"
