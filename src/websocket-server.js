const WebSocket = require('ws');
const Generator = require('./generator');
const http = require('http');

let generator = new Generator();

module.exports = class WebsocketServer {
    static getServer(){

        return WebsocketServer.server;
    }

    static sendActualDataToClients(ws) {
        let  data = JSON.stringify(generator.generateActualData())
        ws.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN)
                client.send(data);
        });
    }

    static start(port, callback = undefined) {
        if(WebsocketServer.started)
            return;
        WebsocketServer.started = true;

        const httpServer = http.createServer()

        const ws = new WebSocket.Server({server:httpServer});

        httpServer.listen(port, '0.0.0.0', (error) => {
            console.log(error === undefined ? "websocket server started".green : `error start http server ${error}`.red)
            if(callback)
                callback(error)
            if(!error)
                WebsocketServer.started = true
        });

        ws.on('connection', (ws) => {
            ws.on('message', (message) => {
                console.log(message);
            });
        });
        WebsocketServer.server = ws
        return ws;
    }
}
