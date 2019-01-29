
var canvas = document.getElementById("gamecanvas");
var context = canvas.getContext("2d");
var buttons = {};
var cover;
var score = 0000;
var model;
var modelJson;
$.getJSON("https://robloxcom-corporation.github.io/planez/game/planes.json", function (data) {
  modelJson = data;
});
var stageData = {"typeId":0, "stageId":0};
var imgDomain = "https://robloxcom-corporation.github.io/planez/game/assets/sprites/";
var runwayModels = [{},{},{},{},{}];
var gameData = {"typeCount": 2}


// score initializer WIP
function Score(param) {
  var score = param;
  this.get = function() {
    return score;
  };
};
var secret = new Score(0);
console.log(secret.get());


function init() {

  // runway background
  context.beginPath();
  context.fillStyle = "#808080";
  context.fillRect(0, 0, canvas.width, canvas.width/5);
  context.stroke();

  //runway models
  drawRunway();

  // click area outline and hitbox
  context.beginPath();
  context.lineWidth = "2";
  context.rect(canvas.width/3, canvas.width/5, 2 * canvas.width/3, 2 * canvas.width/3);
  context.stroke();
  drawHitbox();

  // type changer buttons
  // paper
  context.beginPath();
  context.fillStyle = "#ff0000ff"
  context.fillRect(0, canvas.width/5, canvas.width/3, canvas.width/10);
  context.stroke();
  buttons.paper = newButton(0, canvas.width/5, canvas.width/3, canvas.width/10);
  // wood
  context.beginPath();
  context.fillStyle = "#ffaa00ff"
  context.fillRect(0, canvas.width/5 + canvas.width/10, canvas.width/3, canvas.width/10);
  context.stroke();
  buttons.wood = newButton(0, canvas.width/5 + canvas.width/10, canvas.width/3, canvas.width/10);

  // draws initial model
  model = new Image();
  model.onload = function() {
    context.drawImage(this, canvas.width/3 + 2 * canvas.width/9, canvas.width/5 + 2 * canvas.width/9, 2 * canvas.width/9 , 2 * canvas.width/9);
  };
  model.src = "game/assets/sprites/paper/pa1.png";

  // initial score
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
    if (modelJson[stageData.typeId].planes.length - 1 == stageData.stageId) {
      score += modelJson[stageData.typeId].data.value;
      updateScore(score);
      };
      stageData.stageId++;
      if (stageData.stageId == modelJson[stageData.typeId].planes.length) {
        stageData.stageId = 0;

    };
    drawHitbox();
    model.src = modelJson[stageData.typeId].planes[stageData.stageId].src;


  } else if (buttons.paper.checkIntersect(mouse) && stageData.typeId != 0) {
    stageData.stageId = 0;
    stageData.typeId = 0;
    drawHitbox();
    model.src = modelJson[stageData.typeId].planes[stageData.stageId].src;
  } else if (buttons.wood.checkIntersect(mouse) && stageData.typeId != 1) {
    stageData.stageId = 0;
    stageData.typeId = 1;
    drawHitbox();
    model.src = modelJson[stageData.typeId].planes[stageData.stageId].src;


  };








});


window.onload = init();
