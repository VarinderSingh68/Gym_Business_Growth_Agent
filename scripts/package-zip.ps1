Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourceDir = (Resolve-Path 'build').Path
$zipPath = (Join-Path (Get-Location) 'infinityfree-deploy.zip')

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

$zipStream = [System.IO.File]::Open($zipPath, [System.IO.FileMode]::Create)
$archive = New-Object System.IO.Compression.ZipArchive($zipStream, [System.IO.Compression.ZipArchiveMode]::Create)

Get-ChildItem -Path $sourceDir -Recurse -File -Force | ForEach-Object {
    $rel = $_.FullName.Substring($sourceDir.Length + 1).Replace("\", "/")
    $entry = $archive.CreateEntry($rel, [System.IO.Compression.CompressionLevel]::Optimal)
    $entryStream = $entry.Open()
    $fileStream = [System.IO.File]::OpenRead($_.FullName)
    $fileStream.CopyTo($entryStream)
    $fileStream.Close()
    $entryStream.Close()
}

$archive.Dispose()
$zipStream.Close()

Write-Host "Created $zipPath successfully with POSIX paths."
