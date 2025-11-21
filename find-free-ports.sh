#!/bin/bash

# Script to find free ports and start Docker with them

echo "🔍 Finding free ports..."

# Function to check if port is free
is_port_free() {
    ! ss -tlnp | grep -q ":$1 " && ! lsof -ti:$1 >/dev/null 2>&1
}

# Find free frontend port (starting from 3000)
FRONTEND_PORT=3000
while ! is_port_free $FRONTEND_PORT; do
    FRONTEND_PORT=$((FRONTEND_PORT + 1))
    if [ $FRONTEND_PORT -gt 3100 ]; then
        echo "❌ Could not find free port for frontend (tried 3000-3100)"
        exit 1
    fi
done

# Find free backend port (starting from 5000)
BACKEND_PORT=5000
while ! is_port_free $BACKEND_PORT; do
    BACKEND_PORT=$((BACKEND_PORT + 1))
    if [ $BACKEND_PORT -gt 5100 ]; then
        echo "❌ Could not find free port for backend (tried 5000-5100)"
        exit 1
    fi
done

echo "✅ Found free ports:"
echo "   Frontend: $FRONTEND_PORT"
echo "   Backend: $BACKEND_PORT"
echo ""
echo "🚀 Starting Docker containers..."

export FRONTEND_PORT
export BACKEND_PORT

docker-compose -f docker-compose.custom.yml up --build

