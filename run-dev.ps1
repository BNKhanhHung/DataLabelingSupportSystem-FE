# Chay Backend va Frontend song song (mo 2 cua so terminal)
# Backend: Spring Boot - http://localhost:8080
# Frontend: Static server - http://localhost:3000

$FE_PATH = $PSScriptRoot
$BE_PATH = (Resolve-Path (Join-Path $FE_PATH "..\DataLabelingSupportSystem-BE")).Path

Write-Host "=== Data Labeling Support System - Dev Mode ===" -ForegroundColor Cyan
Write-Host ""

# 1. Mo terminal moi chay Backend (Spring Boot)
$beCmd = "cd '$BE_PATH'; mvn spring-boot:run"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $beCmd

Write-Host "[OK] Backend dang chay trong cua so moi (port 8080)" -ForegroundColor Green
Start-Sleep -Seconds 2

# 2. Chay Frontend tai terminal hien tai
$hasNode = Get-Command npx -ErrorAction SilentlyContinue
$hasPython = Get-Command python -ErrorAction SilentlyContinue

if ($hasNode) {
    Write-Host "[OK] Frontend: npx serve -l 3000" -ForegroundColor Green
    Set-Location $FE_PATH
    # KHONG dung -s: voi SPA mode, /login tro ve index.html -> vong lap chuyen huong voi login.html
    npx --yes serve -l 3000
} elseif ($hasPython) {
    Write-Host "[OK] Frontend: Python http.server 3000" -ForegroundColor Green
    Set-Location $FE_PATH
    python -m http.server 3000
} else {
    Write-Host "Loi: Can Node.js (npx) hoac Python de chay frontend." -ForegroundColor Red
    exit 1
}
