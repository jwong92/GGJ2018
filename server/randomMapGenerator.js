//variables we need to define
var PlayerPlanetAmount = 700;
var StartingSatelites = 3;
var SatelitesRange = 10;
var asteroidsSize = 3;
// sizes ranges for players, planets and android fields
var sizes = [[60, 80], [60, 80], [50,60]];
// amt ranges for planets
var planetAmtRange = [15, 30];
// range of satelites per planet
var satPerPlanetRange = [2, 3];

var width;
var height;

function generateRandomBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}
function createRandomMap(width, height, players, planets, asteroids)
{
	this.width = width;
	this.height = height;
	var indexes = [players, planets, asteroids,0]
	var objects = new Array(4);
	for (var i = 0; i < objects.length; i++) {
		//players, planets, androidfields and empty array of satelites.
		objects[i] = [];
	}
	
	// first we loop through each type of element
	for (var i = 0; i < indexes.length; i++) {
		//loop through the amount of objects we have to create
		for (var j = 0; j < indexes[i]; j++) {
			//defina a random size between its range
			var sizeRange = sizes[i];
			var size = Math.floor(Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0]);
			//call for a new random position
			var xy = getNextXY(objects, size);
			// var img = Math.floor(Math.random() * (images[i][1] - images[i][0]) + images[i][0]);
			var img;
			//create objects depending of the current index of element type;
			if(i == 0){
				let up=generateRandomBetween(0,1)
				img = "img/planets/planet1.svg";
				objects[i].push(new Players(j===0?20:width-10-size, up?20:height-10-size, PlayerPlanetAmount, StartingSatelites, img,size));
			}
			else if(i == 1) {
				//we create random atributes special for planets
				img = "img/planets/planet"+generateRandomBetween(2,7)+".svg";
				var amt = Math.floor(Math.random() * (planetAmtRange[1] - planetAmtRange[0]) + planetAmtRange[0]);
				var satNum = Math.floor(Math.random() * (satPerPlanetRange[1] - satPerPlanetRange[0]) + satPerPlanetRange[0]);
				objects[i].push(new Planets(xy[0], xy[1], amt, satNum, img,size));
			}
			else if(i == 2){
				img = "img/stars/asteroid.svg";
				objects[i].push(new AsteroidField(xy[0], xy[1], size, size, img,size));
			}
		}
	}
	objects[4]=[width,height]
	//we return an array of arrays
	return objects;
}



function getNextXY(objects, size){
	//create new position
	var x = Math.floor(Math.random() * this.width);
	var y = Math.floor(Math.random() * this.height);

	//while it overlaps another object, we create another position
	while(overlap(objects,x,y,size)){
		var x = Math.floor(Math.random() * this.width);
		var y = Math.floor(Math.random() * this.height);
	}	
	//return a valid position
	return [x,y]
}

function overlap(objects, x, y, size){
	//minimum distance we want objects to be separated by
	var minDistance = 20;
	//foreach object, we check if the distance is greater than the half of both objects sizes and the minimum distance required
	//if we find 1 object, we return true for overlaping
	for (var i = 0; i < objects.length; i++) {
		for (var j = 0; j < objects[i].length; j++) {
			// console.log(objects[i][j], x, y, size, distance(objects[i][j], x, y),
			// 	distance(objects[i][j], x, y) - minDistance - Math.ceil(size/2) - Math.ceil(objects[i][j].size/2),
			// 	"size: " + Math.ceil(size/2)
			// 	, "object: " + objects[i][j].size);
			if(distance(objects[i][j], x, y) - minDistance - size/2 - objects[i][j].size/2 < 0){
				return true;
			}
		}
	}
	return false;
}

//distance between 2 objects;
function distance(object,x,y)
{	
	return Math.sqrt(Math.pow(object.x - x, 2) + Math.pow(object.y - y, 2));
}
//fixed values
var startingRate = 20;


//Planets
function Planets(posX, posY, amt, satNum, img,size) {
	this.x = posX;
	this.y = posY;
	this.amount = amt;
	this.sat = satNum;
	this.img = img;
	this.flag1 = 0;
	this.flag2 = 0;
	this.size = size;
}

//Satellites
function Satellites(posX, posY, range, img,size) {
	this.x = posX;
	this.y = posY;
	this.range = range;
	this.img = img;
	this.size = size;
}

//Asteroids
function AsteroidField(posX, posY, height, width, img,size) {
	this.x = posX;
	this.y = posY;
	this.h = height;
	this.w = width;
	this.img = img;
	this.size =size;
}

//Players
function Players(posX, posY, amt, satNum, img,size) {
	this.x = posX;
	this.y = posY;
	this.amount = amt;
	this.rate = startingRate;
	this.sat = satNum;
	this.img = img;
	this.satellites=[]
	this.planets=[]
	this.size =size;
}

module.exports = createRandomMap