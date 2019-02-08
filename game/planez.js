
var canvas = document.getElementById("gamecanvas");
var context = canvas.getContext("2d");
var buttons = {};
var cover;
var model;
var gameData = new Gamestate;
var modelJson
var assets = { plane_models:[], runway_models:[{},{},{},{},{}] };
const planeEvent = new Event("plane_models_change");
var score_data = {}
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
  setupRunway();
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
  buttons.paper.component.color = "#ff0000";
  buttons.paper.component.draw();

  buttons.paper.component.ico = new Component(0, canvas.width/5, canvas.width/3/3, canvas.width/10, "img");
  buttons.paper.component.ico.image_uri = "game/assets/sprites/paper/smallpa.png";
  buttons.paper.component.ico.parent = buttons.paper.component.ico;
  buttons.paper.component.ico.draw();

  buttons.paper.component.title = new Component(canvas.width/6, canvas.width/5 + canvas.width/10/2 + canvas.width/10/10, canvas.width/3/3, canvas.width/10, "text");
  buttons.paper.component.title.text = "Paper";
  buttons.paper.component.title.color = "#ffffff";
  buttons.paper.component.title.font = "20px Verdana";
  buttons.paper.component.title.draw();

  // wood
  buttons.wood = new Button(0, canvas.width/5 + canvas.width/10, canvas.width/3, canvas.width/10, "rect");
  buttons.wood.component.color = "#ffaa00";
  buttons.wood.component.draw();

  buttons.wood.component.ico = new Component(0, canvas.width/5 + canvas.width/10, canvas.width/3/3, canvas.width/10, "img");
  buttons.wood.component.ico.image_uri = "game/assets/sprites/wood/woodsmall.png";
  buttons.wood.component.ico.parent = buttons.wood.component.ico;
  buttons.wood.component.ico.draw();

  buttons.wood.component.title = new Component(canvas.width/6, canvas.width/5 + canvas.width/10/2 + canvas.width/10/10 + canvas.width/10, canvas.width/3/3, canvas.width/10, "text");
  buttons.wood.component.title.text = "Balsamic";
  buttons.wood.component.title.color = "#ffffff";
  buttons.wood.component.title.font = "20px Verdana";
  buttons.wood.component.title.draw();


  // cessna
  buttons.cessna = new Button(0, canvas.width/5 + canvas.width/10 + canvas.width/10, canvas.width/3, canvas.width/10, "rect");
  buttons.cessna.component.color = "#ff5500";
  buttons.cessna.component.draw();

  buttons.cessna.component.ico = new Component(0, canvas.width/5 + 2 * canvas.width/10, canvas.width/3/3, canvas.width/10, "img");
  buttons.cessna.component.ico.image_uri = "game/assets/sprites/cessna/cessnasmall.png";
  buttons.cessna.component.ico.parent = buttons.cessna.component.ico;
  buttons.cessna.component.ico.draw();

  buttons.cessna.component.title = new Component(canvas.width/6, canvas.width/5 + canvas.width/10/2 + canvas.width/10/10 + 2 * canvas.width/10, canvas.width/3/3, canvas.width/10, "text");
  buttons.cessna.component.title.text = "Cessna";
  buttons.cessna.component.title.color = "#ffffff";
  buttons.cessna.component.title.font = "20px Verdana";
  buttons.cessna.component.title.draw();



  // draws initial model
  model = new Image();
  model.onload = function() {
    context.drawImage(this, canvas.width/3 + 2 * canvas.width/9, canvas.width/5 + 2 * canvas.width/9, 2 * canvas.width/9 , 2 * canvas.width/9);
  };
  model.src = "game/assets/sprites/paper/pa1.png";

  // initial score
  score_data.score_title = new Component((2 * canvas.width/3) - (2 * canvas.width/6), (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10);
  score_data.score_title.type = "text";
  score_data.score_title.font = "20px Verdana";
  score_data.score_title.color = "#ff0000";
  score_data.score_title.text = "Score: "
  score_data.score_title.draw();

  score_data.score_value = new Component((2 * canvas.width/3) - (2 * canvas.width/6) + 100, (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10);
  score_data.score_value.type = "text";
  score_data.score_value.font = "20px Verdana";
  score_data.score_value.color = "#ff0000";
  score_data.score_value.text = gameData.score.get();
  score_data.score_value.draw();

  score_data.score_value.cover = new Component(
    (2 * canvas.width/3) - (2 * canvas.width/6) + 100,
    (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10,
    5 * canvas.width/2,
    -4 * canvas.width/120,
    "rect"
  );
  score_data.score_value.cover.color = "#ffffff";


};


function Component(x, y, width, height, type) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.type = type;
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
        this.image = new Image();
        this.image.onload = function() {
          context.drawImage(this, parent.x, parent.y, parent.width, parent.height);

        };
        this.image.src = parent.image_uri;
        break;
      case "text":
        context.beginPath();
        context.fillStyle = this.color;
        context.font = this.font;
        context.fillText(this.text, this.x, this.y, this.width, this.height)
        context.stroke();
        break;
    };
  };

  this.clear = function() {
    if (this.clearColor) {
      context.beginPath();
      context.fillStyle = this.fillColor;
      context.lineWidth = "0px";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.stroke();
    } else {
      context.beginPath();
      context.lineWidth = "0px";
      context.clearRect(this.x, this.y, this.width, this.height);
      context.stroke();
    };
  };

  // meta members
  this.parent;
  this.image;
  this.img_uri;
  this.color;
  this.clearColor;
  this.font;
  this.text;
  this.timestamp_start;
  this.timestamp_progress;
  this.debugId;

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


function setupRunway() {
  for (var i = 0; i < 5; i++) {
    assets.runway_models[i] = new Component(canvas.width/5 * i, 0, canvas.width/5, canvas.width/5, "img");
    assets.runway_models[i].debugId = "runway" + i;
    if (i < assets.runway_models.length - 1) {
      assets.runway_models[i].image_uri = "game/assets/sprites/runway/runway1.png"
    } else {
      assets.runway_models[i].image_uri = "game/assets/sprites/runway/runway2.png"
    };

  };

};


function drawRunway() {
    for (var i = 0; i < 5; i++) {
      assets.runway_models[i].draw();
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

    score_data.score_value.cover.draw();
    score_data.score_value.text = num;
    score_data.score_value.draw();
    // (2 * canvas.width/3) - (2 * canvas.width/6) + 100, (canvas.width/5) + (2 * canvas.width/3) + canvas.width/10, 200
  };
};


canvas.addEventListener("click", (e) => {
  var mouse = new Pos(e.clientX - 7, e.clientY - 7);
  if (buttons.click.checkIntersect(mouse)) {
    gameData.stageId++;
    if (modelJson[gameData.typeId].data.stages == gameData.stageId) { // if intersect with main button
      gameData.score.unlocked = true;
      gameData.score.inc();
      updateScore(gameData.score.get());
      var img = new Component(canvas.width, Math.random() * 50 + 10, canvas.width/20, canvas.width/20, "img");
      img.image_uri = "game/assets/sprites/cessna/cessnasmall.png"
      img.parent = img;
      assets.plane_models.push(img)
      canvas.dispatchEvent(planeEvent);

    };
    if (gameData.stageId >= modelJson[gameData.typeId].data.stages) {
      gameData.stageId = 0;
    };
    drawHitbox();
    model.src = modelJson[gameData.typeId].planes[gameData.stageId].src;

  // if intertsect with other buttons
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


function animateRunway(timestamp) {
  for(var i = 0; i < assets.runway_models.length; i++) {
    assets.runway_models[i].draw();
  };
  for (var i = 0; i < assets.plane_models.length; i++) {
    if ( !assets.plane_models[i].timestamp_start ) { assets.plane_models[i].timestamp_start = timestamp };
    assets.plane_models[i].timestamp_progress = timestamp - assets.plane_models[i].timestamp_start;
    assets.plane_models[i].draw();
    assets.plane_models[i].x = canvas.width - ( .1 * assets.plane_models[i].timestamp_progress);
    if (assets.plane_models[i].x < -30) {
      assets.plane_models.shift();
    };

  };
  if (assets.plane_models != 0) {
    window.requestAnimationFrame( animateRunway );
  };

};

window.onload = init();

canvas.addEventListener("plane_models_change", function() {
  window.requestAnimationFrame( animateRunway );
});
