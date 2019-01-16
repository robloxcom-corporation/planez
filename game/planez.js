
var x = 0;
var timer;
var click;
var canvas = document.getElementById("gamecanvas");
var context = canvas.getContext("2d");
var buttons = {};
var mouse;

function init() {
  context.fillStyle = "#808080";
  context.fillRect(0,0,500,100);

  context.beginPath();
  context.lineWidth = "2";
  context.rect(canvas.width/3, 100, 2 * canvas.width/3, 2 * canvas.width/3);
  context.stroke();

  context.beginPath();
  context.fillStyle = "#ff0000";
  var posX = canvas.width/3;
  var posY = 100;
  var dimention = 2 * canvas.width/3;
  context.fillRect(posX + dimention/3, posY + dimention/3, dimention/3 , dimention/3);
  context.stroke();
  buttons.click = newButton(posX + dimention/3, posY + dimention/3, dimention/3 , dimention/3);
};

function newButton(x, y, width, height) {
  var obj = {};
  obj.x = x;
  obj.y = y;
  obj.width = width;
  obj.height = height;
  obj.checkIntersect = function(mousePos) {
    if ((mousePos.x < this.x + this.width) && (mousePos.x > this.x) && (mousePos.y < this.y + this.height) && (mousePos.y > this.y)) {
      return true
    } else {
      return false
    };

  };
  return obj;
};

function newPos(x, y) {
  var obj = {};
  obj.x = x;
  obj.y = y;
  return obj;
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

window.onload = init();
canvas.addEventListener("click", (e) => {
  mouse = newPos(e.clientX, e.clientY)
  if (buttons.click.checkIntersect(mouse)) {
    console.log("yes");
  }
});
