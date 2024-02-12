const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express()
const Server = http.createServer(app)
const Sockets = socketio(Server)

app.use(express.static('public'))

var Users = {}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

Sockets.on('connection',(socket)=>{
    socket.emit('Connected', `Welcome ${socket.id}!`);

    console.log(`The user with "${socket.id}" id connect successfully.`);

    socket.on("CheckName", (command) => {
        if (Object.values(Users).includes(command.name)) socket.emit('NameExists')
        else socket.emit('NameAccepted')
    });

    socket.on("AddUser", (command) => {
        Users[socket.id] = command.name

        Sockets.emit('InfoText', { InfoMsg: `${command.name} in chat!` });
    })

    socket.on("GetMSG", (command) => {
        Sockets.emit('NewMSG', { By: command.by, Msg: command.msg });
    })

    socket.on('disconnect',()=>{
        Sockets.emit('InfoText', { InfoMsg: `${Users[socket.id]} out chat!` });

        Users[socket.id] = null
    })
})

var Port = 7001
Server.listen(7001, () => {
  console.log(`Chat Server running in port ${Port}`);
});