#!/bin/bash
set -e

cd /app

# Always install dependencies to ensure everything is up to date
echo "Installing dependencies..."
# Force clean install to avoid any issues
rm -rf node_modules
npm install
# Ensure @angular-devkit/build-angular is installed with the exact version needed
echo "Installing @angular-devkit/build-angular explicitly..."
npm install @angular-devkit/build-angular@16.0.0 --save-dev

# Check if Angular CLI is installed globally
if ! command -v ng &> /dev/null; then
    echo "Installing Angular CLI globally..."
    npm install -g @angular/cli
fi

# Start Angular development server
echo "Starting Angular development server..."
npm start -- --host 0.0.0.0
