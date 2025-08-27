
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )/.." &> /dev/null && pwd )"
cd "$ROOT_DIR"

# ensure DBs are up
docker compose up -d postgres redis

# run backend + storefront in parallel
BACKEND_DIR="apps/backend"
STOREFRONT_DIR="apps/storefront"

# Find actual directories if custom names used
if [ ! -d "$BACKEND_DIR" ]; then
  BACKEND_DIR="$(ls -d apps/* | grep -E 'apps/.+[^/]' | head -n1)"
fi
if [ ! -d "$STOREFRONT_DIR" ]; then
  # pick the second dir if exists
  CANDIDATES=( $(ls -d apps/*) )
  if [ "${#CANDIDATES[@]}" -ge 2 ]; then
    STOREFRONT_DIR="${CANDIDATES[1]}"
  fi
fi

# Start processes
( cd "$BACKEND_DIR" && npm run dev ) &
BACK_PID=$!

if [ -d "$STOREFRONT_DIR" ]; then
  ( cd "$STOREFRONT_DIR" && npm run dev ) &
  FRONT_PID=$!
fi

echo "Dev servers running. Press Ctrl+C to stop."
trap "kill $BACK_PID ${FRONT_PID:-} 2>/dev/null || true" INT TERM
wait
