$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$runDirectory = Join-Path $projectRoot ".run"
$stopped = 0

foreach ($serviceName in @("backend", "frontend")) {
    $pidFile = Join-Path $runDirectory "$serviceName.pid"
    if (-not (Test-Path -LiteralPath $pidFile)) {
        continue
    }

    $processId = (Get-Content -LiteralPath $pidFile -Raw).Trim()
    if ($processId -match "^\d+$") {
        $process = Get-Process -Id ([int]$processId) -ErrorAction SilentlyContinue
        if ($null -ne $process) {
            Stop-Process -Id $process.Id -Force
            $stopped += 1
        }
    }
    Remove-Item -LiteralPath $pidFile -Force
}

if ($stopped -gt 0) {
    Write-Host "Da dung $stopped tien trinh English Quest." -ForegroundColor Green
}
else {
    Write-Host "Khong co tien trinh English Quest nao do launcher quan ly."
}
