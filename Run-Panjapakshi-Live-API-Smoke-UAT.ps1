param([string]$BaseUrl='https://horoscope-api-346p.onrender.com')
$ErrorActionPreference='Stop'
$base=$BaseUrl.TrimEnd('/')
$pass=0; $fail=0; $results=New-Object System.Collections.Generic.List[string]
function Check([string]$name,[bool]$condition,[string]$detail='') {
 if($condition){$script:pass++;$line="[PASS] $name"}else{$script:fail++;$line="[FAIL] $name | $detail"}
 Write-Host $line; $script:results.Add($line)
}
function IsMap($v){return ($null -ne $v -and $v -is [System.Collections.IDictionary] -or ($null -ne $v -and $v -is [pscustomobject]))}
function Fetch([string]$method,[string]$path,$body=$null){
 $params=@{Uri="$base$path";Method=$method;TimeoutSec=130;ErrorAction='Stop'}
 if($null -ne $body){$params['ContentType']='application/json; charset=utf-8';$params['Body']=($body|ConvertTo-Json -Depth 20 -Compress)}
 return Invoke-RestMethod @params
}
try{
 $root=Fetch 'GET' '/'
 Check 'Production root health' ($root.success -eq $true -and $root.message -match 'running')
}catch{Check 'Production root health' $false $_.Exception.Message}
$cases=@(
 @{language='ta';name='Public Production Smoke Test Tamil'},
 @{language='en';name='Public Production Smoke Test English'}
)
$answers=@{}
foreach($case in $cases){
 $lang=$case.language
 $body=@{name=$case.name;gender='male';birthDate='04-04-1971';birthTime='7:52 AM';place='Kanniyakumari';latitude=8.3279814;longitude=77.3541173;language=$lang}
 try{$r=Fetch 'POST' '/api/horoscope/generate' $body;$answers[$lang]=$r;Check "HTTP horoscope generation ($lang)" ($r.success -eq $true)}
 catch{Check "HTTP horoscope generation ($lang)" $false $_.Exception.Message;continue}
 $r=$answers[$lang];$temples=$r.clientTempleReferences
 Check "Reference object ($lang)" (IsMap $temples)
 if(IsMap $temples){
  Check "Yogi temple ($lang)" (-not [string]::IsNullOrWhiteSpace([string]$temples.yogiTemple.temple))
  Check "Avayogi temple ($lang)" (-not [string]::IsNullOrWhiteSpace([string]$temples.avayogiTemple.temple))
  Check "27 Nakshatra coverage ($lang)" ($temples.coverage.nakshatras -eq 27 -and $temples.coverage.yogiAndAvayogiPairsComplete -eq $true)
  Check "144 Mudakku house mappings ($lang)" ($temples.coverage.mudakkuSignHouseRows -eq 144 -and $temples.coverage.mudakkuTwelveSignsCovered -eq $true)
  Check "Mudakku choices ($lang)" ($null -ne $temples.mudakkuHouseOptions -and @($temples.mudakkuHouseOptions).Count -eq 12)
  Check "No invented Mudakku remedy selection ($lang)" ($null -eq $temples.mudakkuHouseTemple -and $null -eq $temples.selection.mudakkuHouseNo)
 }
 Check "Natal horoscope blocks ($lang)" ($null -ne $r.lagna -and @($r.planets).Count -ge 10 -and $null -ne $r.chart -and $null -ne $r.navamsaChart)
 Check "Dasha and horoscope details ($lang)" ($null -ne $r.dasha -and $null -ne $r.horoscopeDetails -and $null -ne $r.birthCalculationDetails)
 Check "D60 and client calculations ($lang)" (@($r.clientAstroRules.d1D60Analysis.divisionalCharts).Count -eq 60 -and $null -ne $r.clientChartCalculations)
 Check "Gocharam ($lang)" ($null -ne $r.currentGocharam)
 Check "Yoga Nadi Mandi and Panchapakshi ($lang)" ($null -ne $r.clientAstroRules.yogaRules -and $r.clientAstroRules.nadiRules.evaluatedRuleCount -eq 60 -and $null -ne $r.clientAstroRules.mandiDosha -and $null -ne $r.clientAstroRules.panchaPakshi)
 Check "Ashtakavarga baseline ($lang)" ($r.ashtakavarga.grandTotal -eq 337)
}
if($answers.ContainsKey('ta') -and $answers.ContainsKey('en')){
 $a=$answers.ta;$b=$answers.en
 Check 'Tamil/English core numeric consistency' ($a.ashtakavarga.grandTotal -eq $b.ashtakavarga.grandTotal -and $a.ayanamsa -eq $b.ayanamsa -and $a.coordinates.latitude -eq $b.coordinates.latitude)
 Check 'Tamil/English temple selection consistency' ($a.clientTempleReferences.selection.yogiNakshatraNo -eq $b.clientTempleReferences.selection.yogiNakshatraNo -and $a.clientTempleReferences.selection.avayogiNakshatraNo -eq $b.clientTempleReferences.selection.avayogiNakshatraNo -and $a.clientTempleReferences.selection.mudakkuRasiNo -eq $b.clientTempleReferences.selection.mudakkuRasiNo)
}
$results.Add("---- SUMMARY ----");$results.Add("Base URL: $base");$results.Add("PASS=$pass FAIL=$fail");$results.Add('Note: endpoint reports coverage counts; independent 27/144 reference row correctness needs source-data review.');$results.Add('Note: production results can include current-time Gocharam; do not compare transit values across times.')
$report=Join-Path (Get-Location).Path 'PANJAPAKSHI_LIVE_API_UAT_REPORT.txt'
$results|Set-Content -LiteralPath $report -Encoding UTF8
Write-Host "`nPASS=$pass FAIL=$fail";Write-Host "Report: $report"
if($fail -gt 0){exit 1}
