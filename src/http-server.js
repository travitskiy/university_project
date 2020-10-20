const Colors = require('colors');
const express = require('express');
const cookieParser = require('cookie-parser');
const http = require('http');

app = express();
app.use(cookieParser());
app.use("/", [express.static('public')]);

const httpServer = http.createServer(app);
httpServer.listen(80, '0.0.0.0', (error) =>
    console.log(error === undefined ? "http server started".green : `error start http server ${error}`.red));
