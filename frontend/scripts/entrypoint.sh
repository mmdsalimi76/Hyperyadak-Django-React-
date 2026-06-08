#!/bin/sh
set -e

# Check if node_modules exists, if not install
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci
fi

# Check if we need to create the React app
if [ ! -f "package.json" ]; then
    echo "Creating React app..."
    npm create vite@latest . -- --template react
    npm install
fi

# Execute the command
exec "$@"