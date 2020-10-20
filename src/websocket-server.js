const WebSocket = require('ws');

const websocketServer = new WebSocket.Server({port: 81});
websocketServer.on('connection', (ws) => {
    ws.send('Hello from websocket server');
    ws.on('message', (message) => {
        console.log(message);
    });
});