#!/bin/bash

# Setup script for Balaji Sweets Automation Testing Framework
# This script installs dependencies and prepares the testing environment

echo "🍬 Setting up Balaji Sweets Automation Testing Framework..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18 or higher) first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version is below 18. Please upgrade to Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install npm dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Install Playwright browsers
echo "🎭 Installing Playwright browsers..."
npx playwright install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Playwright browsers"
    exit 1
fi

echo "✅ Playwright browsers installed"
echo ""

# Create test-results directory
echo "📁 Creating test-results directory..."
mkdir -p test-results

echo "✅ Setup complete!"
echo ""
echo "🚀 Quick Start Commands:"
echo "   npm test              - Run all tests"
echo "   npm run test:ui       - Run tests in UI mode"
echo "   npm run test:chrome   - Run tests in Chrome only"
echo "   npm run report        - View test report"
echo ""
echo "📖 Documentation:"
echo "   tests/README.md       - Testing framework documentation"
echo "   test-cases.md         - Manual test cases"
echo ""
echo "Happy Testing! 🧪"
