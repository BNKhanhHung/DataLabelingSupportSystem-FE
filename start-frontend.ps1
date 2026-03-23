# Chay frontend va mo trinh duyet
$FE_PATH = $PSScriptRoot
Set-Location $FE_PATH

Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "Dang mo trinh duyet..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

# Khong dung -s: tranh vong lap /login -> index.html -> login.html -> /login
npx --yes serve -l 3000 --no-clipboard
