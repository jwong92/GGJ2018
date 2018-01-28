const mapGenerator = require("./randomMapGenerator")

function socketEvents(io) {
	const rooms = []
	io.on('connection', async function (socket) {
		socket.on('get_room', function (callback) {
			"use strict"
			let connected = false
			let i = rooms.length
			while (i--) {
				let room = rooms[i]
				if (room.participants.length === 0) {
					rooms.splice(i, 1)
					continue
				}
				if (room.participants.length === 1 && !connected) {
					connected = true
					let index = room.participants.push(socket)-1
					socket.join(room.id);
					socket.roomId = room.id
					// io.sockets.in(room.id).emit('gameInfo', ['cool stuff']);
					callback(room.objects,index)
				}

			}

			if (!connected) {
				const objects = mapGenerator(3000, 3000, 2, 15, 13)
				let newRoom = {id: rooms.length, participants: [socket], objects}
				socket.roomId = newRoom.id
				rooms.push(newRoom)
				connected = true
				socket.join(newRoom.id);
				//generate map
				callback(objects,0)
			}
			console.log(rooms)
		})
		socket.on('satelites_changed', (satellites,userindex) => {
			socket.broadcast.to(socket.roomId).emit('updateSatellites', userindex,satellites);
		})
		socket.on('disconnect', () => {
			let closingRoom = rooms[socket.roomId]
			let loserIndex = null
			if (!closingRoom) return
			closingRoom.participants.find((s, i) => {
				if(s.id === socket.id){
					loserIndex = i
				}
				return s.id === socket.id
			})
			closingRoom.participants.splice(loserIndex,1)
			socket.broadcast.to(closingRoom.id).emit('end game', `You won since your opponent has left`);
		})
	});
}

module.exports = socketEvents