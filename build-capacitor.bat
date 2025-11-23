@echo off
REM Windows batch file to prepare files for Capacitor

REM Create www directory if it doesn't exist
if not exist www mkdir www

REM Copy all necessary files
copy index.html www\
copy app.js www\
copy styles.css www\
copy manifest.json www\
copy service-worker.js www\
xcopy /E /I /Y icons www\icons
copy firebase-config.js www\
copy firebase-broadcast.js www\
copy campaign-manager-mc.js www\

REM Copy optional directories
if exist campaigns xcopy /E /I /Y campaigns www\campaigns
if exist images xcopy /E /I /Y images www\images
if exist music xcopy /E /I /Y music www\music

echo Build complete! Files copied to www/
pause
