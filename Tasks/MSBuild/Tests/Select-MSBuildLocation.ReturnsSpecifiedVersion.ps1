[cmdletbinding()]
param()

# Arrange.
. $PSScriptRoot\..\..\..\Tests\lib\Initialize-Test.ps1
. $PSScriptRoot\..\Select-MSBuildLocation.ps1
Register-Mock Get-MSBuildPath { 'Some resolved location' } -- -Version '14.0' -Architecture 'Some architecture' -SearchCom: $false # Should not search COM since version is not 15.0.

# Act.
$actual = Select-MSBuildLocation -Method 'Version' -Location 'Some input location' -Version '14.0' -Architecture 'Some architecture'

# Assert.
Assert-AreEqual 'Some resolved location' $actual
