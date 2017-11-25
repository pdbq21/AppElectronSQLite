#App Electron with SQLite3

Dependencies on Windows:
- https://github.com/nodejs/node-gyp
- https://github.com/felixrieseberg/windows-build-tools

Todo:
-+ 1. read file (SCADA.txt)
-  1.1 to read/save the last line(LL):
-+ 1.1.0 reading every second
-  1.1.1 to read when click button 'Start'
-  2. saved data (LL) add to DB
-  3. to get date from DB
-  4. show date from DB in mainWindow
-  5. to add buttons: Start, Stop, Select to mainWindow
-  5.1 Button Start:
-+ 5.1.0 open the SCADA program (SCADA/Split.exe)
-  5.1.1 run the SCADA process (SCADA/Split.exe), need turn on switch into this program
-  5.2 Button Stop:
-  5.2.0 stops reading from the file (SCADA.txt)

#Parameters:
Column 1 - TR-106, TR-111, PPC-305
Column 2 - TR-107, TR-112, PPC-307
Tubes - TPC-101, TPC-102
Control of the value for the triggering system message:
PPC-305 > 7m, PPC-307>5m