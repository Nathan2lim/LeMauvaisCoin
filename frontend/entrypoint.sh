#!/bin/bash
set -e

cd /app

# Install dependencies if node_modules doesn't exist or force reinstall
if [ ! -d "node_modules" ] || [ "$FORCE_INSTALL" = "true" ]; then
    echo "Installing dependencies..."
    npm install
    # Ensure @angular-devkit/build-angular is installed
    if [ ! -d "node_modules/@angular-devkit/build-angular" ]; then
        echo "Installing @angular-devkit/build-angular explicitly..."
        npm install @angular-devkit/build-angular --save-dev
    fi
else
    echo "Dependencies already installed."
fi

# Check if Angular CLI is installed globally
if ! command -v ng &> /dev/null; then
    echo "Installing Angular CLI globally..."
    npm install -g @angular/cli
fi

# Start Angular development server
echo "Starting Angular development server..."
npm start -- --host 0.0.0.0
