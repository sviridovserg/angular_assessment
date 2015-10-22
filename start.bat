@IF EXIST node_modules GOTO start-server
	call npm install
call node "node_modules\grunt-cli\bin\grunt" compile
:start-server
start http://localhost:8080
npm start
