$(document).ready(function() {

  var numStars = 10;

//Create Stars
  for (var i=0; i<=numStars; i++) {
    let star = $("<img src='img/stars/4pt-star.svg'>").attr({
      class: "star-" + i
    })
    $("#stars").append(star);
  }

//Chage the size of the star
  for (var i=0; i<=numStars; i++) {
    let currStar = ".star-" + i;

    //Randomly generate size of star and assign
    let randomSize = Math.round((Math.random() * 2.5), 2);
    $(currStar).css("fontSize", randomSize + "em");

    //randomly generate star position and assign
    let starPosX = Math.floor((Math.random() * 90) + 5);
    let starPosY = Math.floor((Math.random() * 90) + 5);
    $(currStar).css("top", starPosX + "%");
    $(currStar).css("left", starPosY + "%");

    //Randomly generate star rotation and assign
    let starRot = Math.floor((Math.random() * 45) + 1);
    $(currStar).css("transform", "rotateZ(" + starRot + "deg)");

  }

  //function for Hiding Splash Instructions on Start button click
  $("#start").click(function(){hideTarget(this.parentElement)});
  function hideTarget(target) {
    $(target).css("display", "none  ");
  }

})//End page load
