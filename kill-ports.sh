#!/bin/bash

# Script to kill processes on ports 3000 and 5000

echo "🔍 Checking for processes on ports 3000 and 5000..."

# Function to kill process on a port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port 2>/dev/null)
    
    if [ -z "$pid" ]; then
        echo "✅ Port $port is free"
        return 0
    fi
    
    echo "🛑 Found process $pid on port $port, killing..."
    kill -9 $pid 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Port $port is now free"
    else
        echo "❌ Failed to kill process on port $port (may need sudo)"
        echo "   Try: sudo lsof -ti:$port | xargs sudo kill -9"
    fi
}

kill_port 3000
kill_port 5000

echo ""
echo "✅ Done! You can now run: npm run dev"

