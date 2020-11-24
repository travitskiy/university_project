const WebsocketServer = require('./websocket-server')
const SocketIOServer = require('./socketio-server')
const HttpServer = require('./http-server')

HttpServer.start(8080);
WebsocketServer.start(81);
SocketIOServer.start(82);



