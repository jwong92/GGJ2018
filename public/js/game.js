(function () {
	"use strict"
	// const socket = io("http://localhost:5000");
	 const socket = io("https://galaxy-control.herokuapp.com");
	document.getElementById('start').addEventListener('click',function () {
		socket.emit('get_room', function (objects,index) {
			new Game(objects,index)
		});
	})
	class Game {

		constructor(objects,index) {
			this.loaded_images = 0
			this.current_user_index = index
			this.Map = new Map(this.runGame.bind(this),objects)
			this.init()
		}

		init() {
			this.initCanvas()
			this.initListeners()
			this.players = this.Map.players
			this.planets = this.Map.planets
			this.asteroidFields = this.Map.asteroidFields
			this.satellites = []
			this.current_user = this.players[this.current_user_index]
			this.defaultOffset=30
			this.xOffset=this.current_user.x>1000?this.Map.globalWidth-this.canvas.width:0
			this.yOffset=this.current_user.y>1000?this.Map.globalHeight-this.canvas.height:0
			console.log(this.current_user_index);
			if(this.current_user_index === 0){
				$(".sat").attr("src", "img/stars/satellite-blue.svg");
				$(".flag").attr("src", "img/flags/flag-blue.svg");
			}
			this.scoreCounter()
		}
		manageKeys(key, ev) {
			switch (key) {
				case 37:
				case 65:
				case 'left':
					ev.preventDefault()
					if(this.xOffset<=0)return
					this.xOffset-=this.defaultOffset
					break;
				case 38:
				case 87:
				case 'up':
					ev.preventDefault()
					if(this.yOffset<=0)return
					this.yOffset-=this.defaultOffset
					break;
				case 39:
				case 68:
				case 'right':
					ev.preventDefault()
					if(this.xOffset>=this.Map.globalWidth-this.canvas.width)return
					this.xOffset+=this.defaultOffset
					break;
				case 40:
				case 83:
				case 'down':
					ev.preventDefault()
					if(this.yOffset>=this.Map.globalHeight-this.canvas.height)return
					this.yOffset+=this.defaultOffset
					break;
			}
		}
		initListeners() {
			$("#btn_sat").click(this.onClickBtnSat.bind(this));
			$("#btn_flag").click(this.onClickBtnFlag.bind(this));
			this.canvas.addEventListener('mousemove', this.showPlanetDetails.bind(this))
			document.getElementById('form').onsubmit=(ev)=>{
				ev.preventDefault()
				const message = document.getElementById('messageToOpponent').value
				if(message){
					socket.emit('send_info', message)
				}
				document.getElementById('form').reset()
				return false
			}
			document.addEventListener('keydown',(ev) =>{
				let key = ev.keyCode;
				if(ev.target.id==="messageToOpponent") return
				this.manageKeys(key, ev)
			})

			socket.on('end game', (mess) => {
				alert(mess)
				// window.location.href = window.location.href
			});
			socket.on('updateSatellites',(index,satellites) =>{
				var enemySattelite = this.current_user_index===0?this.Map.otherObjects[1]:this.Map.otherObjects[0];
				satellites.forEach((satellite)=>{
					satellite.object=enemySattelite.object
				})
				this.players[index].satellites=satellites
			})
			socket.on('resend_info', (mess) => {
				let messageElem =$("#messageFromOpponent")
				messageElem.fadeIn()
				messageElem.text(mess)
				messageElem.fadeOut(5000)
			});
			socket.on('planet_flags_update', (planet) => {
				const updatedPlanet = this.planets.find((pl)=>pl.id===planet.planetId)
				if(planet.flag1){
					updatedPlanet.flag1=planet.flag1
				}else{
					updatedPlanet.flag2=planet.flag2
				}

			});
		}
		onClickBtnSat(){
			$('#space-game').unbind('click');
			$('#space-game').bind('click', this.placeSatellite.bind(this))
		}
		onClickBtnFlag(){
			$('#space-game').unbind('click');
			$('#space-game').bind('click', this.setFlag.bind(this))
		}
		canPlaceSatellite(sat){
			if(this.getDistanceBetween(sat,this.current_user)<=sat.range){
				sat.predessesor = [this.current_user.x, this.current_user.y,this.current_user.size];
				return true
			}
			for (let satellite of this.current_user.satellites){
				if(this.getDistanceBetween(sat,satellite)<=sat.range){
					sat.predessesor = [satellite.x, satellite.y,satellite.size];
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
			// $('#space-game').unbind('click')

			var mousePos = this.getMousePos(e);

			var sattelite = this.current_user_index===0?this.Map.otherObjects[0]:this.Map.otherObjects[1];
			var sat = new Satellites(mousePos.x, mousePos.y, sattelite.range);
			sat.size = sattelite.size
			sat.object = sattelite.object

			this.showMssg(!this.canPlaceSatellite(sat),"You cannot place a satellite here");

			// Check if cell is empty && (if we have the inventory OR the money)
			if (!this.objectOverlaps(sat) && this.canPlaceSatellite(sat) &&
				(this.current_user.amount > this.Map.satellite_price || this.current_user.sat > 0)) {
				this.current_user.satellites.push(sat);
				socket.emit('satelites_changed',this.current_user.satellites,this.current_user_index)
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

		setFlag(e){
			// $('#space-game').unbind('click')
			let posX = e.clientX+this.xOffset;
			let posY = e.clientY+this.yOffset;
			let overLappedPlanet = null;
			let mousePos = this.getMousePos(e);

			let satClose;
			let money = true;
			let planet = true;

			//Determine if planet clicked, and which planet was clicked
			let overlapPlanets = this.planets.some(function(planet){
				let temp = {size:1,x:mousePos.x,y:mousePos.y}
				let isPlanetOverlapped = this.overlap(temp, planet)
				if(isPlanetOverlapped){
					overLappedPlanet = planet
					return true
				}
				return false

			}.bind(this))

			//Determine which satellite is closest to clicked
			//currSat = boolean of if a satellite was close enough
			if(overlapPlanets) {
					satClose=this.current_user.satellites.some(function(satellite){
					let newSatDistance = this.satDistance(satellite, posX, posY)
					if (newSatDistance <= satellite.range){
						if (this.current_user.amount >= 400){
							if(this.current_user_index === 0) {
								overLappedPlanet.flag1 += 1;
								socket.emit('planet_flags_changed',{planetId:overLappedPlanet.id,flag1:overLappedPlanet.flag1})
							}
							else {
								overLappedPlanet.flag2 += 1;
								socket.emit('planet_flags_changed',{planetId:overLappedPlanet.id,flag2:overLappedPlanet.flag2})
								this.showMssg(planet, "You just gained a planet");
							}
							this.current_user.amount -= 400;
							this.current_user.sat += overLappedPlanet.sat;
						} else {
							this.showMssg(money, "You don't have enough money");
						}
						return true;
					}
					else {
						return false;
					}
				}.bind(this))
				this.showMssg(!satClose, "Your satellite is out of range");
			}
			this.checkWinner();
		}
		checkWinner(){
			let counter = [0,0];
			let message = ""
			for(let planet of this.planets){
				let index = this.getownerIndex(planet);
				if(index != -1)
					counter[index]++;
			}
			let dominance = [counter[0]/this.planets.length, counter[1]/this.planets.length];
			if(!(dominance[0]<=0.5 && dominance[1]<=.5)){
				alert(this.getfinalMessage(dominance))
			}
			return counter;
		}
		getownerIndex(planet){
			if(planet.flag1 > planet.flag2)
				return 0;
			if(planet.flag2 > planet.flag2)
				return 1;
			return -1;
		}
		getfinalMessage(dominance)
		{
			if(dominance[this.current_user_index]>.5)
				return "you win!";
			else
				return "you loose"
		}
		satDistance(object, x, y) {
			return Math.sqrt(Math.pow(object.x - x, 2) + Math.pow(object.y - y, 2));
		}

		showMssg(specifics, mssg){
			//if you don't have enough money
			if(specifics) {
				//show the box and write html
				$("#message").html(mssg);
				$("#mssgBox").css("display", "inherit");
				$("#mssgBox").fadeOut(1100);
			}
		}

		initCanvas(){
			this.canvas = document.getElementById('space-game')
			this.ctx = this.canvas.getContext('2d');
			this.canvas.width = this.canvas.clientWidth;
			this.canvas.height =  this.canvas.clientHeight;
			this.money_updater = setInterval(this.update_money.bind(this), 10000);
		}

		objectOverlaps(obj) {
			let overlapPlayers = this.players.some(player => this.overlap(obj, player))
			// let overlapPlanets = this.planets.some(planet => this.overlap(obj, planet))
			let overlapPlanets = this.planets.some(function(planet){
				return this.overlap(obj, planet)
			}.bind(this))
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
				x: evt.clientX - rect.left+this.xOffset,
				y: evt.clientY - rect.top+this.yOffset
			};
		}

		drawObjects(objects) {
			for (let object of objects) {
				this.ctx.drawImage(object.object, object.x-this.xOffset , object.y-this.yOffset, object.size, object.size);
			}
		}
		drawFlags(){
			this.planets.forEach((planet)=>{
				let blueFlag = this.Map.otherObjects[2]
				let redFlag = this.Map.otherObjects[3]
				if (planet.flag1 > planet.flag2) {
					this.ctx.drawImage(blueFlag.object, planet.x+planet.size/2-blueFlag.size/2-this.xOffset  , planet.y-blueFlag.size-this.yOffset, blueFlag.size, blueFlag.size);
				}else if(planet.flag1 < planet.flag2){
					this.ctx.drawImage(redFlag.object, planet.x+planet.size/2-redFlag.size/2-this.xOffset  , planet.y-redFlag.size-this.yOffset, redFlag.size, redFlag.size);
				}
			})
		}
		drawGalaxy() {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			this.drawClip();
			this.drawLines();
			this.drawObjects(this.players)
			this.drawObjects(this.planets)
			this.drawFlags()
			this.drawObjects(this.asteroidFields)
			this.drawObjects(this.players[0].satellites)
			this.players[1] ? this.drawObjects(this.players[1].satellites) : null
		}
		drawClip(){
			// this.clearRect(0,0,window.innerWidth,window.innerHeight)
			this.fillStyle = "black";
			// this.ctx.beginPath();
			this.ctx.globalCompositeOperation = "source-over"
			this.drawOneElementClip(this.current_user);
			this.ctx.fillRect(0,0,this.Map.globalWidth,this.Map.globalHeight);
			this.ctx.moveTo(0,0);
			for(let satellite of this.current_user.satellites ){
				this.drawOneElementClip(satellite);
			}

			this.ctx.globalCompositeOperation = 'xor';
			this.ctx.fill();
			// this.closePath();

			this.ctx.globalCompositeOperation = 'destination-over';
		}
		drawOneElementClip(object){
			var distance = object.range;
			if(distance == null)
				distance = 150;
			this.ctx.moveTo(object.x-this.xOffset, object.y-this.yOffset);
			this.ctx.arc(object.x-this.xOffset,object.y-this.yOffset, distance, 0, Math.PI*2, false);
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
				this.ctx.moveTo(from[0]+from[2]/2-this.xOffset, from[1]+from[2]/2-this.yOffset);
				this.ctx.lineTo(satellite.x+satellite.size/2-this.xOffset, satellite.y+satellite.size/2-this.yOffset);
				this.ctx.closePath();
				this.ctx.stroke();
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
			// $("#money_rate").html(this.current_user.rate)
			$("#money_rate").html(this.calculateTotalRate())
		}
		calculateTotalRate(){
			let userPlanets = this.planets.filter((planet)=>{
				return this.current_user_index===0?
					planet.flag1>planet.flag2:
					planet.flag2>planet.flag1
			})
			let rate_for_planets=0
			userPlanets.forEach((planet)=>{
				rate_for_planets+=planet.amount
			})
			return rate_for_planets+this.current_user.rate
		}
		showPlanetDetails(e) {
			var mousePos = this.getMousePos(e);
			var planetArray = this.Map.planets;
			let hoveredPlanet = null
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

					if(this.isNearRightEdgeOfScreen(e)) {
						$("#planet_specs").css("left",mousePos.x-this.xOffset-200+"px");
					} else {
						$("#planet_specs").css("left",mousePos.x-this.xOffset+5+"px");
					}
					$("#planet_specs").css("top",mousePos.y-this.yOffset-hoveredPlanet.size+"px");
					$("#planet_rate").html(hoveredPlanet.amount);
					$("#sat_bonus").html(hoveredPlanet.sat);
					$("#flag_red").html(hoveredPlanet.flag2);
					$("#flag_blue").html(hoveredPlanet.flag1);
				} else {
					$("#planet_specs").css("display","none");
				}
		}//end of showPlanetDetails
		scoreCounter() {
			let planets = this.Map.planets;
			let counterArray = this.checkWinner();
			$("#planet_total").html(planets.length);
			if (this.current_user_index === 0){
				$("#user_score").html(counterArray[0]);
			} else {
				$("#user_score").html(counterArray[1]);
			}
		}//end of scoreCounter

		isNearRightEdgeOfScreen(e){
		  var mousePosX = this.getMousePos(e).x-this.xOffset;
		  var endOfScreenX = window.innerWidth;
		  let distance = endOfScreenX - mousePosX;

		  if(distance < 175) {
		    return true;
		  }
		  else {
		    return false;
		  }
		}

	}//end of Game class
	class Map {
		constructor(callback, objects) {
			this.objects = objects
			this.satellite_price = 100
			this.flag_price = 700
			this.loaded_images = 0
			this.total_images = 0
			this.players = this.objects[0]
			this.planets = this.objects[1]
			this.asteroidFields = this.objects[2]
			this.globalWidth = this.objects[4][0]
			this.globalHeight = this.objects[4][1]
			this.otherObjects = [
				{
					img: "img/stars/satellite-blue.svg",
					size: 40,
					range: 150
				},
				{
					img: "img/stars/satellite-red.svg",
					size: 40,
					range: 150
				},
				{
					img: "img/flags/flag-blue.svg",
					size: 40
				},
				{
					img: "img/flags/flag-red.svg",
					size: 40
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

	// window.onload = () => new Game();
})()
