function draw() {

  var image = new Image();

  image.onload = function() {
    context.drawImage(this, x, 0, 100, 100);
  };

  image.src = "planez/assets/sprites/paper/pa1";
};

var x = 0;
var timer;

var canvas = document.getElementById("gamecanvas");
var context = canvas.getContext("2d");

function init() {
  context.fillStyle = "#808080";
  context.fillRect(0,0,500,100);
  
  context.beginPath();
  context.lineWidth = "2";
  context.rect(canvas.width/3, 100, 2 * canvas.width/3, 300);
  context.stroke();
};

function draw() {

  var image = new Image();

  image.onload = function() {
    context.drawImage(this, x, 0, 100, 100);
  };

  image.src = "assets/sprites/lvl1 1.jpg";
};



function loop() {
  draw();
  x+= .1;
  timer = setTimeout(loop, 1);
};

window.onload(init());


//asdasd
