/* Master Game object */
var Game = {};

/* Player Class */
// Constructor
Game.Player = function() {
  this.money = 0;
};
// Add money
Game.Player.prototype.addMoney = function(money) {
  this.money += money;
  document.getElementById("moneyDisplay").innerHTML = "Money: "+ this.money;
};

/* Producer Class */
Game.Producer = function() {
  this.basePayout = 1
};
// Payout
Game.Producer.prototype.payout = function() {
  Game.player.addMoney(this.basePayout)
};



/* Debug Testing Code */
// Setup player
Game.player = new Game.Player();
// Setup Clicker
Game.clicker = new Game.Producer();
// Bind click to Payout
Game.clicker.playerClick = function() {
  this.payout()
};

//console.log("TICKING STARTED");
//setInterval(function() { Game.testProd.tick(0.2); }, 200);
