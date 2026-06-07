$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$PidFile = Join-Path $RepoRoot ".auto-sync\auto-sync.pid"

if (-not (Test-Path $PidFile)) {
  Write-Host "Auto sync is not running."
  exit 0
}

$processId = (Get-Content -Path $PidFile | Select-Object -First 1)
$process = Get-Process -Id $processId -ErrorAction SilentlyContinue

if ($process) {
  Stop-Process -Id $processId
  Write-Host "Auto sync stopped. PID: $processId"
} else {
  Write-Host "Auto sync process was not found. Removing stale PID file."
}

Remove-Item -Path $PidFile -Force
