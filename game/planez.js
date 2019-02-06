
var canvas = document.getElementById("gamecanvas");
var context = canvas.getContext("2d");
var buttons = {};
var cover;
var model;
var gameData = new Gamestate;
var modelJson
var assets = {};


// XMLHttpRequest to get json data
var jsonUrl = "https://robloxcom-corporation.github.io/planez/game/planes.json"
var http = new XMLHttpRequest();
http.open("GET", jsonUrl, true);
http.onreadystatechange = function() {
  if (http.readyState == 4 && http.status == 200) {
    modelJson = JSON.parse(http.responseText)
  };
};
http.send();

// XMLHttpRequest using Ajax (must link ajax lib in html document)
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
  this.updateValue = function() {
    this.value = modelJson[this.typeId].data.value;
  };
  this.value = 000;
  var value = this.value;
  this.score = new Score(parent);
};

// score initializer WIP
function Score(parent) {
  var score = 000;
  var that = this;
  this.unlocked = false;
  this.get = function() {
    return score;
  };
  this.inc = function() {
    if ( that.unlocked ) {
      that.unlocked = false;
      parent.updateValue();
      score += parent.value;
    };
  };
};


function init() {

  // runway background
  var background = new Component(0, 0, canvas.width, canvas.width/5, "rect");
  background.color = "#808080";
  background.draw();
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
  buttons.paper = new Button(0, canvas.width/5, canvas.width/3, canvas.width/10, "rect");
  buttons.paper.component.color = "#ff0000ff";
  buttons.paper.component.draw();
  buttons.paper.component.ico = new Component(0, canvas.width/5, canvas.width/3/3, canvas.width/10, "img");
  buttons.paper.component.ico.image_uri = "game/assets/sprites/cessna/cessnasmall.png";
  buttons.paper.component.ico.parent = buttons.paper.component.ico;
  buttons.paper.component.ico.draw();

  // wood
  buttons.wood = new Button(0, canvas.width/5 + canvas.width/10, canvas.width/3, canvas.width/10, "rect");
  buttons.wood.component.color = "#ffaa00ff";
  buttons.wood.component.draw();
  // cessna
  buttons.cessna = new Button(0, canvas.width/5 + canvas.width/10 + canvas.width/10, canvas.width/3, canvas.width/10, "rect");
  buttons.cessna.component.color = "#ff5500ff";
  buttons.cessna.component.draw();

  // draws initial model
  model = new Image();
  model.onload = function() {
    context.drawImage(this, canvas.width/3 + 2 * canvas.width/9, canvas.width/5 + 2 * canvas.width/9, 2 * canvas.width/9 , 2 * canvas.width/9);
  };
  model.src = "game/assets/sprites/paper/pa1.png";

  // initial score
  assets.score_title = new Component((2 * canvas.width/3) - (2 * canvas.width/6), (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10);
  assets.score_title.type = "text";
  assets.score_title.font = "20px Verdana";
  assets.score_title.color = "#ff0000";
  assets.score_title.text = "Score: "
  assets.score_title.draw();

  assets.score_value = new Component((2 * canvas.width/3) - (2 * canvas.width/6) + 100, (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10);
  assets.score_value.type = "text";
  assets.score_value.font = "20px Verdana";
  assets.score_value.color = "#ff0000";
  assets.score_value.text = gameData.score.get();
  assets.score_value.draw();

  assets.score_value.cover = new Component(
    (2 * canvas.width/3) - (2 * canvas.width/6) + 100,
    (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10,
    5 * canvas.width/2,
    -4 * canvas.width/120,
    "rect"
  );
  assets.score_value.cover.color = "#ffffff";
  cover = new Pos((2 * canvas.width/3) - (2 * canvas.width/6) + 100, (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10, 5 * canvas.width/2, -4 * canvas.width/120);


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


function Component(x, y, width, height, type) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.type = type
  this.draw = function() {
    switch (this.type) {
      case "rect":
        context.beginPath();
        context.fillStyle = this.color;
        context.lineWidth = "0px";
        context.fillRect(this.x, this.y, this.width, this.height);
        context.stroke();
        break;
      case "outline":
        context.beginPath();
        context.fillStyle = color;
        context.lineWidth = "2px";
        context.rect(this.x, this.y, this.width, this.height);
        context.stroke();
        break;
      case "img":
        var parent = this;
        var imag = new Image();
        imag.onload = function() {
          // context.drawImage(this, parent.x, parent.y, parent.width, parent.height);
          context.drawImage(this, parent.x, parent.y, parent.width, parent.height);

        };
        imag.src = "game/assets/sprites/cessna/cessnasmall.png";
        break;
      case "text":
        context.beginPath();
        context.fillStyle = this.color;
        context.font = this.font;
        context.fillText(this.text, this.x, this.y, this.width, this.height)
        context.stroke();
        break;

    }
  }

  // meta members
  this.parent;
  this.image;
  this.img_uri;
  this.color;
  this.font;
  this.text;

};


function Button(x, y, width, height, color) {
  this.component = new Component(x, y, width, height, color, "rect");
  this.checkIntersect = function(mousePos) {
    if ((mousePos.x < this.component.x + this.component.width)
    && (mousePos.x > this.component.x)
    && (mousePos.y < this.component.y + this.component.height)
    && (mousePos.y > this.component.y)) {
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
  buttons.click = new Button(posX + dimention/3, posY + dimention/3, dimention/3 , dimention/3, "#ff0000");
};


function Pos(x, y) {
  this.x = x;
  this.y = y;
};


function updateScore(num) {
  if (num == gameData.score.get()) {

    assets.score_value.cover.draw();
    assets.score_value.text = num;
    assets.score_value.draw();
    // (2 * canvas.width/3) - (2 * canvas.width/6) + 100, (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10, 200
  };
};


canvas.addEventListener("click", (e) => {
  var mouse = new Pos(e.clientX - 7, e.clientY - 7);
  if (buttons.click.checkIntersect(mouse)) {
    if (modelJson[gameData.typeId].data.stages - 1 == gameData.stageId) {
      gameData.score.unlocked = true;
      gameData.score.inc();
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
