#!/bin/bash

echo "🧹 Cleaning up Docker resources..."

# Stop and remove containers
echo "Stopping containers..."
docker-compose down 2>/dev/null || true

# Remove containers if they exist
docker rm -f it-asset-backend it-asset-frontend 2>/dev/null || true

# Kill processes on ports 5000 and 3000
echo "Freeing ports 5000 and 3000..."
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Wait a moment
sleep 2

echo "✅ Cleanup complete!"
echo ""
echo "You can now run: docker-compose up --build"

