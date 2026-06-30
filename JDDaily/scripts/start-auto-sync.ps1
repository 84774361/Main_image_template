param(
  [int]$IntervalMinutes = 20,
  [string]$Branch = ""
)

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$StateDir = Join-Path $RepoRoot ".auto-sync"
$PidFile = Join-Path $StateDir "auto-sync.pid"
$LogFile = Join-Path $StateDir "auto-sync.log"
$AutoSyncScript = Join-Path $PSScriptRoot "auto-sync.ps1"

New-Item -ItemType Directory -Force -Path $StateDir | Out-Null

if (Test-Path $PidFile) {
  $existingPid = (Get-Content -Path $PidFile -ErrorAction SilentlyContinue | Select-Object -First 1)
  if ($existingPid) {
    $existingProcess = Get-Process -Id $existingPid -ErrorAction SilentlyContinue
    if ($existingProcess) {
      Write-Host "Auto sync is already running. PID: $existingPid"
      exit 0
    }
  }
}

$arguments = @(
  "-NoProfile",
  "-ExecutionPolicy", "Bypass",
  "-File", "`"$AutoSyncScript`"",
  "-IntervalMinutes", $IntervalMinutes
)

if (-not [string]::IsNullOrWhiteSpace($Branch)) {
  $arguments += @("-Branch", $Branch)
}

$process = Start-Process -FilePath "powershell.exe" -ArgumentList $arguments -WorkingDirectory $RepoRoot -WindowStyle Hidden -PassThru
Set-Content -Path $PidFile -Value $process.Id

Write-Host "Auto sync started. PID: $($process.Id)"
Write-Host "Interval: $IntervalMinutes minute(s)"
Write-Host "Log: $LogFile"
