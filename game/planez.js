
var x = 0;
var timer;
var canvas = document.getElementById("gamecanvas");
var context = canvas.getContext("2d");
var buttons = {};
var cover;
var score = 0000;
var model;
var request = new XMLHttpRequest();



function init() {
  context.fillStyle = "#808080";
  context.fillRect(0, 0, canvas.width, canvas.width/5);

  context.beginPath();
  context.lineWidth = "2";
  context.rect(canvas.width/3, canvas.width/5, 2 * canvas.width/3, 2 * canvas.width/3);
  context.stroke();

  context.beginPath();
  context.fillStyle = "#ff0000ff";
  var posX = canvas.width/3;
  var posY = canvas.width/5;
  var dimention = 2 * canvas.width/3;
  context.fillRect(posX + dimention/3, posY + dimention/3, dimention/3 , dimention/3);
  context.stroke();
  buttons.click = newButton(posX + dimention/3, posY + dimention/3, dimention/3 , dimention/3);

//  console.log(getJson());
  model = new Image();
  model.onload = function() {
    context.drawImage(this, posX + dimention/3, posY + dimention/3, dimention/3 , dimention/3);
  };
  model.src = "assets/sprites/paper/pa1.png";

  context.font = "20px Verdana";
  context.fillStyle = "#ff0000";
  context.fillText("Score: ", (2 * canvas.width/3) - (2 * canvas.width/6), (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10);
  context.fillText("0000", (2 * canvas.width/3) - (2 * canvas.width/6) + 100, (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10, 2 * canvas.width/5);
  cover = newPos((2 * canvas.width/3) - (2 * canvas.width/6) + 100, (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10);



};

$.getJSON("planes.json", function (data) {
  console.log(data);
});


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

function cycleModel(type, modelid) {
  model.src = source;
};


function loop() {
  draw();
  x+= .1;
  timer = setTimeout(loop, 1);
};


function updateScore(num) {
  context.beginPath();
  context.fillStyle = "#ffffff";
  context.fillRect(cover.x, cover.y, 5 * canvas.width/2, -4 * canvas.width/125);
  context.stroke();

  context.beginPath();
  context.font = "20px Verdana";
  context.fillStyle = "#ff0000";
  context.fillText(score, (2 * canvas.width/3) - (2 * canvas.width/6) + 100, (canvas.width/5) + (2 * canvas.width/3) + 50, 200);
  context.stroke();
};


canvas.addEventListener("click", (e) => {
  var mouse = newPos(e.clientX, e.clientY);

  if (buttons.click.checkIntersect(mouse)) {
    score++;
    updateScore(score);
    model.stage++;
    if (model.stage == 6) {
      model.stage = 1;
    };



  };

});


window.onload = init();
