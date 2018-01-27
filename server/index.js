const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
require('./routes')(app)
require('./websocketEvents')(io)

module.exports = server