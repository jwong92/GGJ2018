//variables we need to define
var PlayerPlanetAmount = 10;
var playerImage = "images/planet.jpg";
var planetImage = "images/planet1.jpg";

var StartingSatelites = 3;
var SatelitesRange = 10;
var asteroidsSize = 3;
// sizes ranges for players, planets and android fields
var sizes = [[10, 15], [5, 5], [20, 20]];
// amt ranges for planets
var planetAmtRange = [10, 20];
// range of satelites per planet
var satPerPlanetRange = [2, 3];

var width;
var height;


function createRandomMap(width, height, players, planets, asteroids)
{
	this.width = width;
	this.height = height;
	var indexes = [players, planets, asteroids]
	var objects = new Array(3);
	for (var i = 0; i < objects.length; i++) {
		//players, planets, androidfields.
		objects[i] = [];
	}
	
	// first we loop through each type of element
	for (var i = 0; i < indexes; i++) {
		//defina a random size between its range
		var sizeRange = sizes[i];
		var size = (Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0]);
		var xy = getNextXY(objects, size);
		if(i == 0){
			objects[i] = new Players(xy[0], xy[1], PlayerPlanetAmount, StartingSatelites, playerImage);
		}
		else if(i == 1) {
			var amt = (Math.random() * (planetAmtRange[1] - planetAmtRange[0]) + planetAmtRange[0]);
			var satNum = (Math.random() * (satPerPlanetRange[1] - satPerPlanetRange[0]) + satPerPlanetRange[0]);
			objects[i] = new Planets(xy[0], xy[1], amt, satNum, planetImage);
		}
		else if(i == 2){
			objects[i] = new Planets(xy[0], xy[1], size, size);
		}
		
	}

	return objects;
}



function getNextXY(objects, width, height, size){
	var x = Math.floor(Math.random() * this.width);
	var y = Math.floor(Math.random() * this.height);

	while(!overlap(objects,x,y,size)){
		var x = Math.floor(Math.random() * this.width);
		var y = Math.floor(Math.random() * this.height);
	}	
	return [x,y]
}

function overlap(objects, x, y, size){
	var minDistance = 0;
	for (var i = 0; i < objects.length; i++) {
		for (var j = 0; j < objects[j].length; j++) {
			if(distance(objects[i][j]) - minDistance - size - objects[i][j] < 0){
				return true;
			}
		}
	}
	return false;
}

function distance(object,x,y)
{
	return Math.sqrt(Math.pow(object.x - x) + Math.pow(object.y - y));
}

/*
function createRandomMap(width, height, players, planets, asteroids)
{
	var objects = new Array(4);
	for (var i = 0; i < objects.length; i++) {
		objects[i] = [];
	}
	
	// start asteroids
	for (var i = 0; i < asteroids; i++) 
	{
		var xy = getNextXY(map);
		for (var j = 0; j < asteroidsSize; j++) 
		{
			for (var k = 0; k < asteroidsSize; k++) 
			{
				if (map[xy[0]-1+j][xy[1]-1+k]== null) 
				{
					map[xy[0]-1+j][xy[1]-1+k] = new AsteroidField(xy[0]-1+j,xy[1]-1+k,1,1);
				}
			}
		}
	}

	// start players planets
	for (var i = 0; i < players; i++) {
		var xy = getNextXY(map);
		map[xy[0]][xy[1]] = new Planets(xy[0],xy[1],PlayerPlanetAmount,StartingSatelites,playerImage)
	}

	// start alien planets
	for (var i = 0; i < planets; i++) {
		var xy = getNextXY(map);
		map[xy[0]][xy[1]] = new Planets(xy[0],xy[1],PlayerPlanetAmount,StartingSatelites,playerImage);
	}

	return map;


}



function getNextXY(map)
{
	var x = Math.floor(Math.random()*map.length);
	var y = Math.floor(Math.random()*map[0].length);
	console.log(x,y);
	console.log(map[x]);
	while(map[x][y] != null)
	{
		x = Math.floor(Math.random()*map.length);
		y = Math.floor(Math.random()*map[0].length);
	}	
	return [x,y]
}