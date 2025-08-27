
#!/usr/bin/env bash
set -euo pipefail

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

ROOT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )/.." &> /dev/null && pwd )"
cd "$ROOT_DIR"

echo -e "${CYAN}==> Checking prerequisites...${NC}"
command -v node >/dev/null 2>&1 || { echo "Node.js is required"; exit 1; }
command -v npx >/dev/null 2>&1 || { echo "npm is required"; exit 1; }

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "Node.js >= 20 is required. Current: $(node -v)"
  exit 1
fi

# Create apps folder
mkdir -p apps

APP_NAME="${1:-backend}"
STORE_NAME="${2:-storefront}"

echo -e "${CYAN}==> Creating Medusa backend in apps/${APP_NAME} ...${NC}"
npx create-medusa-app@latest "apps/${APP_NAME}" --no-browser --db-url "postgres://medusa:medusa@localhost:5432/medusa?sslmode=disable" --with-nextjs-starter

# The CLI creates the storefront alongside the backend as <project-name>-storefront.
# Move it into apps/storefront for a clean monorepo layout.
SF_DIR="$(ls -d apps/${APP_NAME}-storefront* 2>/dev/null | head -n1 || true)"
if [ -n "$SF_DIR" ]; then
  mkdir -p apps
  mv "$SF_DIR" "apps/${STORE_NAME}"
fi

# Create .env samples
cat > apps/${APP_NAME}/.env <<'EOF'
# --- Medusa Backend (development) ---
DATABASE_URL=postgres://medusa:medusa@localhost:5432/medusa
REDIS_URL=redis://localhost:6379

# CORS
ADMIN_CORS=http://localhost:7000,http://localhost:7001
STORE_CORS=http://localhost:8000

# JWT / COOKIE (set your own in production)
JWT_SECRET=insecure_dev_jwt_secret
COOKIE_SECRET=insecure_dev_cookie_secret
EOF

cat > apps/${APP_NAME}/.env.production <<'EOF'
# --- Medusa Backend (production example) ---
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DBNAME
REDIS_URL=redis://HOST:6379

ADMIN_CORS=https://admin.example.com,https://api.example.com
STORE_CORS=https://shop.example.com
JWT_SECRET=change_me
COOKIE_SECRET=change_me_too
EOF

# Next.js storefront env
if [ -d "apps/${STORE_NAME}" ]; then
  cat > "apps/${STORE_NAME}/.env.local" <<'EOF'
# --- Next.js Storefront ---
NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000
EOF
fi

echo -e "${CYAN}==> Initializing git (if not already)...${NC}"
git init >/dev/null 2>&1 || true
git add .
git commit -m "chore: bootstrap medusa stack (backend + storefront)" >/dev/null 2>&1 || true

echo -e "${GREEN}Done!${NC}"
echo "Next steps:"
echo "  1) npm run db:up         # Start Postgres & Redis"
echo "  2) npm run dev           # Run backend and storefront in dev mode"
echo "  3) Configure Git remote: git remote add origin <your-repo-url> && git push -u origin main"
