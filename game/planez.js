var x = 0;

function draw() {

  var canvas = document.getElementById("gamecanvas");
  var context = canvas.getContext("2d");

  context.fillStyle = "#000000";

  var image = new Image();

  image.onload = function() {
    context.drawImage(this, x, 0, 100, 100);
  };

  image.src = "assets/sprites/lvl1 1.jpg"
}

var y = 0;

while (y < 300) {
  setTimeout(draw(), 10);
  x++;
  
};
