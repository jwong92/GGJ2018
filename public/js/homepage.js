$(document).ready(function() {

  //randomly generate stars
  var numStars = 10;
  var counter = 15;

  for (var i=0; i<=numStars; i++) {
    let star = $("<img src='img/stars/4pt-star2.svg'>").attr({
      class: "star-" + i
    })
    $("#stars").append(star);
  }

  for (var i=1; i<=numStars; i+=2) {
    var currStar = ".star-" + i;
    $(currStar).css("fontSize", "5em");
  }

  for (var i=1; i<=numStars; i+=2){
    counter += 150;
    let currStar = ".star-" + i;
    $(currStar).css("top", "calc(10% + " + counter + "px)");
    $(currStar).css("left", "calc(10% + " + counter + "px)");
  }

  for (var i=0; i<=numStars; i+=2){
    counter += 50;
    let currStar = ".star-" + i;
    $(currStar).css("top", "calc(5% + " + counter + "px)");
    $(currStar).css("left", "calc(10% + " + counter + "px)");
  }


})//End page load
