@echo off
title Download Buku UT
echo ================================
echo   Download Buku UT (JPG -> PDF)
echo ================================
echo.
set /p browser="Pilih browser (chrome/edge/brave) [default: chrome]: "
if "%browser%"=="" set browser=chrome
set /p modul="Masukkan kode modul (contoh: MSIM4308): "
if "%modul%"=="" (
  echo Kode modul tidak boleh kosong!
  pause
  exit /b
)
echo.
echo Menjalankan: node downloader.js %browser% %modul%
node downloader.js %browser% %modul%
echo.
echo Selesai. Tekan sembarang tombol untuk keluar...
pause > nul