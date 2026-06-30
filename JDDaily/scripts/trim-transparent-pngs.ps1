param(
  [Parameter(Mandatory = $true)]
  [string]$AssetsDir,

  [string]$OutputDir = ""
)

Add-Type -AssemblyName System.Drawing

$assetsPath = Resolve-Path -LiteralPath $AssetsDir
if (-not $OutputDir) {
  $OutputDir = Join-Path $assetsPath "__trimmed"
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

function Get-AlphaBounds {
  param([System.Drawing.Bitmap]$Bitmap)

  $minX = $Bitmap.Width
  $minY = $Bitmap.Height
  $maxX = -1
  $maxY = -1

  for ($y = 0; $y -lt $Bitmap.Height; $y++) {
    for ($x = 0; $x -lt $Bitmap.Width; $x++) {
      $pixel = $Bitmap.GetPixel($x, $y)
      if ($pixel.A -gt 8) {
        if ($x -lt $minX) { $minX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }

  if ($maxX -lt 0) {
    return $null
  }

  return [System.Drawing.Rectangle]::FromLTRB($minX, $minY, $maxX + 1, $maxY + 1)
}

$files = Get-ChildItem -LiteralPath $assetsPath -Recurse -File -Filter *.png |
  Where-Object { $_.FullName -notlike (Join-Path $OutputDir "*") }

foreach ($file in $files) {
  $relative = [System.IO.Path]::GetRelativePath($assetsPath, $file.FullName)
  $target = Join-Path $OutputDir $relative
  $targetDir = Split-Path -Parent $target
  New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

  $bitmap = [System.Drawing.Bitmap]::FromFile($file.FullName)
  try {
    $bounds = Get-AlphaBounds -Bitmap $bitmap
    if (-not $bounds) {
      Copy-Item -LiteralPath $file.FullName -Destination $target -Force
      Write-Output "Copied empty-alpha: $relative"
      continue
    }

    $trimmed = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
    $graphics = [System.Drawing.Graphics]::FromImage($trimmed)
    try {
      $graphics.DrawImage($bitmap, 0, 0, $bounds, [System.Drawing.GraphicsUnit]::Pixel)
      $trimmed.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)
      Write-Output "Trimmed: $relative"
    } finally {
      $graphics.Dispose()
      $trimmed.Dispose()
    }
  } finally {
    $bitmap.Dispose()
  }
}

Write-Output "Done: $OutputDir"
