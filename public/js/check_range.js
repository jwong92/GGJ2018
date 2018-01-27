// draw universe
var myUniverse = createRandomMap(800, 800, 1, 5, 3);

var canva = document.getElementById('space-game');
var ctxs;
if (canva.getContext) {
  ctxs = canva.getContext('2d');
  }


var images = [];
var imagesPaths = ["img/planets/planet1.png","img/planets/planet2.png","img/stars/4pt-star.png"];
var loadedImages = 0;
for (var i = 0; i < imagesPaths.length; i++) {
	var image = new Image();
	image.addEventListener('load',function(){
		loadedImages++;
		if(loadedImages == imagesPaths.length)
			onImageLoad();
	});
	image.src = imagesPaths[i];
	images[i] = image;
}


function onImageLoad(){
	// Draw our universe
	for (var i = 0; i < myUniverse.length; i++) {
		for(var j= 0; j < myUniverse[i].length; j++) {

			// put object to canvas
			var img;
			switch(i) {
				case 0 :
					img = images[0]; // player
					break;
				case 1 :
					img = images[1]; // planet
					break;
				case 2 :
					img = images[2] // asteroid
					break;
			}
			
		  // execute drawImage statements here
		  ctxs.drawImage(img, myUniverse[i][j].x - myUniverse[i][j].size/2, myUniverse[i][j].y - myUniverse[i][j].size/2, myUniverse[i][j].size, myUniverse[i][j].size);
			
			// ctxs.fillStyle = 'rgb(200, 0, 0)';
	  // 	ctxs.fillRect(myUniverse[i][j].x, myUniverse[i][j].y, myUniverse[i][j].size, myUniverse[i][j].size);
		}
	}
}
// listen to user click

// add object (satellite) where user clicked

// check if in the range of the satellite there is a planet
