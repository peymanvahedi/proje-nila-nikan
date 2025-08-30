param(
    [int]$StorefrontPort = 8000,
    [int]$AdminPort = 9000,
    [string]$AdminToken = ""
)

function Say($m) { Write-Host $m -ForegroundColor Cyan }
function Line() { Write-Host ("-" * 60) -ForegroundColor DarkGray }

# 1) Paths
Say "1) Checking required paths"
$root = Get-Location
$apiFile = Join-Path $root "apps\backend\src\api\admin\banners\index.ts"
$staticDir = Join-Path $root "apps\backend\static\uploads\banners"
$sfPage = Join-Path $root "apps\storefront\src\app\admin\banners\page.tsx"

"{0,-36} {1}" -f "API file exists?:", (Test-Path $apiFile)
"{0,-36} {1}" -f "Static upload dir?:", (Test-Path $staticDir)
"{0,-36} {1}" -f "Storefront admin page?:", (Test-Path $sfPage)
Line

# 2) Ports
Say "2) Checking ports (listening?)"
foreach ($p in @($StorefrontPort, $AdminPort)) {
    $used = (Get-NetTCPConnection -State Listen -LocalPort $p -ErrorAction SilentlyContinue)
"{0,-20} {1}" -f ("Port {0}:" -f $p), ([bool]$used)
}
Line

# 3) Basic HTTP checks
Say "3) HTTP checks"
try {
    $sf = Invoke-WebRequest -Uri "http://localhost:${StorefrontPort}/" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    "{0,-28} {1}" -f "Storefront /:", $sf.StatusCode
}
catch { "{0,-28} {1}" -f "Storefront /:", "DOWN" }

try {
    $adm = Invoke-WebRequest -Uri "http://localhost:${AdminPort}/app" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    "{0,-28} {1}" -f "Admin /app:", $adm.StatusCode
}
catch { "{0,-28} {1}" -f "Admin /app:", "DOWN" }
Line

# 4) Admin API (requires token)
Say "4) Admin API (/admin/banners)"
$headers = @{}
if ($AdminToken -ne "") { $headers["x-medusa-access-token"] = $AdminToken }

try {
    $res = Invoke-WebRequest -Uri "http://localhost:${AdminPort}/admin/banners" -Headers $headers -UseBasicParsing -TimeoutSec 8 -ErrorAction Stop
    "{0,-28} {1}" -f "GET /admin/banners:", $res.StatusCode
    if ($res.Content) { Write-Host ($res.Content.Substring(0, [Math]::Min(200, $res.Content.Length))) }
}
catch {
    "{0,-28} {1}" -f "GET /admin/banners:", $_.Exception.Message
}
Line

# 5) Optional public path (if configured)
Say "5) Optional: /store/banners (if configured)"
try {
    $res2 = Invoke-WebRequest -Uri "http://localhost:${AdminPort}/store/banners" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    "{0,-28} {1}" -f "GET /store/banners:", $res2.StatusCode
    if ($res2.Content) { Write-Host ($res2.Content.Substring(0, [Math]::Min(200, $res2.Content.Length))) }
}
catch {
    "{0,-28} {1}" -f "GET /store/banners:", $_.Exception.Message
}
Line

Say "Done."
