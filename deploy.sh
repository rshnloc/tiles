#!/usr/bin/env bash
# =============================================================
# deploy.sh — SunischistInsurance Production Deploy
# Domain : insurance.careerxera.com
# Server : Ubuntu 22.04 / Debian 12 VPS
# Run as : root or a user with sudo + docker access
# =============================================================
set -euo pipefail

DOMAIN="insurance.careerxera.com"
REPO_DIR="/opt/tiles"          # where the project lives on the server
EMAIL="your@email.com"         # for Let's Encrypt notifications  ← CHANGE

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

# ─────────────────────────────────────────────────────────────
# STEP 1 — System dependencies
# ─────────────────────────────────────────────────────────────
install_deps() {
  info "Installing Docker, Docker Compose, Certbot..."
  apt-get update -qq
  apt-get install -y -qq ca-certificates curl gnupg lsb-release certbot

  # Docker (official repo)
  if ! command -v docker &>/dev/null; then
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
      | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
      https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
      > /etc/apt/sources.list.d/docker.list
    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin
    systemctl enable --now docker
    info "Docker installed."
  else
    info "Docker already installed — skipping."
  fi
}

# ─────────────────────────────────────────────────────────────
# STEP 2 — Clone / pull latest code
# ─────────────────────────────────────────────────────────────
pull_code() {
  if [[ -d "$REPO_DIR/.git" ]]; then
    info "Pulling latest code..."
    git -C "$REPO_DIR" pull --rebase
  else
    info "Cloning repo into $REPO_DIR..."
    git clone https://github.com/rshnloc/tiles.git "$REPO_DIR"
  fi
}

# ─────────────────────────────────────────────────────────────
# STEP 3 — Write .env (only if not already present)
# ─────────────────────────────────────────────────────────────
setup_env() {
  if [[ -f "$REPO_DIR/.env" ]]; then
    warn ".env already exists — skipping. Edit $REPO_DIR/.env manually if needed."
    return
  fi

  info "Creating .env from template..."
  DB_PASS=$(openssl rand -hex 24)
  ROOT_PASS=$(openssl rand -hex 24)
  JWT_SEC=$(openssl rand -hex 64)

  cat > "$REPO_DIR/.env" <<EOF
APP_ENV=production
APP_URL=https://${DOMAIN}

MYSQL_ROOT_PASSWORD=${ROOT_PASS}
DB_PASSWORD=${DB_PASS}
DB_HOST=mysql
DB_NAME=tiles_insurance
DB_USER=tiles_user

JWT_SECRET=${JWT_SEC}

NEXT_PUBLIC_API_URL=https://${DOMAIN}/api
NEXT_PUBLIC_APP_NAME=SunischistInsurance
NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_REPLACE_WITH_YOUR_KEY
EOF
  info ".env created with auto-generated secrets. Save the passwords somewhere safe:"
  echo "  MySQL root : ${ROOT_PASS}"
  echo "  App DB pass: ${DB_PASS}"
}

# ─────────────────────────────────────────────────────────────
# STEP 4 — Obtain SSL cert (first time only, HTTP mode)
# ─────────────────────────────────────────────────────────────
obtain_ssl() {
  if [[ -d "/etc/letsencrypt/live/${DOMAIN}" ]]; then
    info "SSL cert already exists — skipping issuance."
    return
  fi

  info "Temporarily starting Nginx in HTTP-only mode for ACME challenge..."
  mkdir -p /var/www/certbot

  # Swap to http-only nginx config
  cp "$REPO_DIR/nginx/default.conf" "$REPO_DIR/nginx/default.conf.bak"
  cp "$REPO_DIR/nginx/http-only.conf" "$REPO_DIR/nginx/default.conf"

  # Start only nginx (frontend + backend need to be up for proxy to work)
  docker compose -f "$REPO_DIR/docker-compose.yml" --env-file "$REPO_DIR/.env" \
    up -d --build nginx frontend backend mysql

  sleep 8

  info "Requesting Let's Encrypt certificate for ${DOMAIN}..."
  certbot certonly \
    --webroot -w /var/www/certbot \
    -d "${DOMAIN}" \
    --email "${EMAIL}" \
    --agree-tos --non-interactive --expand

  # Restore full HTTPS config
  cp "$REPO_DIR/nginx/default.conf.bak" "$REPO_DIR/nginx/default.conf"
  info "SSL certificate obtained successfully."
}

# ─────────────────────────────────────────────────────────────
# STEP 5 — Build & launch all containers
# ─────────────────────────────────────────────────────────────
deploy() {
  info "Building and starting all services..."
  docker compose -f "$REPO_DIR/docker-compose.yml" --env-file "$REPO_DIR/.env" \
    up -d --build --remove-orphans

  info "Waiting for MySQL to be healthy..."
  local attempts=0
  until docker exec tiles_mysql mysqladmin ping -uroot -p"$(grep MYSQL_ROOT_PASSWORD "$REPO_DIR/.env" | cut -d= -f2)" --silent 2>/dev/null; do
    attempts=$((attempts + 1))
    [[ $attempts -ge 30 ]] && error "MySQL did not become healthy in time."
    sleep 3
  done
  info "MySQL is healthy."
}

# ─────────────────────────────────────────────────────────────
# STEP 6 — Smoke test
# ─────────────────────────────────────────────────────────────
smoke_test() {
  info "Running smoke tests..."
  sleep 5

  HTTP_CODE=$(curl -skL -o /dev/null -w "%{http_code}" "https://${DOMAIN}" || true)
  if [[ "$HTTP_CODE" == "200" ]]; then
    info "✅  Frontend reachable — HTTP ${HTTP_CODE}"
  else
    warn "⚠️  Frontend returned HTTP ${HTTP_CODE} — check logs: docker compose logs nginx"
  fi

  API_CODE=$(curl -skL -o /dev/null -w "%{http_code}" "https://${DOMAIN}/api/health" || true)
  info "Backend /api/health — HTTP ${API_CODE}"
}

# ─────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────
main() {
  [[ $EUID -ne 0 ]] && error "Run as root: sudo bash deploy.sh"

  info "=== SunischistInsurance Deployment — ${DOMAIN} ==="
  install_deps
  pull_code
  setup_env
  obtain_ssl
  deploy
  smoke_test

  echo ""
  info "🚀  Deployment complete!"
  info "    Site  : https://${DOMAIN}"
  info "    Logs  : docker compose -f $REPO_DIR/docker-compose.yml logs -f"
  info "    Status: docker compose -f $REPO_DIR/docker-compose.yml ps"
}

main "$@"
