#!/usr/bin/env bash
# =============================================================
# build-for-cpanel.sh
# Run this locally before uploading to Hostinger cPanel
# =============================================================
set -e

FRONTEND_DIR="$(cd "$(dirname "$0")/frontend" && pwd)"
OUTPUT_DIR="$FRONTEND_DIR/.next/standalone"
DIST_ZIP="$(dirname "$0")/cpanel-deploy.zip"

echo "==> Installing dependencies..."
cd "$FRONTEND_DIR"
npm ci --legacy-peer-deps

echo "==> Building Next.js for production..."
NEXT_PUBLIC_API_URL=https://api.insurance.careerxera.com \
NEXT_PUBLIC_APP_NAME=SunischistInsurance \
npm run build

echo "==> Copying public/ and static assets into standalone..."
cp -r "$FRONTEND_DIR/public"          "$OUTPUT_DIR/public"
cp -r "$FRONTEND_DIR/.next/static"    "$OUTPUT_DIR/.next/static"

echo "==> Copying PM2 config..."
cp "$FRONTEND_DIR/ecosystem.config.js" "$OUTPUT_DIR/ecosystem.config.js"

echo "==> Copying PHP backend into standalone/api/ ..."
BACKEND_DIR="$(dirname "$0")/backend"
cp -r "$BACKEND_DIR" "$OUTPUT_DIR/api"
# Remove backend's own .env from zip for security — create it manually on server
rm -f "$OUTPUT_DIR/api/.env"

echo "==> Creating deployment zip..."
cd "$OUTPUT_DIR"
zip -r "$DIST_ZIP" . --exclude "*.map"

echo ""
echo "✅  Done!  Upload  cpanel-deploy.zip  to Hostinger via File Manager."
echo "    Extract it into the Node.js app root (e.g. /home/<user>/insurance.careerxera.com/)"
echo "    Then restart the Node.js app in cPanel."
