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
	this.area = range;
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
function Players(posX, posY, amt, satNum, img) {
	this.x = posX;
	this.y = posY;
	this.amount = amt;
  this.rate = startingRate;
	this.sat = satNum;
	this.img = img;
}
