# Catalyst Deployment Script for Crime Intelligence Platform
# Run from the project root directory

$CATALYST_CLI = ".\jcode-windows-x86_64.exe"

Write-Host "=== Crime Intelligence Platform - Catalyst Deployment ===" -ForegroundColor Cyan

# Step 1: Verify Catalyst CLI
Write-Host "`n[1/6] Checking Catalyst CLI..." -ForegroundColor Yellow
if (-not (Test-Path $CATALYST_CLI)) {
    Write-Host "ERROR: Catalyst CLI not found at $CATALYST_CLI" -ForegroundColor Red
    exit 1
}
Write-Host "Catalyst CLI found." -ForegroundColor Green

# Step 2: Login
Write-Host "`n[2/6] Logging into Zoho Catalyst..." -ForegroundColor Yellow
& $CATALYST_CLI login
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Login failed" -ForegroundColor Red
    exit 1
}
Write-Host "Login successful." -ForegroundColor Green

# Step 3: Initialize Data Store schema
Write-Host "`n[3/6] Initializing Catalyst Data Store..." -ForegroundColor Yellow
Write-Host "  -> Creating Data Store tables via Catalyst Console" -ForegroundColor Gray
Write-Host "  -> Or run: python backend/catalyst_init.py (if Catalyst Data Store is connected)" -ForegroundColor Gray

# Step 4: Build and Deploy Frontend
Write-Host "`n[4/6] Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install
npm run build
Set-Location ..
Write-Host "Frontend built successfully." -ForegroundColor Green

Write-Host "`n[5/6] Deploying frontend as Catalyst Client..." -ForegroundColor Yellow
& $CATALYST_CLI deploy --client
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Frontend deploy may have failed. Check Catalyst Console." -ForegroundColor Yellow
} else {
    Write-Host "Frontend deployed successfully." -ForegroundColor Green
}

# Step 6: Deploy Backend via AppSail
Write-Host "`n[6/6] Deploying backend via Catalyst AppSail..." -ForegroundColor Yellow
& $CATALYST_CLI deploy --appsail
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Backend deploy may have failed. Check Catalyst Console." -ForegroundColor Yellow
} else {
    Write-Host "Backend deployed successfully." -ForegroundColor Green
}

Write-Host "`n=== Deployment Complete ===" -ForegroundColor Cyan
Write-Host "`nYour application will be available at:" -ForegroundColor White
Write-Host "  Frontend: https://project-rainfall-60080036641.development.catalystserverless.com" -ForegroundColor Green
Write-Host "  Backend API: https://crime-intelligence-backend-60080036641.development.catalystserverless.com" -ForegroundColor Green
Write-Host "  API Docs: https://crime-intelligence-backend-60080036641.development.catalystserverless.com/docs" -ForegroundColor Green
