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
  x+= .1;
  timer = setTimeout(loop, 1);
};

var button = document.getElementById("start");
button.onclick = function() { loop() };


var num = 1;
var numbutton = document.getElementById("counter");
document.getElementById("box");

box.onload = function() { box.value = 1 };
numbutton.onclick = function() { updateNum() };

var clicks = 0;

function updateNum() {
  document.getElementById("box").value ++;
  clicks = clicks + 1;
  if (clicks == 3) {
    alert("nice");
    var clicks = 0;
  }
};

//test


document.write("test8");
//endtest
