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
    console.log("draw")
}


window.onload = function() {
  while (x < 300) {
    setTimeout(draw(), 20);
    x++;
    console.log(x)
  };
};
