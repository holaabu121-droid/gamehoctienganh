param(
    [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$pythonPath = Join-Path $projectRoot "backend\.venv\Scripts\python.exe"
$frontendRoot = Join-Path $projectRoot "frontend"
$frontendIndex = Join-Path $frontendRoot "dist\index.html"
$runDirectory = Join-Path $projectRoot ".run"
$backendUrl = "http://127.0.0.1:8000/health"
$backendCoursesUrl = "http://127.0.0.1:8000/courses"
$backendOpenApiUrl = "http://127.0.0.1:8000/openapi.json"
$frontendUrl = "http://127.0.0.1:4173/"

function Test-EnglishQuestUrl {
    param([Parameter(Mandatory = $true)][string]$Url)

    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2
        return $response.StatusCode -eq 200
    }
    catch {
        return $false
    }
}

function Wait-EnglishQuestUrl {
    param(
        [Parameter(Mandatory = $true)][string]$Url,
        [Parameter(Mandatory = $true)][string]$ServiceName
    )

    for ($attempt = 0; $attempt -lt 30; $attempt += 1) {
        if (Test-EnglishQuestUrl -Url $Url) {
            return
        }
        Start-Sleep -Milliseconds 500
    }

    throw "$ServiceName khong san sang tai $Url. Xem log trong $runDirectory."
}

function Test-EnglishQuestBackendCompatible {
    try {
        $catalog = Invoke-RestMethod -Uri $backendCoursesUrl -TimeoutSec 2
        $schema = Invoke-RestMethod -Uri $backendOpenApiUrl -TimeoutSec 2
        return `
            $catalog.default_course_id -eq "english-6-semester-1" -and `
            $null -ne $schema.paths."/courses" -and `
            $null -ne $schema.paths."/profile/overview"
    }
    catch {
        return $false
    }
}

function Stop-ManagedEnglishQuestBackend {
    $pidFile = Join-Path $runDirectory "backend.pid"
    if (-not (Test-Path -LiteralPath $pidFile)) {
        return $false
    }

    $processId = (Get-Content -LiteralPath $pidFile -Raw).Trim()
    if ($processId -notmatch "^\d+$") {
        return $false
    }

    $process = Get-Process -Id ([int]$processId) -ErrorAction SilentlyContinue
    if ($null -eq $process) {
        return $false
    }

    Stop-Process -Id $process.Id -Force
    Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
    return $true
}

if (-not (Test-Path -LiteralPath $pythonPath)) {
    throw "Khong tim thay Python cua du an: $pythonPath"
}
if (-not (Test-Path -LiteralPath $frontendIndex)) {
    throw "Khong tim thay frontend da build: $frontendIndex"
}

New-Item -ItemType Directory -Path $runDirectory -Force | Out-Null

if ((Test-EnglishQuestUrl -Url $backendUrl) -and -not (Test-EnglishQuestBackendCompatible)) {
    if (-not (Stop-ManagedEnglishQuestBackend)) {
        throw "Backend cu dang chiem cong 8000 nhung khong co API moi. Hay chay STOP_ENGLISH_QUEST.bat, dong tien trinh cu, roi khoi dong lai. Du lieu hoc sinh khong can xoa."
    }
}

if (-not (Test-EnglishQuestBackendCompatible)) {
    $backendProcess = Start-Process `
        -FilePath $pythonPath `
        -ArgumentList @("-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", "8000") `
        -WorkingDirectory $projectRoot `
        -WindowStyle Hidden `
        -RedirectStandardOutput (Join-Path $runDirectory "backend.out.log") `
        -RedirectStandardError (Join-Path $runDirectory "backend.err.log") `
        -PassThru
    Set-Content -LiteralPath (Join-Path $runDirectory "backend.pid") -Value $backendProcess.Id
}

if (-not (Test-EnglishQuestUrl -Url $frontendUrl)) {
    $frontendProcess = Start-Process `
        -FilePath $pythonPath `
        -ArgumentList @("-m", "http.server", "4173", "--bind", "127.0.0.1", "--directory", "dist") `
        -WorkingDirectory $frontendRoot `
        -WindowStyle Hidden `
        -RedirectStandardOutput (Join-Path $runDirectory "frontend.out.log") `
        -RedirectStandardError (Join-Path $runDirectory "frontend.err.log") `
        -PassThru
    Set-Content -LiteralPath (Join-Path $runDirectory "frontend.pid") -Value $frontendProcess.Id
}

Wait-EnglishQuestUrl -Url $backendUrl -ServiceName "Backend"
if (-not (Test-EnglishQuestBackendCompatible)) {
    throw "Backend da khoi dong nhung thieu /courses hoac /profile/overview. Xem log trong $runDirectory."
}
Wait-EnglishQuestUrl -Url $frontendUrl -ServiceName "Frontend"

Write-Host "English Quest da san sang:" -ForegroundColor Green
Write-Host "  Giao dien: $frontendUrl"
Write-Host "  Backend:   $backendUrl"

if (-not $NoBrowser) {
    Start-Process -FilePath $frontendUrl
}
