$ErrorActionPreference = 'Stop'

function Decode-Html([string]$value) {
  if ([string]::IsNullOrWhiteSpace($value)) { return '' }
  return [System.Net.WebUtility]::HtmlDecode($value).Trim()
}

function Clean-Line([string]$line) {
  if ([string]::IsNullOrWhiteSpace($line)) { return '' }
  $decoded = Decode-Html $line
  $decoded = $decoded -replace '\s+', ' '
  return $decoded.Trim()
}

function Remove-Diacritics([string]$text) {
  if ([string]::IsNullOrWhiteSpace($text)) { return '' }
  $normalized = $text.Normalize([Text.NormalizationForm]::FormD)
  $sb = New-Object System.Text.StringBuilder
  foreach ($char in $normalized.ToCharArray()) {
    $category = [Globalization.CharUnicodeInfo]::GetUnicodeCategory($char)
    if ($category -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
      [void]$sb.Append($char)
    }
  }
  $result = $sb.ToString().Normalize([Text.NormalizationForm]::FormC)
  $result = $result.Replace([char]273, 'd').Replace([char]272, 'D')
  return $result
}

function Normalize-Key([string]$text) {
  $value = Remove-Diacritics (Clean-Line $text)
  $value = $value.ToLowerInvariant()
  $value = $value -replace '[^a-z0-9 ]', ' '
  $value = $value -replace '\s+', ' '
  return $value.Trim()
}

function Html-ToLines([string]$html) {
  $text = $html
  $text = [regex]::Replace($text, '(?is)<script[^>]*>.*?</script>', ' ')
  $text = [regex]::Replace($text, '(?is)<style[^>]*>.*?</style>', ' ')
  $text = [regex]::Replace($text, '(?is)</(p|div|li|h1|h2|h3|h4|h5|h6|tr|td|th|section)>', "`n")
  $text = [regex]::Replace($text, '(?is)<br\s*/?>', "`n")
  $text = [regex]::Replace($text, '(?is)<[^>]+>', ' ')
  $text = Decode-Html $text
  $lines = $text -split "`n"

  $result = New-Object System.Collections.Generic.List[string]
  foreach ($line in $lines) {
    $clean = Clean-Line $line
    if (-not [string]::IsNullOrWhiteSpace($clean)) {
      $result.Add($clean)
    }
  }
  return $result
}

function First-Match([string]$content, [string]$pattern) {
  $match = [regex]::Match($content, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if ($match.Success) {
    return Decode-Html $match.Groups[1].Value
  }
  return ''
}

function Resolve-AbsoluteUrl([string]$url) {
  $value = Clean-Line $url
  if ([string]::IsNullOrWhiteSpace($value)) { return '' }
  if ($value.StartsWith('http://') -or $value.StartsWith('https://')) { return $value }
  if ($value.StartsWith('//')) { return "https:$value" }
  if ($value.StartsWith('../')) {
    return "https://nhomxingfawindow.com/$($value.Substring(3))"
  }
  if ($value.StartsWith('/')) {
    return "https://nhomxingfawindow.com$value"
  }
  return "https://nhomxingfawindow.com/$value"
}

function Extract-ProductLinks([string]$categoryUrl) {
  $html = (Invoke-WebRequest -Uri $categoryUrl -UseBasicParsing -TimeoutSec 40).Content
  $matches = [regex]::Matches(
    $html,
    '<a href="(https://nhomxingfawindow\.com/[^"]+)"><h3 class="wid_name[^"]*">(.*?)</h3></a>',
    [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
  )

  $items = New-Object System.Collections.Generic.List[object]
  foreach ($match in $matches) {
    $url = $match.Groups[1].Value.Trim()
    $name = Clean-Line ($match.Groups[2].Value -replace '<[^>]+>', ' ')
    if (-not [string]::IsNullOrWhiteSpace($url) -and -not [string]::IsNullOrWhiteSpace($name)) {
      $items.Add([PSCustomObject]@{
          url  = $url
          name = $name
        })
    }
  }

  return $items | Sort-Object -Property url -Unique
}

function Extract-FirstParagraphAfterBrand([System.Collections.Generic.List[string]]$lines) {
  $idx = -1
  for ($i = 0; $i -lt $lines.Count; $i++) {
    if ((Normalize-Key $lines[$i]) -like 'thuong hieu*') {
      $idx = $i
      break
    }
  }
  if ($idx -lt 0) { return '' }

  for ($j = $idx + 1; $j -lt [Math]::Min($idx + 16, $lines.Count); $j++) {
    $line = $lines[$j]
    $key = Normalize-Key $line
    if ($line.Length -ge 35 -and $key -notmatch '^(be rong|ban canh|chieu day|mau sac|uu diem|mo ta|profile san pham|san pham khac)$') {
      return $line
    }
  }
  return ''
}

function Extract-Specifications([System.Collections.Generic.List[string]]$lines) {
  $labelMap = @{
    'be rong khung nhom' = 'Bề rộng khung nhôm'
    'ban canh' = 'Bản cánh'
    'chieu day nhom' = 'Chiều dày nhôm'
    'chieu day kinh' = 'Chiều dày kính'
    'do day nhom' = 'Độ dày nhôm'
  }
  $specKeys = $labelMap.Keys
  $stopKeys = @('mau sac', 'uu diem', 'mo ta', 'profile san pham', 'san pham khac')
  $specs = New-Object System.Collections.Generic.List[object]

  for ($i = 0; $i -lt $lines.Count; $i++) {
    $lineKey = Normalize-Key $lines[$i]
    if ($specKeys -contains $lineKey) {
      $value = ''
      for ($j = $i + 1; $j -lt [Math]::Min($i + 6, $lines.Count); $j++) {
        $candidate = $lines[$j]
        $candidateKey = Normalize-Key $candidate
        if ($stopKeys -contains $candidateKey) { break }
        if ($specKeys -contains $candidateKey) { break }
        if ($candidate.Length -gt 0) {
          $value = $candidate
          break
        }
      }
      if (-not [string]::IsNullOrWhiteSpace($value)) {
        $specs.Add([PSCustomObject]@{
            label = $labelMap[$lineKey]
            value = $value
          })
      }
    }
  }

  return $specs
}

function Extract-ListBetween([System.Collections.Generic.List[string]]$lines, [string]$startKey, [string[]]$stopKeys) {
  $start = -1
  for ($i = 0; $i -lt $lines.Count; $i++) {
    if ((Normalize-Key $lines[$i]) -eq $startKey) {
      $start = $i
      break
    }
  }
  if ($start -lt 0) { return @() }

  $items = New-Object System.Collections.Generic.List[string]
  for ($j = $start + 1; $j -lt $lines.Count; $j++) {
    $line = $lines[$j]
    $key = Normalize-Key $line
    if ($stopKeys -contains $key) { break }
    if ($key -match '^(image|he xfa|he kawin.*|trang chu)$') { continue }
    if ($line.Length -lt 2) { continue }
    if ($line.Length -gt 40) { continue }
    $items.Add($line)
  }

  return $items | Select-Object -Unique
}

function Extract-MoTaHtml([string]$html) {
  $match = [regex]::Match($html, '(?is)<div id="content_\d+" class="editor_reset"[^>]*>(.*?)</div>')
  if (-not $match.Success) { return '' }
  return $match.Groups[1].Value.Trim()
}

function Extract-GalleryImages([string]$html) {
  $result = New-Object System.Collections.Generic.List[string]
  $blockMatch = [regex]::Match(
    $html,
    '(?is)<div class="swiper swiper_product_">(.*?)<div class="swiper swiper_thumb_product_',
    [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
  )

  if ($blockMatch.Success) {
    $block = $blockMatch.Groups[1].Value
    $dataSrcMatches = [regex]::Matches($block, 'data-src="([^"]+)"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    foreach ($match in $dataSrcMatches) {
      $url = Resolve-AbsoluteUrl $match.Groups[1].Value
      if (-not [string]::IsNullOrWhiteSpace($url)) {
        $result.Add($url)
      }
    }
  }

  return @($result | Select-Object -Unique)
}

function Extract-ColorSwatches([string]$html) {
  $result = New-Object System.Collections.Generic.List[object]
  $itemMatches = [regex]::Matches(
    $html,
    '(?is)<div class="col-3[^"]*col-cms[^"]*"[^>]*>.*?<img src="([^"]+)"[^>]*>.*?<div class="mt-2">\s*(.*?)\s*</div>',
    [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
  )

  foreach ($match in $itemMatches) {
    $imageUrl = Resolve-AbsoluteUrl $match.Groups[1].Value
    $name = Clean-Line ($match.Groups[2].Value -replace '<[^>]+>', ' ')
    if (-not [string]::IsNullOrWhiteSpace($imageUrl) -and -not [string]::IsNullOrWhiteSpace($name)) {
      $result.Add([PSCustomObject]@{
          name = $name
          imageUrl = $imageUrl
        })
    }
  }

  return $result.ToArray()
}

function Build-ProductRecord([string]$categoryKey, [string]$categoryTitle, [object]$seed) {
  $url = $seed.url
  $fallbackTitle = $seed.name
  $html = (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 40).Content
  $lines = Html-ToLines $html

  $titleH1 = First-Match $html '<h1[^>]*>\s*(.*?)\s*</h1>'
  $titleMeta = First-Match $html '<title>\s*(.*?)\s*</title>'
  $metaDescription = First-Match $html '<meta name="description" content="([^"]*)"'
  $canonical = First-Match $html '<link href="([^"]+)" rel="canonical"'
  $ogImage = First-Match $html '<meta property="og:image" content="([^"]*)"'
  $slug = ''
  if (-not [string]::IsNullOrWhiteSpace($canonical)) {
    $slug = $canonical.TrimEnd('/').Split('/')[-1]
  } else {
    $slug = $url.TrimEnd('/').Split('/')[-1]
  }

  $shortDescription = Extract-FirstParagraphAfterBrand $lines
  if ([string]::IsNullOrWhiteSpace($shortDescription)) {
    $shortDescription = $metaDescription
  }

  $specs = Extract-Specifications $lines
  $galleryImages = Extract-GalleryImages $html
  $colorSwatches = Extract-ColorSwatches $html
  $colors = @($colorSwatches | ForEach-Object { $_.name } | Select-Object -Unique)
  if ($colors.Count -eq 0) {
    $colors = Extract-ListBetween $lines 'mau sac' @('uu diem', 'mo ta', 'san pham khac')
  }
  $advantages = Extract-ListBetween $lines 'uu diem' @('mo ta', 'profile san pham', 'san pham khac')
  $contentHtml = Extract-MoTaHtml $html
  $contentLines = Html-ToLines $contentHtml
  $contentPlain = ($contentLines -join "`n").Trim()

  $title = $fallbackTitle
  if (-not [string]::IsNullOrWhiteSpace($titleH1)) {
    $title = $titleH1
  } elseif (-not [string]::IsNullOrWhiteSpace($titleMeta)) {
    $title = $titleMeta
  }
  $title = Clean-Line ($title -replace '<[^>]+>', ' ')
  $titleMeta = Clean-Line ($titleMeta -replace '<[^>]+>', ' ')

  return [PSCustomObject]@{
    sourceUrl = $url
    category = [PSCustomObject]@{
      key   = $categoryKey
      title = $categoryTitle
    }
    title = $title
    slug = $slug
    seoTitle = $titleMeta
    seoDescription = $metaDescription
    ogImage = $ogImage
    shortDescription = $shortDescription
    specifications = @($specs)
    galleryImages = @($galleryImages)
    colors = @($colors)
    colorSwatches = @($colorSwatches)
    advantages = @($advantages)
    contentPlain = $contentPlain
    contentHtml = $contentHtml
  }
}

$categorySources = @(
  [PSCustomObject]@{
    key = 'xfa'
    title = 'He XFA'
    url = 'https://nhomxingfawindow.com/xfa'
  },
  [PSCustomObject]@{
    key = 'kawin'
    title = 'He KAWIN (He Ranh C Chau Au)'
    url = 'https://nhomxingfawindow.com/kawin'
  }
)

$allSeeds = New-Object System.Collections.Generic.List[object]
foreach ($categorySource in $categorySources) {
  $links = Extract-ProductLinks $categorySource.url
  foreach ($link in $links) {
    $allSeeds.Add([PSCustomObject]@{
        categoryKey = $categorySource.key
        categoryTitle = $categorySource.title
        url = $link.url
        name = $link.name
      })
  }
}

$uniqueByUrl = $allSeeds | Sort-Object -Property url -Unique
$products = New-Object System.Collections.Generic.List[object]
$crawlErrors = New-Object System.Collections.Generic.List[object]

foreach ($seed in $uniqueByUrl) {
  try {
    $record = Build-ProductRecord $seed.categoryKey $seed.categoryTitle $seed
    $products.Add($record)
    Write-Host "Crawled: $($record.slug)"
  } catch {
    $crawlErrors.Add([PSCustomObject]@{
        url = $seed.url
        error = $_.Exception.Message
      })
    Write-Warning "Failed to crawl $($seed.url): $($_.Exception.Message)"
  }
}

$output = [PSCustomObject]@{
  source = 'https://nhomxingfawindow.com'
  crawledAt = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ssK')
  categories = @(
    [PSCustomObject]@{ key = 'xfa'; title = 'He XFA' },
    [PSCustomObject]@{ key = 'kawin'; title = 'He KAWIN (He Ranh C Chau Au)' }
  )
  products = $products
  crawlErrors = $crawlErrors
}

New-Item -ItemType Directory -Force -Path 'data/imports' | Out-Null
$output | ConvertTo-Json -Depth 8 | Set-Content -Path 'data/imports/xingfawindow-products.json' -Encoding UTF8

Write-Host "Done. Exported $($products.Count) products to data/imports/xingfawindow-products.json"
