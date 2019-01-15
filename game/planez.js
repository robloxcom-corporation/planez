var x = 0;
var timer;

function draw() {

  var canvas = document.getElementById("gamecanvas");
  var context = canvas.getContext("2d");

  context.fillStyle = "#000000";

  var image = new Image();

  image.onload = function() {
    context.drawImage(this, x, 0, 100, 100);
  };

  image.src = "assets/sprites/lvl1 1.jpg";
};


function loop() {
  console.log("loop");
  draw();
  x++;
  timer = setTimeout(loop, 20);
};

var button = document.getElementById("start");
button.onclick = function() { loop() };


var num = 0;
var numbutton = document.getElementById("counter");
numbutton.onclick = function() { num++; updateNum() };

function updateNum() {
  box = document.getElementById("box");
  box.value = num;
}
