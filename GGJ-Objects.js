//Planets
function Planets(posX, posY, amt, satNum, img) {
  this.x = posX;
  this.y = posY;
  this.amount = amt;
  this.sat = satNum;
  this.photo = img;
}

//Satellites
function Satellites(posX, posY, range) {
  this.x = posX;
  this.y = posY;
  this.area = range;
}
//Asteroids
function AsteroidField(posX, posY, height, width) {
  this.x = posX;
  this.y = posY;
  this.h = height;
  this.w = width;
}
