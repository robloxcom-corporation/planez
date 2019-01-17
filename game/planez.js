
var canvas = document.getElementById("gamecanvas");
var context = canvas.getContext("2d");
var buttons = {};
var cover;
var score = 0000;
var model;
var modelJson;
var stageData = {"typeId":0, "stageId":0};
var imgDomain = "https://robloxcom-corporation.github.io/planez/assets/sprites/";



function init() {
  context.fillStyle = "#808080";
  context.fillRect(0, 0, canvas.width, canvas.width/5);

  context.beginPath();
  context.lineWidth = "2";
  context.rect(canvas.width/3, canvas.width/5, 2 * canvas.width/3, 2 * canvas.width/3);
  context.stroke();

  drawHitbox();

  $.getJSON("https://robloxcom-corporation.github.io/planez/game/planes.json", function (data) {
    modelJson = data;
  });
  model = new Image();
  model.onload = function() {
    context.drawImage(this, canvas.width/3 + 2 * canvas.width/9, canvas.width/5 + 2 * canvas.width/9, 2 * canvas.width/9 , 2 * canvas.width/9);
  };
  model.src = "assets/sprites/paper/pa1.png";

  context.font = "20px Verdana";
  context.fillStyle = "#ff0000";
  context.fillText("Score: ", (2 * canvas.width/3) - (2 * canvas.width/6), (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10);
  context.fillText("0000", (2 * canvas.width/3) - (2 * canvas.width/6) + 100, (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10, 2 * canvas.width/5);
  cover = newPos((2 * canvas.width/3) - (2 * canvas.width/6) + 100, (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10);



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


function drawHitbox() {
  context.beginPath();
  context.fillStyle = "#ff0000ff";
  var posX = canvas.width/3;
  var posY = canvas.width/5;
  var dimention = 2 * canvas.width/3;
  context.fillRect(posX + dimention/3, posY + dimention/3, dimention/3 , dimention/3);
  context.stroke();
  buttons.click = newButton(posX + dimention/3, posY + dimention/3, dimention/3 , dimention/3);
};


function newPos(x, y) {
  var obj = {};
  obj.x = x;
  obj.y = y;
  return obj;
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


    drawHitbox();
    model.src = modelJson[stageData.typeId][stageData.stageId].src;

    stageData.stageId++;
    if (stageData.stageId == 5) {
      stageData.stageId = 0;
    };



  };

});


window.onload = init();
