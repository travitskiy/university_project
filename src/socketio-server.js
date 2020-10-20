const io = require('socket.io')(82);

io.on('connect', socket => {
    io.send('Hello from socket io server');
    socket.on('message', (data) => {
        console.log(data);
    });
});