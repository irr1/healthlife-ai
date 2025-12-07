#!/bin/bash

# HealthLife AI Setup Script

echo "🏥 Setting up HealthLife AI..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.11+ first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Docker is recommended but optional."
fi

echo "📦 Installing frontend dependencies..."
cd apps/web
npm install
cd ../..

echo "🐍 Installing backend dependencies..."
cd apps/backend
pip install -r requirements.txt
cd ../..

echo "📝 Setting up environment files..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created root .env file"
fi

if [ ! -f apps/web/.env.local ]; then
    cp apps/web/.env.example apps/web/.env.local
    echo "Created web .env.local file"
fi

if [ ! -f apps/backend/.env ]; then
    cp apps/backend/.env.example apps/backend/.env
    echo "Created backend .env file"
fi

echo "🐳 Starting Docker services..."
docker-compose up -d postgres redis

echo "⏳ Waiting for databases to be ready..."
sleep 5

echo "🗄️  Running database migrations..."
cd apps/backend
# Uncomment when alembic is set up
# alembic upgrade head
cd ../..

echo "✅ Setup complete!"
echo ""
echo "To start the development servers:"
echo "  npm run dev"
echo ""
echo "Or start them separately:"
echo "  npm run dev:web     # Frontend at http://localhost:3000"
echo "  npm run dev:backend # Backend at http://localhost:8000"
echo ""
echo "API Documentation will be available at:"
echo "  http://localhost:8000/api/v1/docs"
