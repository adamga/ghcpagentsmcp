#!/bin/bash
set -e

cleanup() {
  if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID"
  fi
  if [ -n "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID"
  fi
}

trap cleanup EXIT

export TEST_MODE=1
export JWT_SECRET="${JWT_SECRET:-$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")}"
bash backend/tests/copy-test-data.sh

(cd backend && node server.js) &
BACKEND_PID=$!

(cd frontend && ./node_modules/.bin/vite --host 0.0.0.0 --strictPort) &
FRONTEND_PID=$!

sleep 5

cd frontend && npx cypress run
TEST_RESULT=$?
cd ..

exit $TEST_RESULT
