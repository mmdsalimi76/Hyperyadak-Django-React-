#!/usr/bin/env pwsh
# One-command setup script for Todo App

Write-Host "Setting up Todo App..." -ForegroundColor Green

# Check if Docker is running
docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check if .env exists, if not create from example
if (-not (Test-Path .env)) {
    if (Test-Path .env.example) {
        Copy-Item .env.example .env
        Write-Host "Created .env file from example" -ForegroundColor Yellow
    } else {
        # Create default .env file
        @"
# Django
SECRET_KEY=test-secret-key-12345
DEBUG=1
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=todo_db
DB_USER=todo_user
DB_PASSWORD=todo_password123
DB_HOST=db
DB_PORT=5432

# Redis
REDIS_URL=redis://redis:6379/1
"@ | Out-File -FilePath .env -Encoding UTF8
        Write-Host "Created default .env file" -ForegroundColor Yellow
    }
}

# Create necessary directories
New-Item -ItemType Directory -Force -Path frontend/src -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path backend/scripts -ErrorAction SilentlyContinue

# Build containers (don't cache to ensure fresh install)
Write-Host "Building containers..." -ForegroundColor Green
docker compose build --no-cache

# Start services
Write-Host "Starting services..." -ForegroundColor Green
docker compose up -d

# Wait for services to be ready
Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Run migrations
Write-Host "Running migrations..." -ForegroundColor Green
docker compose exec backend python manage.py migrate

# Check if migrations succeeded
if ($LASTEXITCODE -eq 0) {
    Write-Host "Migrations completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Migrations failed. Check logs with: docker compose logs backend" -ForegroundColor Red
}

Write-Host "`nSetup complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "Admin:    http://localhost:8000/admin" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "`nUseful commands:" -ForegroundColor Yellow
Write-Host "  docker compose logs -f    - View all logs" -ForegroundColor White
Write-Host "  docker compose ps         - Check container status" -ForegroundColor White
Write-Host "  .\dev.ps1                 - Load dev functions" -ForegroundColor White
Write-Host "  then run: Up, Down, Migrate, etc." -ForegroundColor White