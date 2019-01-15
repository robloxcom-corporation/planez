function draw() {

  var canvas = document.getElementById("gamecanvas");
  var context = canvas.getContext("2d");

  context.fillStyle = "#000000";
  context.fillRect(0,0,100,100);

  var image = new Image();

  image.onload = function() {
    context.drawImage(this,0,0);
  };

  image.src = "assets/sprites/lvl1 1.jpg"
}

draw();
