
var canvas = document.getElementById("gamecanvas");
var context = canvas.getContext("2d");
var buttons = {};
var cover;
var score = 0000;
var model;
var modelJson;
var stageData = {"typeId":0, "stageId":1};
var imgDomain = "https://robloxcom-corporation.github.io/planez/game/assets/sprites/";
var runwayModels = [{},{},{},{},{}];
var gameData = {"typeCount": 2}


function init() {

  context.beginPath();
  context.fillStyle = "#808080";
  context.fillRect(0, 0, canvas.width, canvas.width/5);
  context.stroke();

  drawRunway();

  context.beginPath();
  context.lineWidth = "2";
  context.rect(canvas.width/3, canvas.width/5, 2 * canvas.width/3, 2 * canvas.width/3);
  context.stroke();

  drawHitbox();
  drawCycler(0, canvas.width/5, canvas.width/3, canvas.width/10);

  $.getJSON("https://robloxcom-corporation.github.io/planez/game/planes.json", function (data) {
    modelJson = data;
  });

  model = new Image();
  model.onload = function() {
    context.drawImage(this, canvas.width/3 + 2 * canvas.width/9, canvas.width/5 + 2 * canvas.width/9, 2 * canvas.width/9 , 2 * canvas.width/9);
  };
  model.src = "game/assets/sprites/paper/pa1.png";


  context.font = "20px Verdana";
  context.fillStyle = "#ff0000";
  context.fillText("Score: ", (2 * canvas.width/3) - (2 * canvas.width/6), (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10);
  context.fillText("0000", (2 * canvas.width/3) - (2 * canvas.width/6) + 100, (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10, 2 * canvas.width/5);
  cover = newPos((2 * canvas.width/3) - (2 * canvas.width/6) + 100, (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10);


};

function drawRunway() {
  var pos = newPos(0, 0);
  for (var i = 0; i < runwayModels.length; i++) {
    var imag = runwayModels[i];
    imag = new Image();
    imag.onload = function() {
      context.drawImage(this, pos.x, pos.y, 100, 100);
      pos.x += 100;
    };
    if (i < runwayModels.length - 1) {
      imag.src = "game/assets/sprites/runway/runway1.png"
    } else {
      imag.src = "game/assets/sprites/runway/runway2.png"
    };
  };


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


function drawCycler (posX, posY, width, height) {
  context.beginPath();
  context.fillStyle = "#ff0000ff"
  context.fillRect(posX, posY, width, height);
  context.stroke();
  buttons.cycle = newButton(posX, posY, width, height);



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
  context.fillRect(cover.x, cover.y + canvas.width/500, 5 * canvas.width/2, -4 * canvas.width/120);
  context.stroke();

  context.beginPath();
  context.font = "20px Verdana";
  context.fillStyle = "#ff0000";
  context.fillText(score, (2 * canvas.width/3) - (2 * canvas.width/6) + 100, (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10, 200);
  context.stroke();
};


canvas.addEventListener("click", (e) => {
  var mouse = newPos(e.clientX - 7, e.clientY - 7);

  if (buttons.click.checkIntersect(mouse)) {
    score++;
    updateScore(score);

    stageData.stageId++;
    if (stageData.stageId == 5) {
      stageData.stageId = 0;
    };
    drawHitbox();
    model.src = modelJson[stageData.typeId][stageData.stageId].src;


  } else if (buttons.cycle.checkIntersect(mouse)) {
    stageData.stageId = 0;
    stageData.typeId++;
    if (stageData.typeId == 2) {
      stageData.typeId = 0;
    };
    drawHitbox();
    model.src = modelJson[stageData.typeId][stageData.stageId].src;


  };








});


window.onload = init();
