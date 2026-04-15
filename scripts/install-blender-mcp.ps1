<#
.SYNOPSIS
    Installs Blender MCP (https://github.com/ahujasid/blender-mcp) on Windows
    and configures it for Claude Desktop.

.DESCRIPTION
    Steps performed:
      1. Installs the `uv` Python package manager (if missing).
      2. Adds `%USERPROFILE%\.local\bin` to the user PATH.
      3. Pre-fetches the `blender-mcp` package via `uvx` so Claude Desktop
         launches instantly on first use.
      4. Downloads the Blender addon (`addon.py`) to your Desktop so you can
         install it into Blender 5.1.0 via Edit > Preferences > Add-ons.
      5. Writes / merges the `blender` MCP server entry into
         %APPDATA%\Claude\claude_desktop_config.json.

    You still have to:
      - Install addon.py inside Blender (GUI step, cannot be automated).
      - Restart Claude Desktop after the script finishes.
      - In Blender: press N in the 3D Viewport > BlenderMCP tab > Connect.

.NOTES
    Run from an ordinary (non-admin) PowerShell window:
        powershell -ExecutionPolicy Bypass -File .\install-blender-mcp.ps1
#>

[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

function Write-Step($msg) {
    Write-Host ""
    Write-Host "==> $msg" -ForegroundColor Cyan
}

function Write-Ok($msg)  { Write-Host "    [ok] $msg" -ForegroundColor Green }
function Write-Warn2($msg) { Write-Host "    [!!] $msg" -ForegroundColor Yellow }

# ---------------------------------------------------------------------------
# 1. Install uv
# ---------------------------------------------------------------------------
Write-Step "Step 1/5: Installing uv package manager"

$localBin = Join-Path $env:USERPROFILE ".local\bin"
$uvExe    = Join-Path $localBin "uv.exe"
$uvxExe   = Join-Path $localBin "uvx.exe"

if (Test-Path $uvExe) {
    Write-Ok "uv already installed at $uvExe"
} else {
    Write-Host "    Downloading uv installer from astral.sh..."
    Invoke-RestMethod -Uri "https://astral.sh/uv/install.ps1" | Invoke-Expression
    if (-not (Test-Path $uvExe)) {
        throw "uv install failed - $uvExe not found. Check the installer output above."
    }
    Write-Ok "uv installed"
}

# ---------------------------------------------------------------------------
# 2. Ensure PATH contains %USERPROFILE%\.local\bin (user scope)
# ---------------------------------------------------------------------------
Write-Step "Step 2/5: Adding uv to user PATH"

$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$localBin*") {
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$localBin", "User")
    Write-Ok "Added $localBin to user PATH (new shells will see it)"
} else {
    Write-Ok "$localBin already on user PATH"
}

# Make it visible in *this* shell too, so the uvx call below works.
$env:Path = "$env:Path;$localBin"

# ---------------------------------------------------------------------------
# 3. Warm the uvx cache for blender-mcp
# ---------------------------------------------------------------------------
Write-Step "Step 3/5: Pre-fetching blender-mcp via uvx"

try {
    & $uvxExe blender-mcp --help | Out-Null
    Write-Ok "blender-mcp package downloaded and cached"
} catch {
    Write-Warn2 "uvx blender-mcp --help failed: $($_.Exception.Message)"
    Write-Warn2 "Claude Desktop will retry on launch - not fatal."
}

# ---------------------------------------------------------------------------
# 4. Download addon.py for Blender
# ---------------------------------------------------------------------------
Write-Step "Step 4/5: Downloading Blender addon"

$desktop  = [Environment]::GetFolderPath("Desktop")
$addonOut = Join-Path $desktop "blender-mcp-addon.py"
$addonUrl = "https://raw.githubusercontent.com/ahujasid/blender-mcp/main/addon.py"

Invoke-WebRequest -Uri $addonUrl -OutFile $addonOut -UseBasicParsing
Write-Ok "Saved addon to $addonOut"
Write-Host "    -> In Blender 5.1.0:"
Write-Host "       Edit > Preferences > Add-ons > Install from Disk"
Write-Host "       Pick:  $addonOut"
Write-Host "       Then tick the checkbox next to 'Interface: Blender MCP'"

# ---------------------------------------------------------------------------
# 5. Write claude_desktop_config.json
# ---------------------------------------------------------------------------
Write-Step "Step 5/5: Configuring Claude Desktop"

$configDir  = Join-Path $env:APPDATA "Claude"
$configPath = Join-Path $configDir "claude_desktop_config.json"

if (-not (Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir -Force | Out-Null
}

if (Test-Path $configPath) {
    Write-Host "    Existing config found - merging blender entry..."
    try {
        $existing = Get-Content $configPath -Raw | ConvertFrom-Json
    } catch {
        $backup = "$configPath.bak"
        Copy-Item $configPath $backup -Force
        Write-Warn2 "Existing config was not valid JSON. Backed up to $backup and rewriting."
        $existing = [pscustomobject]@{}
    }
    if (-not $existing.PSObject.Properties.Name -contains 'mcpServers') {
        $existing | Add-Member -MemberType NoteProperty -Name mcpServers -Value ([pscustomobject]@{})
    }
    $blenderEntry = [pscustomobject]@{
        command = "uvx"
        args    = @("blender-mcp")
    }
    if ($existing.mcpServers.PSObject.Properties.Name -contains 'blender') {
        $existing.mcpServers.blender = $blenderEntry
    } else {
        $existing.mcpServers | Add-Member -MemberType NoteProperty -Name blender -Value $blenderEntry
    }
    $existing | ConvertTo-Json -Depth 10 | Set-Content $configPath -Encoding UTF8
} else {
    Write-Host "    Creating fresh config at $configPath"
    $fresh = @{
        mcpServers = @{
            blender = @{
                command = "uvx"
                args    = @("blender-mcp")
            }
        }
    }
    $fresh | ConvertTo-Json -Depth 10 | Set-Content $configPath -Encoding UTF8
}
Write-Ok "Config written: $configPath"

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "All automated steps complete." -ForegroundColor Green
Write-Host ""
Write-Host "Manual steps that remain:" -ForegroundColor Yellow
Write-Host "  1. Install the addon in Blender 5.1.0 (see Step 4 above)."
Write-Host "  2. Fully quit and reopen Claude Desktop."
Write-Host "  3. In Blender's 3D Viewport: press N > BlenderMCP tab > Connect to Claude."
Write-Host ""
