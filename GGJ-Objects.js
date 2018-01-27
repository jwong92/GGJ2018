//Planets
function Planets(posX, posY, amt, satNum, img) {
  this.x = posX;
  this.y = posY;
  this.amount = amt;
  this.sat = satNum;
  this.img = img;
}

//Satellites
function Satellites(posX, posY, range, img) {
  this.x = posX;
  this.y = posY;
  this.area = range;
  this.img = img;
}
//Asteroids
function AsteroidField(posX, posY, height, width, img) {
  this.x = posX;
  this.y = posY;
  this.h = height;
  this.w = width;
  this.img = img;
}

//Players
function Players(posX, posY, amt, satNum, img) {
  this.x = posX;
  this.y = posY;
  this.amount = amt;
  this.sat = satNum;
  this.img = img;
}
