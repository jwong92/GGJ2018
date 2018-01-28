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
			this.current_user_index = 0
			this.init()
		}

		init() {
			this.initCanvas()
			this.initListeners()
			this.Map = new Map(this.runGame.bind(this), this)
			this.players = this.Map.players
			this.planets = this.Map.planets
			this.asteroidFields = this.Map.asteroidFields
			this.satellites = []
			this.current_user = this.players[this.current_user_index]
		}

		initListeners() {
			this.canvas.addEventListener('click', this.placeSatellite.bind(this))
			this.canvas.addEventListener('mousemove', this.showPlanetDetails.bind(this))

		}
		canPlaceSatellite(sat){
			if(this.getDistanceBetween(sat,this.current_user)<=sat.range){
				sat.predessesor = this.current_user;
				return true
			}
			for (let satellite of this.current_user.satellites){
				if(this.getDistanceBetween(sat,satellite)<=sat.range){
					sat.predessesor = satellite;
					return true
				}
			}
			return false
		}
		getDistanceBetween(first,second){
			const xDif = first.x-second.x
			const yDif = first.y-second.y
			const distance = Math.sqrt( xDif*xDif+ yDif*yDif );
			return distance
		}
		placeSatellite(e) {
			var mousePos = this.getMousePos(e);

			var sattelite = this.Map.otherObjects[0];
			var sat = new Satellites(mousePos.x, mousePos.y, sattelite.range);
			sat.size = sattelite.size
			sat.object = sattelite.object


			// Check if cell is empty && (if we have the inventory OR the money)
			if (!this.objectOverlaps(sat) && this.canPlaceSatellite(sat) &&
				(this.current_user.amount > this.Map.satellite_price || this.current_user.sat > 0)) {
				this.current_user.satellites.push(sat);
				if(this.current_user.sat > 0){
					this.current_user.sat --;
				}
				else {
					this.current_user.amount -= this.Map.satellite_price;
					this.Map.satellite_price = Math.floor(this.Map.satellite_price * 1.2);
				}




				this.updateHud();
			}
			else {
				//show something that we dont have money
			}

		}

		initCanvas() {
			this.canvas = document.getElementById('space-game')
			this.ctx = this.canvas.getContext('2d');
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			this.money_updater = setInterval(this.update_money.bind(this), 10000);
		}

		objectOverlaps(obj) {
			let overlapPlayers = this.players.some(player => this.overlap(obj, player))
			let overlapPlanets = this.planets.some(planet => this.overlap(obj, planet))
			let overlapAsteroids = this.asteroidFields.some(af => this.overlap(obj, af))
			let overlapSatellitesPlayer1 = this.players[0] && this.players[0].satellites.some(satellite => this.overlap(obj, satellite))
			let overlapSatellitesPlayer2 = this.players[1] && this.players[1].satellites.some(satellite => this.overlap(obj, satellite))
			return overlapPlayers || overlapPlanets || overlapAsteroids || overlapSatellitesPlayer1 || overlapSatellitesPlayer2
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

		drawObjects(objects) {
			for (let object of objects) {
				this.ctx.drawImage(object.object, object.x - object.size / 2, object.y - object.size / 2, object.size, object.size);
			}
		}

		drawGalaxy() {
			this.drawLines();
			this.drawObjects(this.players)
			this.drawObjects(this.planets)
			this.drawObjects(this.asteroidFields)
			this.drawObjects(this.players[0].satellites)
			this.players[1] ? this.drawObjects(this.players[1].satellites) : null
			//this.drawClip();
		}
		drawClip(){
			this.ctx.beginPath();
			this.drawOneElementClip(this.current_user);
			for(let satellite of this.current_user.satellites ){
				this.drawOneElementClip(satellite);
			}
			this.ctx.globalCompositeOperation = 'destination-out';
			this.fillStyle = "black";
			this.ctx.fill();
			this.ctx.globalCompositeOperation = 'source-over';
		}
		drawOneElementClip(object){
			var distance = object.range;
			if(distance == null)
				distance = 150;
			this.ctx.arc(object.x,object.y, distance/2, 0, Math.PI*2, false);
		}
		drawLines(){
			for(let player of this.players){
				this.drawLineForPlayer(player);
			}
		}
		drawLineForPlayer(player){
			this.ctx.lineWidth = "2";
			this.ctx.strokeStyle = "red";
			for(let satellite of player.satellites){
				var from = satellite.predessesor;
				this.ctx.beginPath();
				this.ctx.moveTo(from.x, from.y);
				this.ctx.lineTo(satellite.x, satellite.y);
				this.ctx.stroke();
				this.ctx.closePath();
			}
		}
		update_money() {
			this.current_user.amount += this.current_user.rate;
			this.updateHud()
		}

		runGame() {
			requestAnimationFrame(this.runGame.bind(this))
			this.drawGalaxy()
			this.updateHud()
		}
		updateHud() {
			$("#money").html(this.current_user.amount)
			$(".inv.sat span").html(this.current_user.sat)
			$(".costs.sat span").html(this.Map.satellite_price)
			$("#money_rate").html(this.current_user.rate)
		}
		showPlanetDetails(e) {
			console.log("show planet fired");
			var mousePos = this.getMousePos(e);
			var planetArray = this.Map.planets;
			let hoveredPlanet = null
			// let overlapPlanets = this.planets.some(planet => this.overlap({x:mousePos.x,y:mousePos.y,size:1}, planet))
			let overlapPlanets = this.planets.some(function(planet){
				let isPlanetOverlapped = this.overlap({x:mousePos.x,y:mousePos.y,size:1}, planet);
				if(isPlanetOverlapped){
					hoveredPlanet=planet;
					return true
				}
				return false
			},this);
				if (overlapPlanets) {
					$("#planet_specs").attr("style", "");
					$("#planet_specs").css("top",mousePos.y+"px");
					$("#planet_specs").css("left",mousePos.x+"px");
					$("#planet_cost").html(hoveredPlanet.amount);
					$("#sat_bonus").html(hoveredPlanet.sat);
					 console.log("I'm on the planet!");
				} else {
					$("#planet_specs").css("display","none");
				}
			// var onPlanet = function(planet) {
			// 	let minX = planet.x - (planet.size/2);
			// 	let maxX = planet.x + (planet.size/2);
			// 	let minY = planet.y - (planet.size/2);
			// 	let maxY = planet.y + (planet.size/2);
			// 	//check if the mouse is currently over a planet
			// 	if (mousePos.x > minX && mousePos.x < maxX && mousePos.y > minY && mousePos.y < maxY){
			// 		$("#planet_specs").attr("style", "");
			// 		$("#planet_specs").css("top",mousePos.y+"px");
			// 		$("#planet_specs").css("left",mousePos.x+"px");
			// 		$("#planet_cost").html(planet.amount);
			// 		$("#sat_bonus").html(planet.sat);
			// 		 console.log("I'm on the planet!");
			// 	} else {
			// 		$("#planet_specs").css("display","none");
			// 	}
			// }
			// return planetArray.some(onPlanet);

		}

	}

	class Map {
		constructor(callback, gameObject) {
			this.game = gameObject
			this.objects = createRandomMap(window.innerWidth, window.innerHeight, 1, 5, 3)
			this.satellite_price = 100
			this.flag_price = 700
			this.loaded_images = 0
			this.total_images = 0
			this.players = this.objects[0]
			this.planets = this.objects[1]
			this.asteroidFields = this.objects[2]
			let satellite_link = this.game.current_user_index === 0 ? "img/stars/satellite-blue.svg" : "img/stars/satellite-red.svg"
			this.otherObjects = [
				{
					img: satellite_link,
					size: 25,
					range: 150
				}
			]
			this.loadImages(callback)
		}

		loadImages(callback) {
			this.createImageObjects(this.players, callback)
			this.createImageObjects(this.planets, callback)
			this.createImageObjects(this.asteroidFields, callback)
			this.createImageObjects(this.otherObjects, callback)
		}

		createImageObjects(elements, callback) {
			for (let name in elements) {
				elements[name].object = new Image();
				elements[name].object.src = elements[name].img;
				elements[name].object.onload = function () {
					this.itemLoaded(callback)
				}.bind(this);
			}
			this.total_images += elements.length
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
