# LoadBright - Start Backend Only
# This script starts only the backend server

Write-Host "🚀 Starting LoadBright Backend Server..." -ForegroundColor Green
Write-Host ""
Write-Host "Backend API will be available at: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path ".\server"
npm run dev
