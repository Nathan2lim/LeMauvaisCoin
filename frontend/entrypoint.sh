#!/bin/bash
set -e

cd /app

# Check if node_modules exists in the volume, if not install dependencies
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.install-state" ]; then
    echo "Installing dependencies..."
    npm install
    # Create a marker file to indicate successful installation
    touch node_modules/.install-state
else
    echo "Dependencies already installed, checking for updates..."
    # Only check for new dependencies if package.json is newer than the install state
    if [ "package.json" -nt "node_modules/.install-state" ]; then
        echo "Package.json updated, installing new dependencies..."
        npm install
        touch node_modules/.install-state
    fi
fi

# Check if Angular CLI is installed globally
if ! command -v ng &> /dev/null; then
    echo "Installing Angular CLI globally..."
    npm install -g @angular/cli
fi

# Start Angular development server with file watching enabled
echo "Starting Angular development server with file watching..."
npm run start:watch
