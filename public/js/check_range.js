//
//
// // draw universe
// var myUniverse = createRandomMap(window.innerWidth, window.innerHeight, 1, 5, 3);
//
// var canva = document.getElementById('space-game');
// var ctxs;
//
// // // Set canvas width
//
// canva.width  = window.innerWidth;
// canva.height = window.innerHeight;
//
// if (canva.getContext) {
//   ctxs = canva.getContext('2d');
//  //  canva.width = 800;
// 	// canva.height = 800;
//   }
//
//
// var images = [];
// var imagesPaths = [
// 	"img/planets/planet1.svg"
// 	, "img/planets/planet2.svg"
// 	, "img/planets/planet3.svg"
// 	, "img/planets/planet4.svg"
// 	, "img/planets/planet5.svg"
// 	, "img/planets/planet6.svg"
// 	, "img/planets/planet7.svg"
// 	, "img/stars/4pt-star.svg"
// 	, "img/stars/asteroid.svg"
// 	, "img/stars/satellite.svg"
// 	];
// var loadedImages = 0;
// var players = myUniverse[0]
// var planets = myUniverse[1]
// var asteroidFields = myUniverse[2]
// for (let name in players) {
// 	players[name].object = new Image();
// 	players[name].object.src = players[name].img;
// 	players[name].object.onload = itemLoaded;
// }
// for (let name in planets) {
// 	planets[name].object = new Image();
// 	planets[name].object.src = planets[name].img;
// 	planets[name].object.onload = itemLoaded;
// }
// for (let name in asteroidFields) {
// 	asteroidFields[name].object = new Image();
// 	asteroidFields[name].object.src = asteroidFields[name].img;
// 	asteroidFields[name].object.onload =  itemLoaded;
// }
// // for (var i = 0; i < imagesPaths.length; i++) {
// // 	var image = new Image();
// // 	image.addEventListener('load',function(){
// // 		loadedImages++;
// // 		if(loadedImages == imagesPaths.length)
// // 			onImageLoad();
// // 	});
// // 	image.src = imagesPaths[i];
// // 	images[i] = image;
// // }
// function itemLoaded() {
// 	loadedImages++
// 	if (loadedImages >= (players.length+planets.length+asteroidFields.length)) {
// 		onImageLoad();
// 	}
// }
//
// function onImageLoad(){
// 	// Draw our universe
// 	for (let player of players) {
// 		ctxs.drawImage(player.object, player.x - player.size/2, player.y -player.size/2,player.size, player.size);
// 	}
// 	for (let planet of planets) {
// 		ctxs.drawImage(planet.object, planet.x - planet.size/2, planet.y -planet.size/2,planet.size, planet.size);
// 	}
// 	for (let af of asteroidFields) {
// 		ctxs.drawImage(af.object, af.x - af.size/2, af.y -af.size/2,af.size, af.size);
// 	}
//
// 	// for (var i = 0; i < myUniverse.length; i++) {
// 	// 	for(var j= 0; j < myUniverse[i].length; j++) {
// 	// 	  // execute drawImage statements here
// 	// 	  console.log(myUniverse[i][j]);
// 	// 	  ctxs.drawImage(images[myUniverse[i][j].img], myUniverse[i][j].x - myUniverse[i][j].size/2, myUniverse[i][j].y - myUniverse[i][j].size/2, myUniverse[i][j].size, myUniverse[i][j].size);
// 	//
// 	// 		// ctxs.fillStyle = 'rgb(200, 0, 0)';
// 	//   // 	ctxs.fillRect(myUniverse[i][j].x, myUniverse[i][j].y, myUniverse[i][j].size, myUniverse[i][j].size);
// 	// 	}
// 	// }
// }
// // listen to user click
//
// // Get mouse position
// function getMousePos(canvas, evt) {
//   var rect = canvas.getBoundingClientRect();
//   return {
//     x: evt.clientX - rect.left,
//     y: evt.clientY - rect.top
//   };
// }
//
// console.log(ctxs);
//
// var rect = canva.getBoundingClientRect();
// canva.onclick = function (e) {
//     var rectWidth = 50;
//     var rectHeigh = 50;
//     var range = 150;
//     var size = 25;
//     ctxs.fillStyle = 'rgb(200, 0, 0)';
//     console.log(e);
//
//     var mousePos = getMousePos(canva, e);
//     // ctxs.fillRect(e.pageX - rect.left - rectWidth/2, e.pageY - rect.top - rectHeigh/2, rectWidth, rectHeigh);
//     // ctxs.fillRect(e.x, e.y, rectWidth, rectHeigh);
//     var sattelite = images[9];
//     var marginLeft = canva.style.marginLeft;
//     console.log(canva.offsetWidth,canva.offsetHeight );
//     var sat = new Satellites(mousePos.x/canva.offsetWidth*window.innerWidth - size/2,
//     	mousePos.y/canva.offsetHeight*window.innerHeight - size/2
//     	, range, 9);
// 	sat.size = size;
//
//
//     // Check if cell is empty
//     console.log("my universe",myUniverse);
//     if (!overlap(myUniverse, sat.x, sat.y, 25)) {
// 	    myUniverse[3].push(sat);
// 	    ctxs.drawImage(sattelite
// 	    	, mousePos.x/canva.offsetWidth*window.innerWidth - sat.size/2
// 	    	, mousePos.y/canva.offsetHeight*window.innerHeight - sat.size/2
// 	    	, sat.size
// 	    	, sat.size);
//   }
//
//   }
// // add object (satellite) where user clicked
//
// // check if in the range of the satellite there is a planet
