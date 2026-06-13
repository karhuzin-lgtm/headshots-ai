#!/usr/bin/env bash
# Фулл-бэкап проекта одной командой: npm run backup
# Архивирует ВСЁ (включая .git с историей и .env.local),
# кроме пересобираемого мусора (node_modules, .next, .vercel).
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT_NAME="$(basename "$PROJECT_DIR")"
BACKUP_DIR="$HOME/Backups/$PROJECT_NAME"
STAMP="$(date +%Y-%m-%d_%H-%M-%S)"
ARCHIVE="$BACKUP_DIR/${PROJECT_NAME}_${STAMP}.tar.gz"

mkdir -p "$BACKUP_DIR"

tar -czf "$ARCHIVE" \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.vercel' \
  --exclude='.DS_Store' \
  --exclude='tsconfig.tsbuildinfo' \
  -C "$(dirname "$PROJECT_DIR")" \
  "$PROJECT_NAME"

SIZE="$(du -h "$ARCHIVE" | cut -f1 | tr -d ' ')"
echo "✅ Бэкап готов: $ARCHIVE ($SIZE)"
echo "   Восстановление: tar -xzf '$ARCHIVE' -C <куда> && cd $PROJECT_NAME && npm install"
