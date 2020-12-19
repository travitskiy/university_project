const io = require('socket.io')
const Generator = require('./generator');
let generator = new Generator();
const http = require('http');

module.exports = class SocketIOServer {
    static getServer(){
        return SocketIOServer.server;
    }
    static sendActualDataToClients(server) {
        server.sockets.emit('message', generator.generateActualData())
    }

    static start(port, callback = undefined) {
        if(SocketIOServer.started)
            return;

        const httpServer = http.createServer().listen(port, '0.0.0.0', (error) => {
            console.log(error === undefined ? "socketio server started".green : `error start http server ${error}`.red)
            if(callback)
                callback(error)
            if(!error){
                SocketIOServer.started = true
            }
        });

        let server = io(httpServer);
        server.on('connect', socket => {
            socket.on('message', (data) => {
                console.log(data);
            });
        });

        SocketIOServer.server = server
        return server;
    }
}

