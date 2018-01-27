//Planets
function Planets(posX, posY, amt, satNum, img,size) {
	this.x = posX;
	this.y = posY;
	this.amount = amt;
	this.sat = satNum;
	this.img = img;
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
	this.sat = satNum;
	this.img = img;
}
