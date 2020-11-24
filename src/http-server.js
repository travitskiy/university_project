const Colors = require('colors');
const express = require('express');
const cookieParser = require('cookie-parser');
const http = require('http');

app = express();
app.use(cookieParser());
app.use("/", [express.static('public')]);
const httpServer = http.createServer(app);

module.exports = class HttpServer {
    static start(port) {
        if(HttpServer.started)
            return;
        HttpServer.started = true;

        httpServer.listen(port, '0.0.0.0', (error) =>
            console.log(error === undefined ? "http server started".green : `error start http server ${error}`.red));
        return httpServer;
    }
};

