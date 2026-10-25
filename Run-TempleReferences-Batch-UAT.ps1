# PowerShell 5.1+; run at API root. Does NOT edit dependencies or frozen calculation services.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$report = Join-Path $PSScriptRoot 'TEMPLE_REFERENCE_BATCH_UAT_REPORT.txt'
$serverStarted = $null
$failed = $false
"Panjapakshi Temple Reference Integrated Batch UAT - $(Get-Date -Format o)" | Set-Content -Path $report -Encoding UTF8
function Run-Check([string]$Name,[string]$Command) {
    Write-Host "`n==== $Name ====" -ForegroundColor Cyan
    Add-Content -Path $report -Value "`n==== $Name ===="
    $output = & cmd.exe /d /c "$Command 2>&1"
    $code = $LASTEXITCODE
    $output | ForEach-Object { Write-Host $_; Add-Content -Path $report -Value $_ }
    if ($code -ne 0) {
        Write-Host "[FAIL] $Name (exit $code)" -ForegroundColor Red
        Add-Content -Path $report -Value "[FAIL] $Name (exit $code)"
        return $false
    }
    Write-Host "[PASS] $Name" -ForegroundColor Green
    Add-Content -Path $report -Value "[PASS] $Name"
    return $true
}
try {
    if (-not (Test-Path '.\node_modules\express')) {
        Write-Host 'Dependencies absent; installing from approved lockfile with npm ci.' -ForegroundColor Yellow
        if (-not (Run-Check 'Dependency installation' 'npm ci')) { throw 'npm ci failed' }
    }
    if (-not (Run-Check 'Source reference coverage and mapping tests' 'node --test tests\clientTempleReferenceService.test.js')) { $failed = $true }
    try {
        $portReady = (Test-NetConnection 127.0.0.1 -Port 3000 -WarningAction SilentlyContinue).TcpTestSucceeded
    } catch { $portReady = $false }
    if (-not $portReady) {
        Write-Host 'Starting local API on port 3000 for integration tests.'
        $serverStarted = Start-Process -FilePath 'node.exe' -ArgumentList 'server.js' -PassThru -NoNewWindow -RedirectStandardOutput '.\TEMPLE_BATCH_API_STDOUT.txt' -RedirectStandardError '.\TEMPLE_BATCH_API_STDERR.txt'
        Start-Sleep -Seconds 4
        if ($serverStarted.HasExited) { throw 'API server exited unexpectedly' }
    } else { Write-Host 'Port 3000 already occupied. Ensure that the running service is this API.' -ForegroundColor Yellow }
    if (-not (Run-Check 'Complete Horoscope API regression' 'node --test tests\*.test.js')) { $failed = $true }
    if (-not (Run-Check 'Dependency security audit' 'npm audit --audit-level=high')) { $failed = $true }
} catch {
    $failed = $true
    Write-Host "[FAIL] $($_.Exception.Message)" -ForegroundColor Red
    Add-Content -Path $report -Value "[FAIL] $($_.Exception.Message)"
} finally {
    if ($null -ne $serverStarted -and -not $serverStarted.HasExited) { Stop-Process -Id $serverStarted.Id -Force -ErrorAction SilentlyContinue }
}
if ($failed) {
    Write-Host "UAT FAILED or incomplete. See $report" -ForegroundColor Red
    exit 1
}
Write-Host "UAT PASSED. See $report" -ForegroundColor Green
exit 0
