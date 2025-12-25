# LoadBright - Start Script
# This script starts both the frontend and backend servers

Write-Host "🚀 Starting LoadBright Route Optimization System..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Starting servers..." -ForegroundColor Yellow
Write-Host "  - Backend API: http://localhost:3001" -ForegroundColor Cyan
Write-Host "  - Frontend:    http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start both servers using concurrently
npm run dev:all
