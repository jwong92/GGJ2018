const path = require('path');
const express = require('express');

function Routes(app) {
	app
		.use(express.static(path.join(__dirname, '/../public')))
		.get("/", function (req, res) {
			res.sendFile(path.join(__dirname, '/../public', 'index.html'));
		})
}

module.exports = Routes