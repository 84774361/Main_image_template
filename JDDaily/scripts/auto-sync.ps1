param(
  [int]$IntervalMinutes = 20,
  [string]$Branch = ""
)

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$StateDir = Join-Path $RepoRoot ".auto-sync"
$LogFile = Join-Path $StateDir "auto-sync.log"

New-Item -ItemType Directory -Force -Path $StateDir | Out-Null

function Write-Log {
  param([string]$Message)

  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Add-Content -Path $LogFile -Value "[$timestamp] $Message"
}

function Invoke-Git {
  param([string[]]$Arguments)

  $previousErrorActionPreference = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  try {
    $output = & git @Arguments 2>&1
    $exitCode = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $previousErrorActionPreference
  }

  if ($output) {
    Write-Log ($output -join "`n")
  }

  if ($exitCode -ne 0) {
    throw "git $($Arguments -join ' ') failed with exit code $exitCode"
  }
}

Set-Location $RepoRoot
Write-Log "Auto sync started for $RepoRoot. Interval: $IntervalMinutes minute(s)."

while ($true) {
  try {
    $currentBranch = $Branch
    if ([string]::IsNullOrWhiteSpace($currentBranch)) {
      $currentBranch = (& git branch --show-current).Trim()
    }

    if ([string]::IsNullOrWhiteSpace($currentBranch)) {
      Write-Log "No current branch detected. Skipping this cycle."
    } else {
      $status = (& git status --porcelain)

      if ($status) {
        Write-Log "Changes detected. Staging, committing, rebasing, and pushing to origin/$currentBranch."
        Invoke-Git @("add", "-A")

        & git diff --cached --quiet
        if ($LASTEXITCODE -eq 0) {
          Write-Log "No staged changes after git add. Skipping commit."
        } else {
          $commitTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
          Invoke-Git @("commit", "-m", "auto sync: $commitTime")
        }

        Invoke-Git @("pull", "--rebase", "origin", $currentBranch)
        Invoke-Git @("push", "origin", $currentBranch)
        Write-Log "Auto sync completed."
      } else {
        Write-Log "No local changes."
      }
    }
  } catch {
    Write-Log "ERROR: $($_.Exception.Message)"
  }

  Start-Sleep -Seconds ($IntervalMinutes * 60)
}
