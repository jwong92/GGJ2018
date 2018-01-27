$(document).ready(function() {

  var numStars = 30;
  var homepagePlanets = 4;
  var numPlanets = 7;
  var StarSrc = ["<img src='img/stars/4pt-star.svg'/>"];
  var planetSrc = [];

//Adding planet src to array
  function getPlanSrcArr() {
    let src = "";
    for (var i=1; i<=numPlanets; i++){
      src = "<img src='img/planets/planet" + i + ".svg'/>"
      planetSrc.push(src);
    }
  }

//Create planets
for (var i=0; i<homepagePlanets; i++) {
  getPlanSrcArr();

  //Generate random planet array num
  var randomPlan = Math.floor((Math.random() * numPlanets) + 1);
  let planet = $(planetSrc[randomPlan]).attr({
    class: "planet-" + i
  })
  $("#planets").append(planet);

  //Generate random positions of the canvas
  var planPosX = Math.floor((Math.random() * 90) + 5);
  var planPosY = Math.floor((Math.random() * 72) + 23);

  //Place planets randomly on canvas
  $(planet).css("top", planPosX + "%");
  $(planet).css("left", planPosY + "%");
  $(planet).css("fontSize", "5em");

}

//Create Stars
  for (var i=0; i<=numStars; i++) {
    let star = $(StarSrc[0]).attr({
      class: "star-" + i
    })
    $("#stars").append(star);
  }

//For each of the star
  for (var i=0; i<=numStars; i++) {
    let currStar = ".star-" + i;

    //Randomly generate size of star and assign
    let randomSize = Math.round((Math.random() * 2), 2);
    $(currStar).css("fontSize", randomSize + "em");

    //randomly generate star position and assign
    let starPosX = Math.floor((Math.random() * 90) + 5);
    let starPosY = Math.floor((Math.random() * 90) + 5);
    $(currStar).css("top", starPosX + "%");
    $(currStar).css("left", starPosY + "%");

    //Randomly generate star rotation and assign
    let starRot = Math.floor((Math.random() * 45) + 1);
    $(currStar).css("transform", "rotateZ(" + starRot + "deg)");
  }//End stars

//Create Planets


})//End page load
