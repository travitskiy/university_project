const WebsocketServer = require('../src/websocket-server')
const SocketIOServer = require('../src/socketio-server')
const HttpServer = require('../src/http-server')
require('jest-fetch-mock').enableMocks()
const WebSocket = require('ws');
const io = require("socket.io-client");
const Generator = require('../src/generator');
const fs = require('fs');
let generator = new Generator();

describe("load tests", () => {
    function calcAverageDiff(clientsDate) {
        let averagesForClients = []
        for (let i = 0; i < clientsDate.length; i++) {
            let clientDateReceivedMsg = clientsDate[i]
            let diffArray = []
            for (let dateIndex = 1; dateIndex < clientDateReceivedMsg.length; dateIndex++) {
                let diff = clientDateReceivedMsg[dateIndex] - clientDateReceivedMsg[dateIndex - 1];
                diffArray.push(diff)
            }
            let averageDiff = diffArray.reduce((a, b) => a + b, 0) / diffArray.length
            averagesForClients.push(averageDiff)
        }
        return averagesForClients.reduce((a, b) => a + b, 0) / averagesForClients.length
    }

    async function createWebsocketConnection(address = 'ws://localhost:81') {
        return new Promise((resolve, reject) => {
            let ws = new WebSocket(address);

            ws.on('open', () => {
                resolve(ws)
            })
            ws.on('error', (error) => {
                reject()
            })
        })
    }

    function outputToFile(filename, successConnected, notConnected, timeConnect, timeDisconnect,averageDiffFromAll) {
        let dir = require('path').dirname(filename);
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir);

        let linesToOutPut = []
        linesToOutPut.push(`Подключено успешно клиентов: ${successConnected}`)
        linesToOutPut.push(`Не удалось подключится: ${notConnected}`)
        linesToOutPut.push(`Время подключения всех клиентов: ${timeConnect} мс`)
        linesToOutPut.push(`Время отключения всех клиентов: ${timeDisconnect} мс`)
        linesToOutPut.push(`Среднее отклонение при передачи данных: ${Math.round(Math.abs(averageDiffFromAll - 500))} мс`)

        fs.writeFileSync(filename, linesToOutPut.join('\n'))
    }

    async function createSocketIOConnection(address = 'ws://localhost:82') {
        return new Promise((resolve, reject) => {
            const socket = io(address, {
                timeout: 1000,
                reconnection: false,
                forceNew: true
            });

            socket.on('connect', () => {
                resolve(socket)
            });

            socket.on('connect_error', (error) => {
                reject(error)
            });
        })
    }

    test.each([10, 100, 1000, 2000, 5000])('определение отклонения скорости передачи данных с сервера WebSocket при подключении %i клиентов', async (n, done) => {
        let sockets = []
        let clientsDate = []
        let notConnected = 0
        let timeConnectStart = new Date().getTime()

        for (let i = 0; i < n; i++) {
            let clientDateReceivedMsg = []
            try {
                let ws = await createWebsocketConnection()
                sockets.push(ws)
                clientsDate.push(clientDateReceivedMsg)
                ws.on('message', (msg) => {
                    clientDateReceivedMsg.push(new Date().getTime())
                })
            } catch (e) {
                notConnected++;
            }
        }
        let timeConnect = new Date().getTime() - timeConnectStart


        setTimeout(async () => {
            let timeDisconnectStart = new Date().getTime()
            for (let socket of sockets)
                await socket.close()
            let timeDisconnect = new Date().getTime() - timeDisconnectStart

            let averageDiffFromAll = calcAverageDiff(clientsDate)
            outputToFile(`./tests_output/${expect.getState().currentTestName}.txt`, sockets.length, notConnected,timeConnect, timeDisconnect, averageDiffFromAll);
            done()
        }, 5000)

    }, 1000 * 60 * 5)

    test.each([10, 100, 1000, 2000, 5000])('определение отклонения скорости передачи данных с сервера SocketIO при подключении %i клиентов', async (n, done) => {
        let sockets = []
        let clientsDate = []
        let notConnected = 0
        let timeConnectStart = new Date().getTime()
        for (let i = 0; i < n; i++) {
            let clientDateReceivedMsg = []
            try {
                let socket = await createSocketIOConnection()
                sockets.push(socket)
                clientsDate.push(clientDateReceivedMsg)
                socket.on('message', (msg) => {
                    clientDateReceivedMsg.push(new Date().getTime())
                })
            } catch (e) {
                notConnected++;
            }
        }
        let timeConnect = new Date().getTime() - timeConnectStart

        setTimeout(async () => {
            let timeDisconnectStart = new Date().getTime()
            for (let socket of sockets)
                await socket.close()
            let timeDisconnect = new Date().getTime() - timeDisconnectStart
            let averageDiffFromAll = calcAverageDiff(clientsDate)

            outputToFile(`./tests_output/${expect.getState().currentTestName}.txt`, sockets.length, notConnected,timeConnect, timeDisconnect, averageDiffFromAll);
            done()
        }, 5000)
    }, 1000 * 60 * 5)
})
