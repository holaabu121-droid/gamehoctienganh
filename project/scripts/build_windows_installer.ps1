param(
    [string]$Version = "",
    [string]$InnoCompiler = $env:INNO_SETUP_COMPILER,
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$frontendRoot = Join-Path $projectRoot "frontend"
$packagingVenv = Join-Path $projectRoot ".packaging-venv"
$packagingPython = Join-Path $packagingVenv "Scripts\python.exe"
$pyInstaller = Join-Path $packagingVenv "Scripts\pyinstaller.exe"
$distRoot = Join-Path $projectRoot "build\windows"
$workRoot = Join-Path $projectRoot "build\pyinstaller"
$releaseRoot = Join-Path $projectRoot "release"
$packagingTemp = Join-Path $projectRoot ".run\packaging-temp"
New-Item -ItemType Directory -Path $packagingTemp -Force | Out-Null
$env:TEMP = $packagingTemp
$env:TMP = $packagingTemp

$versionSource = Join-Path $projectRoot "VERSION"
if (-not (Test-Path -LiteralPath $versionSource)) {
    throw "The canonical VERSION file is missing."
}
$sourceVersion = (Get-Content -LiteralPath $versionSource -Raw).Trim()
if (-not $Version) { $Version = $sourceVersion }
if ($Version -ne $sourceVersion) {
    throw "Requested version $Version does not match canonical VERSION $sourceVersion."
}

if ($Version -notmatch '^\d+\.\d+\.\d+(?:[.-][A-Za-z0-9]+)*$') {
    throw "Version must use a safe semantic form such as 1.0.0 or 1.1.0-beta1."
}
$versionFile = Join-Path $projectRoot "packaging\build_version.py"
"APP_VERSION = `"$Version`"" | Set-Content -LiteralPath $versionFile -Encoding utf8

$packageJsonPath = Join-Path $frontendRoot "package.json"
$packageJson = Get-Content -LiteralPath $packageJsonPath -Raw | ConvertFrom-Json
if ($packageJson.version -ne $Version) {
    throw "frontend/package.json version $($packageJson.version) does not match canonical VERSION $Version."
}

if (-not $SkipTests) {
    Push-Location $frontendRoot
    try {
        & pnpm test
        if ($LASTEXITCODE -ne 0) { throw "Frontend tests failed." }
        & pnpm run build
        if ($LASTEXITCODE -ne 0) { throw "Frontend build failed." }
    }
    finally { Pop-Location }

    Push-Location $projectRoot
    try {
        & python -m unittest discover -s backend/tests -v
        if ($LASTEXITCODE -ne 0) { throw "Backend tests failed." }
    }
    finally { Pop-Location }
}
else {
    Push-Location $frontendRoot
    try {
        & pnpm run build
        if ($LASTEXITCODE -ne 0) { throw "Frontend build failed." }
    }
    finally { Pop-Location }
}

if (-not (Test-Path -LiteralPath $packagingPython)) {
    & python -m venv $packagingVenv
    if ($LASTEXITCODE -ne 0) { throw "Could not create the packaging virtual environment." }
}

if (-not (Test-Path -LiteralPath $pyInstaller)) {
    & $packagingPython -m pip install -r (Join-Path $projectRoot "backend\requirements.txt") -r (Join-Path $projectRoot "packaging\requirements.txt")
    if ($LASTEXITCODE -ne 0) { throw "Could not install packaging dependencies." }
}

New-Item -ItemType Directory -Path $distRoot,$workRoot,$releaseRoot -Force | Out-Null
& $pyInstaller --noconfirm --clean --distpath $distRoot --workpath $workRoot (Join-Path $projectRoot "packaging\EnglishQuest.spec")
if ($LASTEXITCODE -ne 0) { throw "PyInstaller build failed." }

if (-not $InnoCompiler) {
    $candidateCompilers = @(
        "C:\Program Files (x86)\Inno Setup 6\ISCC.exe",
        "C:\Program Files\Inno Setup 6\ISCC.exe",
        "C:\Program Files\Inno Setup 7\ISCC.exe",
        "C:\Program Files (x86)\Inno Setup 7\ISCC.exe"
    )
    $InnoCompiler = $candidateCompilers | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
}
if ($InnoCompiler -and (Test-Path -LiteralPath $InnoCompiler)) {
    & $InnoCompiler "/DAppVersion=$Version" (Join-Path $projectRoot "packaging\installer.iss")
    if ($LASTEXITCODE -ne 0) { throw "Inno Setup build failed." }
}
else {
    & $pyInstaller --noconfirm --clean --distpath $releaseRoot --workpath (Join-Path $projectRoot "build\pyinstaller-setup") (Join-Path $projectRoot "packaging\EnglishQuestSetup.spec")
    if ($LASTEXITCODE -ne 0) { throw "Self-contained installer build failed." }
}

$installer = Join-Path $releaseRoot "EnglishQuest-Setup-$Version.exe"
if (-not (Test-Path -LiteralPath $installer)) { throw "Installer output was not created: $installer" }
$hash = Get-FileHash -Algorithm SHA256 -LiteralPath $installer
"$($hash.Hash.ToLowerInvariant())  $($hash.Path | Split-Path -Leaf)" | Set-Content -LiteralPath "$installer.sha256.txt" -Encoding ascii

Write-Host "Windows installer created:" -ForegroundColor Green
Write-Host "  $installer"
Write-Host "  SHA256: $($hash.Hash.ToLowerInvariant())"
