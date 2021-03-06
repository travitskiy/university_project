const Colors = require('colors');
const express = require('express');
const cookieParser = require('cookie-parser');
const http = require('http');

app = express();
app.use(cookieParser());
app.use("/", [express.static('public')]);
const httpServer = http.createServer(app);

module.exports = class HttpServer {


    static start(port, callback = undefined) {
        if (HttpServer.started)
            return;

        httpServer.listen(port, '0.0.0.0', (error) => {
            console.log(error === undefined ? "http server started".green : `error start http server ${error}`.red)
            HttpServer.started = true
            if(callback)
                callback(error)
        });

        return httpServer;
    }
};

