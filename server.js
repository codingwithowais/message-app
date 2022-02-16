
const express = require('express');
const app = express();
const fs = require('fs');
markup = fs.readFileSync('./index.html');
const http = require('http').createServer(app);

const port = 500;
// static directory is used to serve our static files
app.use('/static', express.static('static'));

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.end(markup);
});

http.listen(port, () => {
    console.log(`server is running successfully on port ${port}`);
});


// socket work

// io is used to include a new connection to the socket server and aur socket is connected to node http server
const io = require('socket.io')(http);
// user stores the socket id and name of the client
user = {};

// this event connnects a client to the socket and then follows the below events
io.on('connect', (socket) => {

    // In this events firstly the server listens the event about a new user and takes the name and stores the socket id into the user and then emit the event to all the clients about the new client except the new client who has joined
    socket.on('new-user', (name) => {
        user[socket.id] = name;
        socket.broadcast.emit('new-user joined', name)
    })

    // In this server firstly accept the event and takes the message sent by the client and the emit the event as a message to all the clients except the one who has sent it.  
    socket.on('send', (msg) => {
        socket.broadcast.emit('receive', { message: msg, name: user[socket.id] });
    })


    // On the disconnection of a client an event accepted by the server and emit the event to all the clients except the one who left.
    socket.on('disconnect', (name) => {
        socket.broadcast.emit('leave', name);
        delete user[socket.id];

    })
})

