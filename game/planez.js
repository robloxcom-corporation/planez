
var canvas = document.getElementById("gamecanvas");
var context = canvas.getContext("2d");
var buttons = {};
var cover;
var model;
var click;
var gameData = new Gamestate;
var modelJson;
var looping = false;
var assets = { plane_models:[], runway_models:[{},{},{},{},{}] };
const planeEvent = new Event("plane_models_change");
const cashEvent = new Event("cash_inc");
var score_data = {}
// XMLHttpRequest to get json data
var jsonUrl = "https://robloxcom-corporation.github.io/planez/game/planes.json"
var http = new XMLHttpRequest();
http.open("GET", jsonUrl, false);
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
  this.typeId = -1;
  this.updateValue = function() {
    this.value = modelJson[this.typeId].data.value;
  };
  this.value = 000;
  var value = this.value;
  this.score = new Score(parent);
  this.cash = new Cash(parent);
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
      gameData.cash.unlocked = true;
      canvas.dispatchEvent( cashEvent );
    };
  };
};

function Cash(parent) {
  var cash = 000;
  var that = this;
  this.unlocked = false;
  this.get = function() {
    return cash;
  };
  this.dec = function(val_) {
    cash -= val_;
  }
  canvas.addEventListener("cash_inc", function() {
    if ( that.unlocked ) {
      that.unlocked = false;
      parent.updateValue();
      cash += parent.value;

    };
  });

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

  // new changes here:
  buttons.paper = new Button();
  buttons.paper.cost = 0;
  buttons.paper.color = "#ff0000" // temp

  buttons.wood = new Button();
  buttons.wood.cost = 10;
  buttons.wood.color = "#ffaa00" // temp

  buttons.cessna = new Button();
  buttons.cessna.cost = 50;
  buttons.cessna.color = "#ff5500" // temp

  for (var i = 0; i < Object.keys(buttons).length; i++) {
    var button;
    function getType() {
      switch (i) {
        case 0:
          return {id: 0, name: modelJson[i].data.type, obj: buttons.paper};
        case 1:
          return {id: 1, name: modelJson[i].data.type, obj: buttons.wood};
        case 2:
          return {id: 3, name: modelJson[i].data.type, obj: buttons.cessna};
      };
    };
    var button = getType().obj;
    button.x = 0;
    button.y = canvas.height/5 + canvas.height/10 * i;
    button.width = canvas.width/3;
    button.height = canvas.height/10;

    button.init();
    button.component.color = button.color;
    button.component.draw();

    button.component.ico = new Component(0, canvas.width/5 + canvas.width/10 * i, canvas.height/3/3, canvas.width/10, "img");
    button.component.ico.image_uri = modelJson[i].data.src_small;
    button.component.ico.parent = button.component.ico;
    button.component.ico;

    button.component.lock = new Component(0, canvas.width/5 + canvas.height/10 * i, canvas.width/3/3, canvas.height/10, "img");
    button.component.lock.image_uri = "game/assets/sprites/lock.png";
    button.component.lock.parent = button.component.lock;
    button.component.lock.draw();

    button.component.title = new Component(canvas.width/6, 26 * canvas.height/100 + canvas.height/10 * i, canvas.width/3/3, canvas.height/10, "text");
    button.component.title.text = getType().name.charAt(0).toUpperCase() + getType().name.slice(1);
    button.component.title.color = "#ffffff";
    button.component.title.font = "20px Verdana";

    button.component.value = new Component(canvas.width/8, 26 * canvas.height/100 + canvas.height/10 * i, canvas.width/3/2, canvas.width/10, "text");
    button.component.value.text = "Locked: $" + button.cost;
    button.component.value.color = "#ffffff";
    button.component.value.font = "20px Verdana";
    button.component.value.draw();

    button.component.clear();

  };


  // draws initial model
  model = new Image();
  model.onload = function() {
    context.drawImage(this, canvas.width/3 + 2 * canvas.width/9, canvas.width/5 + 2 * canvas.width/9, 2 * canvas.width/9 , 2 * canvas.width/9);
  };
  // model.src = "game/assets/sprites/paper/pa1.png";

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
      context.fillStyle = this.clearColor;
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
  this.x = x;
  this.y = y;
  this. width = width;
  this.height = height;
  this.color = color;
  this.init = function() {
    this.component = new Component(this.x, this.y, this.width, this.height, "rect");
    this.component.color = this.color;
    this.component.clearColor = "#60606080";

  }
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
  this.buy = function() {
    if (this.buyable && !this.purchased && gameData.cash.get() >= this.cost) {
      gameData.cash.dec(this.cost);

    };

  };

  // meta members
  this.cost;
  this.buyable;
  this.purchased;

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
  click = new Button(posX + dimention/3, posY + dimention/3, dimention/3 , dimention/3, "#ff0000");
  click.init();
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
  if (click.checkIntersect(mouse) && gameData.typeId != -1) {
    gameData.stageId++;
    if (modelJson[gameData.typeId].data.stages == gameData.stageId) { // if intersect with main button
      gameData.score.unlocked = true;
      gameData.score.inc();
      updateScore(gameData.score.get());
      var img = new Component(canvas.width, Math.random() * 50, canvas.width/10, canvas.width/10, "img");
      img.image_uri = modelJson[gameData.typeId].data.src_small;
      img.parent = img;
      assets.plane_models.push(img)
      if (!looping) { canvas.dispatchEvent(planeEvent) };

    };
    if (gameData.stageId >= modelJson[gameData.typeId].data.stages) {
      gameData.stageId = 0;
    };
    drawHitbox();
    model.src = modelJson[gameData.typeId].planes[gameData.stageId].src;

  // if intertsect with other buttons
  } else {
    for (var i = 0; i < Object.keys(buttons).length; i++) {
      function getType() {
        switch (i) {
          case 0:
            return {id: 0, name: modelJson[i].data.type, obj: buttons.paper};
          case 1:
            return {id: 1, name: modelJson[i].data.type, obj: buttons.wood};
          case 2:
            return {id: 3, name: modelJson[i].data.type, obj: buttons.cessna};
        };
      };
      var button = getType().obj;

      if (button.checkIntersect(mouse)) {
        if (button.purchased && gameData.typeId != i) { // usual behavior
          gameData.typeId = i;
          gameData.stageId = 0;
          drawHitbox();
          model.src = modelJson[i].planes[gameData.stageId].src;

        } else if (!button.purchased && gameData.cash.get() >= button.cost) { // purchase behavior
          button.component.draw();
          button.component.ico.draw();
          button.component.title.draw();
          button.purchased = true;
          gameData.typeId = i;
          gameData.stageId = 0;
          drawHitbox();
          model.src = modelJson[i].planes[gameData.stageId].src;
          gameData.cash.dec(buttons.paper.cost);
        };
      };
    };
  };






});


function animateRunway(timestamp) {
  looping = true;
  for(var i = 0; i < assets.runway_models.length; i++) {
    assets.runway_models[i].draw();
  };
  for (var i = 0; i < assets.plane_models.length; i++) {
    if ( !assets.plane_models[i].timestamp_start ) { assets.plane_models[i].timestamp_start = timestamp };
    assets.plane_models[i].timestamp_progress = timestamp - assets.plane_models[i].timestamp_start;
    assets.plane_models[i].draw();
    assets.plane_models[i].x = canvas.width - ( .1 * assets.plane_models[i].timestamp_progress);
    if (assets.plane_models[i].x < -35) {
      assets.plane_models.shift();
    };

  };
  if (assets.plane_models != 0) {
    window.requestAnimationFrame( animateRunway );
  } else { looping = false }; // experienced higher performance without this line (for unknown reason)

};

window.onload = init();

canvas.addEventListener("plane_models_change", function() {
  window.requestAnimationFrame( animateRunway );
});
