# Chay frontend va mo trinh duyet
$FE_PATH = $PSScriptRoot
Set-Location $FE_PATH

Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "Dang mo trinh duyet..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

# -s = single page app (redirect 404 -> index.html), -l 3000 = port, bind moi interface
npx --yes serve -s -l 3000 --no-clipboard
