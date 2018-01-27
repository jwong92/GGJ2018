(function () {
	"use strict"
	const canvas = document.getElementById('space-game')
	const ctx = canvas.getContext('2d');
	// const socket = io("http://localhost:5000");
	const socket = io("https://galaxy-control.herokuapp.com");
	window.send=send
	socket.on('resend_info', (mess)=>alert(mess));

	function send(message) {
		socket.emit('send_info', message)
	}
})()