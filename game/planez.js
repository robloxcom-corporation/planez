
var canvas = document.getElementById("gamecanvas");
var context = canvas.getContext("2d");
var buttons = {};
var cover;
var model;
var gameData = new Gamestate;

/* var modelJson;
$.getJSON("https://robloxcom-corporation.github.io/planez/game/planes.json", function (data) {
  modelJson = data;
}); */
var imgDomain = "https://robloxcom-corporation.github.io/planez/game/assets/sprites/";
var runwayModels = [{},{},{},{},{}];

function Gamestate() {
  var parent = this;
  this.stageId = 0;
  this.typeId = 0;
  var value = this.value;
  this.updateValue = function() {
    this.value = modelJson[this.typeId].data.value;
  };
  this.value = 000;
  this.score = new Score(parent);
};

// score initializer WIP
function Score(parent) {
  var score = 0;
  this.get = function() {
    return score;
  };
  this.inc = function() {
    parent.updateValue();
    score += parent.value;
  };
};

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
  buttons.paper = new Button(0, canvas.width/5, canvas.width/3, canvas.width/10);
  // wood
  context.beginPath();
  context.fillStyle = "#ffaa00ff"
  context.fillRect(0, canvas.width/5 + canvas.width/10, canvas.width/3, canvas.width/10);
  context.stroke();
  buttons.wood = new Button(0, canvas.width/5 + canvas.width/10, canvas.width/3, canvas.width/10);
  // cessna
  context.beginPath();
  context.fillStyle = "#ff5500ff"
  context.fillRect(0, canvas.width/5 + canvas.width/10 + canvas.width/10, canvas.width/3, canvas.width/10);
  context.stroke();
  buttons.cessna = new Button(0, canvas.width/5 + canvas.width/10 + canvas.width/10, canvas.width/3, canvas.width/10);

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
  context.fillText(gameData.score.get(), (2 * canvas.width/3) - (2 * canvas.width/6) + 100, (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10, 2 * canvas.width/5);
  cover = new Pos((2 * canvas.width/3) - (2 * canvas.width/6) + 100, (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10);


};

function drawRunway() {
  var pos = new Pos(0, 0);
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

function Button(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.checkIntersect = function(mousePos) {
    if ((mousePos.x < this.x + this.width) && (mousePos.x > this.x) && (mousePos.y < this.y + this.height) && (mousePos.y > this.y)) {
      return true
    } else {
      return false
    };

  };

};


function drawHitbox() {
  context.beginPath();
  context.fillStyle = "#ff0000ff";
  var posX = canvas.width/3;
  var posY = canvas.width/5;
  var dimention = 2 * canvas.width/3;
  context.fillRect(posX + dimention/3, posY + dimention/3, dimention/3 , dimention/3);
  context.stroke();
  buttons.click = new Button(posX + dimention/3, posY + dimention/3, dimention/3 , dimention/3);
};


function Pos(x, y) {
  this.x = x;
  this.y = y;
};


function updateScore(num) {
  context.beginPath();
  context.fillStyle = "#ffffff";
  context.fillRect(cover.x, cover.y + canvas.width/500, 5 * canvas.width/2, -4 * canvas.width/120);
  context.stroke();

  context.beginPath();
  context.font = "20px Verdana";
  context.fillStyle = "#ff0000";
  context.fillText(num, (2 * canvas.width/3) - (2 * canvas.width/6) + 100, (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10, 200);
  context.stroke();
};


canvas.addEventListener("click", (e) => {
  var mouse = new Pos(e.clientX - 7, e.clientY - 7);
  if (buttons.click.checkIntersect(mouse)) {
    if (modelJson[gameData.typeId].planes.length - 1 == gameData.stageId) {
      gameData.updateValue();
      gameData.score.inc();
      console.log(gameData.score.get());
      updateScore(gameData.score.get());
      };
      gameData.stageId++;
      if (gameData.stageId == modelJson[gameData.typeId].planes.length) {
        gameData.stageId = 0;

    };
    drawHitbox();
    model.src = modelJson[gameData.typeId].planes[gameData.stageId].src;


  } else if (buttons.paper.checkIntersect(mouse) && gameData.typeId != 0) {
    gameData.stageId = 0;
    gameData.typeId = 0;
    drawHitbox();
    model.src = modelJson[gameData.typeId].planes[gameData.stageId].src;
  } else if (buttons.wood.checkIntersect(mouse) && gameData.typeId != 1) {
    gameData.stageId = 0;
    gameData.typeId = 1;
    drawHitbox();
    model.src = modelJson[gameData.typeId].planes[gameData.stageId].src;
  } else if (buttons.cessna.checkIntersect(mouse) && gameData.typeId != 2) {
    gameData.stageId = 0;
    gameData.typeId = 2;
    drawHitbox();
    model.src = modelJson[gameData.typeId].planes[gameData.stageId].src;

  };







});


window.onload = init();
