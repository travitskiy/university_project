const WebsocketServer = require('./websocket-server')
const SocketIOServer = require('./socketio-server')
const HttpServer = require('./http-server')

let httpServer = HttpServer.start(8080);
let ws = WebsocketServer.start(81);
let server = SocketIOServer.start(82);
setInterval(() => WebsocketServer.sendActualDataToClients(ws), 500)
setInterval(() => SocketIOServer.sendActualDataToClients(server), 500)




