param(
  [string]$ImageDir = "F:\NEWPAGE\AI生图\批量生图测试\京东pop612\pop 主图-618",
  [string]$TemplateCsv = "F:\NEWPAGE\AI生图\批量生图测试\京东pop612\sample\tablesample.csv",
  [string]$ProductsDir = "F:\NEWPAGE\AI生图\批量生图测试\京东pop612\sample\products",
  [string]$OutputCsv = "F:\NEWPAGE\AI生图\批量生图测试\京东pop612\sample\parsed-pop-main-images.csv"
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime]
$null = [Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime]
$null = [Windows.Globalization.Language, Windows.Foundation, ContentType = WindowsRuntime]

function Await-WinRt($asyncOperation, $resultType) {
  $asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() |
    Where-Object { $_.Name -eq "AsTask" -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 })[0]
  $task = $asTask.MakeGenericMethod($resultType).Invoke($null, @($asyncOperation))
  $task.Wait()
  $task.Result
}

function Normalize-Text([string]$text) {
  if ([string]::IsNullOrWhiteSpace($text)) { return "" }
  $s = $text -replace "\s+", ""
  $s = $s -replace "電", "霜"
  $s = $s -replace "轧", "乳"
  $s = $s -replace "酽", "g"
  $s = $s -replace "的", "页"
  $s
}

function Join-RegionText($lines, [double]$minX, [double]$maxX, [double]$minY, [double]$maxY, [switch]$KeepLines) {
  $items = @($lines | Where-Object {
    $_.X -ge $minX -and $_.X -le $maxX -and $_.Y -ge $minY -and $_.Y -le $maxY
  } | Sort-Object Y, X)
  if ($items.Count -eq 0) { return "" }
  $parts = @($items | ForEach-Object { Normalize-Text $_.Text } | Where-Object { $_ })
  if ($KeepLines) { return ($parts -join "`n") }
  return ($parts -join "")
}

function Get-OcrLines($engine, [string]$path) {
  $file = Await-WinRt ([Windows.Storage.StorageFile]::GetFileFromPathAsync($path)) ([Windows.Storage.StorageFile])
  $stream = Await-WinRt ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
  $decoder = Await-WinRt ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
  $bitmap = Await-WinRt ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
  $result = Await-WinRt ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
  $out = New-Object System.Collections.Generic.List[object]
  foreach ($line in $result.Lines) {
    $words = @($line.Words)
    if ($words.Count -eq 0) { continue }
    $x = ($words | ForEach-Object { $_.BoundingRect.X } | Measure-Object -Minimum).Minimum
    $y = ($words | ForEach-Object { $_.BoundingRect.Y } | Measure-Object -Minimum).Minimum
    $r = ($words | ForEach-Object { $_.BoundingRect.X + $_.BoundingRect.Width } | Measure-Object -Maximum).Maximum
    $b = ($words | ForEach-Object { $_.BoundingRect.Y + $_.BoundingRect.Height } | Measure-Object -Maximum).Maximum
    $out.Add([pscustomobject]@{
      Text = $line.Text
      X = [double]$x
      Y = [double]$y
      W = [double]($r - $x)
      H = [double]($b - $y)
    })
  }
  $out
}

function ProductPath([string]$name) {
  if (-not $name) { return "" }
  return "products/$name"
}

function Find-Product($products, [string]$pattern) {
  $hit = @($products | Where-Object { $_ -match $pattern } | Select-Object -First 1)
  if ($hit.Count) { return ProductPath $hit[0] }
  return ""
}

function Detect-Products($products, [string]$allText, [string]$title) {
  $items = New-Object System.Collections.Generic.List[string]
  function AddUnique([string]$value) {
    if ($value -and -not $items.Contains($value)) { $items.Add($value) }
  }

  if ($allText -match "Conditioner|护发|柔顺") { AddUnique (Find-Product $products "conditioner.*tube.*100g") }
  if ($allText -match "HandCream|护手") { AddUnique (Find-Product $products "hand.*cream.*tube.*60g") }
  if ($allText -match "Spray|稳肌底|保湿喷雾") { AddUnique (Find-Product $products "moisturizing.*spray.*bottle.*100ml") }
  if ($allText -match "Sunscreen|防晒|SPF") { AddUnique (Find-Product $products "sunscreen.*lotion.*bottle.*5ml") }
  if ($allText -match "CleansingFoam|洁面泡|洗卸|泡沫洁面") { AddUnique (Find-Product $products "cleansing.*foam.*pump.*150ml") }
  if ($allText -match "BodyWash|沐浴|洗沐|柔净") { AddUnique (Find-Product $products "body.*wash.*foam.*pump.*300ml") }
  if ($allText -match "BodyLotion|身体乳") { AddUnique (Find-Product $products "body.*lotion.*bottle.*400ml") }
  if ($allText -match "CoolingCream|冰沙|夏季安心") { AddUnique (Find-Product $products "cooling.*cream.*jar.*50g") }
  if ($allText -match "RepairingCream|学龄霜|安心霜|干敏红|修护") { AddUnique (Find-Product $products "repairing.*cream.*jar.*50g") }
  if ($allText -match "SoothingEssence|精华露|次抛|速褪红") { AddUnique (Find-Product $products "soothing.*essence") }

  if ($items.Count -eq 0) { return "" }
  return ($items.ToArray() -join "|")
}

function Normalize-Price([string]$text) {
  if ([string]::IsNullOrWhiteSpace($text)) { return "" }
  $s = $text -replace "\]", "1"
  $s = $s -replace "[^\d]", ""
  if ($s.Length -gt 3) { $s = $s.Substring($s.Length - 3) }
  $s
}

function Detect-GiftLeftSet($products, [string]$giftDesc, [string]$allText) {
  $text = "$giftDesc$allText"
  $count = 1
  if ($text -match "\*(\d+)") { $count = [int]$Matches[1] }
  $path = ""
  if ($text -match "身体乳.*100") { $path = Find-Product $products "body.*lotion.*tube.*100ml" }
  elseif ($text -match "身体乳.*50") { $path = Find-Product $products "body.*lotion.*50g" }
  elseif ($text -match "冰沙.*25") { $path = Find-Product $products "cooling.*cream.*tube.*25g" }
  elseif ($text -match "冰沙.*10") { $path = Find-Product $products "cooling.*cream.*tube.*10g" }
  elseif ($text -match "学龄霜.*25|安心霜.*25") { $path = Find-Product $products "repairing.*cream.*tube.*25g" }
  elseif ($text -match "学龄霜.*10|安心霜.*10") { $path = Find-Product $products "repairing.*cream.*tube.*10g" }
  elseif ($text -match "洁面泡|洗沐") { $path = Find-Product $products "cleansing.*foam.*bottle.*50ml" }
  elseif ($text -match "精华露|次抛") { $path = Find-Product $products "soothing.*essence.*ampoule" }
  if (-not $path) { return "" }
  if ($count -gt 1) { return "$path*$count" }
  return $path
}

$templateHeader = Get-Content -LiteralPath $TemplateCsv -TotalCount 3
$products = @(Get-ChildItem -LiteralPath $ProductsDir -File -Include *.png,*.jpg,*.jpeg |
  Sort-Object Name | Select-Object -ExpandProperty Name)
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage((New-Object Windows.Globalization.Language "zh-Hans"))
if ($null -eq $engine) { throw "Windows OCR zh-Hans engine is unavailable." }

$rows = New-Object System.Collections.Generic.List[object]
$images = @(Get-ChildItem -LiteralPath $ImageDir -File |
  Where-Object { $_.Extension -match "^\.(jpg|jpeg|png)$" } |
  Sort-Object Name)

$i = 0
foreach ($img in $images) {
  $i++
  Write-Host "[$i/$($images.Count)] OCR $($img.Name)"
  $lines = Get-OcrLines $engine $img.FullName
  $allText = Normalize-Text (($lines | Sort-Object Y, X | ForEach-Object { $_.Text }) -join " ")
  $productAreaText = Normalize-Text (($lines | Where-Object {
    $_.Y -ge 190 -and $_.Y -le 560 -and $_.X -le 620
  } | Sort-Object Y, X | ForEach-Object { $_.Text }) -join " ")

  $titleLines = @($lines | Where-Object {
    $_.X -lt 650 -and $_.Y -ge 70 -and $_.Y -le 190 -and $_.H -ge 22 -and $_.Text -notmatch "NEW|612"
  } | Sort-Object Y, X | ForEach-Object { Normalize-Text $_.Text } | Where-Object { $_ })
  $title = ($titleLines -join "`n")
  $productNote = Join-RegionText $lines 20 650 150 235
  if ($productNote -match "^\*?数据|指角质|来源") {
    # Keep as-is.
  } elseif ($allText -match "\*数据源[^限店预拍买]+") {
    $productNote = $Matches[0]
  }

  $giftLeftTitle = Join-RegionText $lines 20 210 570 635
  if (-not $giftLeftTitle -and $allText -match "限量加赠") { $giftLeftTitle = "限量加赠" }
  $giftLeftDesc = Join-RegionText $lines 20 360 635 705 -KeepLines
  $price = ""
  $priceLine = @($lines | Where-Object {
    $_.Y -ge 715 -and $_.X -ge 120 -and $_.X -le 340 -and $_.H -ge 28 -and $_.Text -match "\d{2,3}"
  } | Sort-Object @{Expression="H";Descending=$true} | Select-Object -First 1)
  if ($priceLine.Count) {
    $price = Normalize-Price $priceLine[0].Text
  }
  if (-not $price -and $allText -match "¥(\d{2,3})") { $price = $Matches[1] }

  $bottomText = Join-RegionText $lines 300 800 715 800
  $bottomText = $bottomText -replace "^¥?\d{2,3}", ""
  $giftRight = ""
  if ($allText -match "满298") { $giftRight = "298" }
  elseif ($allText -match "满178") { $giftRight = "178" }
  elseif ($allText -match "多重好礼") { $giftRight = "178" }
  $person = ""
  if ($allText -match "章子怡") { $person = "zhangziyi" }
  elseif ($allText -match "崔玉涛|玉涛") { $person = "cuiyutao" }

  $productSet = Detect-Products $products $productAreaText $title
  $giftLeftSet = Detect-GiftLeftSet $products $giftLeftDesc $allText
  $layout = "auto"
  if ($productSet -match "\|") { $layout = "line" }

  $rows.Add([pscustomobject]@{
    sku = [System.IO.Path]::GetFileNameWithoutExtension($img.Name)
    exportName = [System.IO.Path]::GetFileNameWithoutExtension($img.Name)
    "txt.title" = $title
    "txt.productNote" = $productNote
    "txt.giftLeftTitle" = $giftLeftTitle
    "txt.giftLeftDesc" = $giftLeftDesc
    "txt.price" = $price
    "txt.bottomText" = $bottomText
    "img.product" = (($productSet -split "\|") | Select-Object -First 1)
    "img.productSet" = $productSet
    "product.layout" = $layout
    "product.heightRatio" = ""
    "product.scale" = ""
    "product.gap" = ""
    "img.person" = $person
    "giftLeft.layout" = "overlap"
    "giftLeft.gap" = ""
    "giftLeft.heightRatio" = ""
    "giftLeft.scale" = ""
    "img.giftLeftSet" = $giftLeftSet
    "img.giftRight" = $giftRight
  })
}

$dataLines = $rows | ConvertTo-Csv -NoTypeInformation
$outLines = New-Object System.Collections.Generic.List[string]
$templateHeader | ForEach-Object { $outLines.Add($_) }
($dataLines | Select-Object -Skip 1) | ForEach-Object { $outLines.Add($_) }
Set-Content -LiteralPath $OutputCsv -Value $outLines -Encoding UTF8
Write-Host "Wrote $OutputCsv"
Write-Host "Rows: $($rows.Count)"


