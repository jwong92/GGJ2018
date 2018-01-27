(function () {
	"use strict"
	// const socket = io("http://localhost:5000");
	const socket = io("https://galaxy-control.herokuapp.com");
	window.send = send
	socket.on('resend_info', (mess) => alert(mess));
	socket.emit('get_room', function (response) {
		console.log(response)
	});

	function send(message) {
		socket.emit('send_info', message)
	}

	class Game {

		constructor() {
			this.loaded_images = 0
			this.init()
		}

		init() {
			this.initCanvas()
			this.initListeners()
			this.Map = new Map(this.runGame.bind(this))
			this.players = this.Map.players
			this.planets = this.Map.planets
			this.asteroidFields = this.Map.asteroidFields
			this.satellites=[]
		}

		initListeners() {
			this.canvas.addEventListener('click',this.placeSatellite.bind(this))
		}
		placeSatellite(e){
			var mousePos = this.getMousePos(e);

			var sattelite = this.Map.otherObjects[0];
			var sat = new Satellites(mousePos.x,mousePos.y, sattelite.range);
			sat.size = sattelite.size
			sat.object = sattelite.object


			// Check if cell is empty
			if (!this.objectOverlaps(sat)) {
				this.satellites.push(sat);
			}

		}
		initCanvas(){
			this.canvas = document.getElementById('space-game')
			this.ctx = this.canvas.getContext('2d');
			this.canvas.width  = window.innerWidth;
			this.canvas.height = window.innerHeight;
		}
		objectOverlaps(obj){
			let overlapPlayers = this.players.some(player => this.overlap(obj, player))
			let overlapPlanets = this.planets.some(planet => this.overlap(obj, planet))
			let overlapAsteroids = this.asteroidFields.some(af => this.overlap(obj, af))
			let overlapSatellites = this.satellites.some(satellite => this.overlap(obj, satellite))
			return overlapPlayers || overlapPlanets ||overlapAsteroids|| overlapSatellites
		}
		overlap(newObj, existingObj) {
			let existing_obj_width = existingObj.size
			let new_obj_width = newObj.size
			return newObj.x + new_obj_width > existingObj.x &&
				newObj.x < (existingObj.x + existing_obj_width) &&
				newObj.y + new_obj_width > existingObj.y &&
				newObj.y < (existingObj.y + existing_obj_width)
		}
		generateRandomBetween(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min)
		}
		getMousePos(evt) {
			var rect = this.canvas.getBoundingClientRect();
			return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
			};
		}
		drawObjects(objects){
			for (let object of objects) {
				this.ctx.drawImage(object.object, object.x - object.size/2, object.y -object.size/2,object.size, object.size);
			}
		}
		drawGalaxy(){
			this.drawObjects(this.players)
			this.drawObjects(this.planets)
			this.drawObjects(this.asteroidFields)
			this.drawObjects(this.satellites)
		}
		runGame() {
			requestAnimationFrame(this.runGame.bind(this))
			this.drawGalaxy()
		}

	}

	class Map {
		constructor(callback) {
			this.objects = createRandomMap(window.innerWidth, window.innerHeight, 1, 5, 3)
			this.loaded_images = 0
			this.total_images = 0
			this.players = this.objects[0]
			this.planets = this.objects[1]
			this.asteroidFields = this.objects[2]
			this.otherObjects=[
				{
					img:"img/stars/satellite.svg",
					size:25,
					range:150
				}
			]
			this.loadImages(callback)
		}

		loadImages(callback) {
			this.createImageObjects(this.players,callback)
			this.createImageObjects(this.planets,callback)
			this.createImageObjects(this.asteroidFields,callback)
			this.createImageObjects(this.otherObjects,callback)
		}
		createImageObjects(elements,callback){
			for (let name in elements) {
				elements[name].object = new Image();
				elements[name].object.src = elements[name].img;
				elements[name].object.onload = function(){
					this.itemLoaded(callback)
				}.bind(this);
			}
			this.total_images+=elements.length
		}

		itemLoaded(callback) {
			this.loaded_images++
			if (this.loaded_images >= this.total_images) {
				callback();
			}
		}
	}

	window.onload = () => new Game();
})()