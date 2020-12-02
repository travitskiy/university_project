const io = require('socket.io')
const Generator = require('./generator');
let generator = new Generator();

module.exports = class SocketIOServer {

    static sendActualDataToClients(server) {
        server.sockets.emit('message', generator.generateActualData())
    }

    static start(port) {
        if(SocketIOServer.started)
            return;
        SocketIOServer.started = true;

        let server = io(port);
        server.on('connect', socket => {
            socket.on('message', (data) => {
                console.log(data);
            });

        });
        return server;
    }
}

