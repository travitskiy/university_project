const WebSocket = require('ws');
const Generator = require('./generator');

let generator = new Generator();

module.exports = class WebsocketServer {

    static sendActualDataToClients(ws) {
        ws.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN)
                client.send(JSON.stringify(generator.generateActualData()));
        });
    }

    static start(port) {
        if(WebsocketServer.started)
            return;
        WebsocketServer.started = true;

        const ws = new WebSocket.Server({port: port});
        ws.on('connection', (ws) => {
            ws.on('message', (message) => {
                console.log(message);
            });
        });
        return ws;
    }
}
