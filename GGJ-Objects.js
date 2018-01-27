//Planets
var Planets(posX, posY, amt, satNum, owner, img) {
  x: posX,
  y: posY,
  currency: amt,
  satellites: satNum,
  photo: img
}
//Satellites
var Satellites(posX, posY, range) {
  x: posX,
  y: posY,
  area: range
}
//Asteroids
var AsteroidField(posX, posY, height, width) {
  x: posX,
  y: posY,
  h: height,
  w: width
}
