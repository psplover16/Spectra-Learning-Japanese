[CmdletBinding()]
param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]] $SpectraArgs
)

$ErrorActionPreference = 'Stop'

$scriptDirectory = Split-Path -Parent $PSCommandPath
$repoRoot = Split-Path -Parent $scriptDirectory

. (Join-Path $scriptDirectory 'Use-ProjectUtf8.ps1')

$spectraCommand = Get-Command 'spectra' -CommandType Application -ErrorAction SilentlyContinue
if ($null -eq $spectraCommand) {
  $spectraCommand = Get-Command 'spectra.exe' -CommandType Application -ErrorAction SilentlyContinue
}

if ($null -eq $spectraCommand) {
  Write-Error 'Spectra CLI was not found on PATH.'
  exit 127
}

Push-Location -LiteralPath $repoRoot
try {
  & $spectraCommand.Source @SpectraArgs
  $exitCode = $LASTEXITCODE
  if ($null -eq $exitCode) {
    $exitCode = 0
  }
  exit $exitCode
}
finally {
  Pop-Location
}
