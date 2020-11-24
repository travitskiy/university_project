const WebSocket = require('ws');
const Generator = require('./generator');

let generator = new Generator();

module.exports = class WebsocketServer {
    static start(port) {
        const ws = new WebSocket.Server({port: port});
        ws.on('connection', (ws) => {
            ws.send('Hello from websocket server');
            ws.on('message', (message) => {
                console.log(message);
            });
        });
        setInterval(() => {
            ws.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN)
                    client.send(JSON.stringify(generator.generateActualData()));

            });
        }, 500)

    }
}
