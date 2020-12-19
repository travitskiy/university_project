const WebsocketServer = require('../src/websocket-server')
const SocketIOServer = require('../src/socketio-server')
const HttpServer = require('../src/http-server')
require('jest-fetch-mock').enableMocks()
const WebSocket = require('ws');
const io = require("socket.io-client");
const Generator = require('../src/generator');
let generator = new Generator();

describe("servers tests", () => {
    beforeAll(done => {
        HttpServer.start(8080, (error) => {
            done()
        })
    })
    beforeAll(done => {
        WebsocketServer.start(81, (error) => {
            done()
        })
    })
    beforeAll(done => {
        SocketIOServer.start(82, (error) => {
            done()
        });

    })

    test('проверка запуска сервера HTTP', (done) => {
        expect(HttpServer.started).toBe(true)
        done()
    });

    test('проверка запуска сервера WebSocket', (done) => {
        expect(WebsocketServer.started).toBe(true)
        if (WebsocketServer.started)
            setInterval(() => WebsocketServer.sendActualDataToClients(WebsocketServer.getServer()), 500)
        done()
    });

    test('проверка запуска сервера SOCKETIO', (done) => {
        expect(SocketIOServer.started).toBe(true)
        if (SocketIOServer.started)
            setInterval(() => SocketIOServer.sendActualDataToClients(SocketIOServer.getServer()), 500)
        done()
    });

    test('проверка подключения к серверу HTTP', async (done) => {
        try {
            await fetch(`http://localhost:8080`);
            done()
        } catch (e) {
            done(e)
        }
    })

    test('проверка подключения к серверу WebSocket', async (done) => {
        const ws = new WebSocket('ws://localhost:81');

        ws.on('open', () => {
            done()
        });
        ws.on('error', (error) => {
            done(error)
        });
    })

    test('проверка подключения к серверу SOCKETIO', async (done) => {
        const socket = io("ws://localhost:82", {
            timeout: 1000,
            reconnection: false
        });

        socket.on('connect_error', (error) => {
            done(error)
        });

        socket.on('connect', () => {
            done()
        });
    })

    test('проверка получения данных из репозитория(Generator)', async (done) => {
        let data = generator.generateActualData();
        if (!(data instanceof Array) || data.length === 0)
            done("returned not array or array len with 0")
        else
            done()
    });

    test('проверка отправки сообщений с сервера WebSocket и получения информации клиентом', async (done) => {
        const ws = new WebSocket('ws://localhost:81');
        ws.on('message', (msg) => {
            try {
                JSON.parse(msg)
                done()
            } catch (e) {
                done(e)
            }
        })
    })

    test('проверка отправки сообщений с сервера SOCKETIO и получения информации клиентом', async (done) => {
        const socket = io("ws://localhost:82", {
            timeout: 1000,
            reconnection: false
        });
        socket.on('message', (msg) => {
            done()
        })
    })
})


