@echo off

:LOOP
node main.js
echo The bot has crashed. Waiting for 60 seconds before restarting...
timeout /t 60 /nobreak > nul
goto LOOP
pause