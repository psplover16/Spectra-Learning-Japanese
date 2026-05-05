[CmdletBinding()]
param()

$utf8NoBom = [System.Text.UTF8Encoding]::new($false)

[Console]::InputEncoding = $utf8NoBom
[Console]::OutputEncoding = $utf8NoBom
$global:OutputEncoding = $utf8NoBom

if ([Environment]::OSVersion.Platform -eq [System.PlatformID]::Win32NT) {
  & chcp.com 65001 | Out-Null
}

if ($null -eq $global:PSDefaultParameterValues) {
  $global:PSDefaultParameterValues = @{}
}

$global:PSDefaultParameterValues['Get-Content:Encoding'] = 'UTF8'
$global:PSDefaultParameterValues['Select-String:Encoding'] = 'UTF8'

$env:PYTHONUTF8 = '1'
$env:PYTHONIOENCODING = 'utf-8'
$env:LANG = 'C.UTF-8'
$env:LC_ALL = 'C.UTF-8'
$env:LESSCHARSET = 'utf-8'
