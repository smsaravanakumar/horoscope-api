$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$reportPath = Join-Path $PSScriptRoot 'API_CHART_UAT_REPORT.txt'
Start-Transcript -Path $reportPath -Force
try {
  $suites = @(
    'chartPlanetaryTables.test.js',
    'chartPlanetaryTablesApiIntegration.test.js',
    'clientChartCalculations.test.js',
    'clientChartCalculationsApiIntegration.test.js',
    'fullRegressionUatStep5D.test.js',
    'birthCalculationDetails.test.js',
    'birthCalculationDetailsApiIntegration.test.js',
    'renderCoordinatesBypass.test.js'
  )
  foreach ($suite in $suites) {
    Write-Host "Running $suite"
    & node (Join-Path 'tests' $suite)
    if ($LASTEXITCODE -ne 0) { throw "$suite failed (exit $LASTEXITCODE)" }
  }
  Write-Host 'ALL API CHART UAT SUITES PASSED'
} finally {
  Stop-Transcript
}
