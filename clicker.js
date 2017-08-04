/* Master Game object */
var Game = {};
// Upgrade types
Game.UpgradeTypes = {
  Add: 0, // Additive
  Multi: 1, // Multiplication
  Scale: 2, // Scaling
  Rand: 3, // Random
};


/* Player Class */
// Constructor
Game.Player = function() {
  this.clicks = 0;
};
// Add clicks
Game.Player.prototype.addClicks = function(clicks) {
  this.clicks += clicks;
  document.getElementById("clicksDisplay").innerHTML = "Clicks: "+ this.clicks;
};
// Called to collect clicks from Producers
Game.Player.prototype.collectProduction = function(clicks) {
  this.addClicks(clicks);
};



/* Clicker Class */
// Constructor
Game.Clicker = function() {
  this.addUpgrades = [];
  this.multiUpgrades = [];
  this.scaleUpgrades = [];
  this.randomUpgrades = [];
  this.buffs = [];
};
// Player click event
Game.Clicker.prototype.playerClick = function() {
  Game.player.addClicks(this.clickValue());
};
Game.Clicker.prototype.clickValue = function() {
  return Math.round((1 + this.getAddBonus()) * this.getMultiBonus() * this.getScaleBonus());
}
// Calculate additive bonus
Game.Clicker.prototype.getAddBonus = function() {
  var bonus = 0;
  for (var i = 0; i < this.addUpgrades.length; i++) {
    bonus += this.addUpgrades[i].getBonus();
  }
  return bonus;
};
// Calculate multiplicative bonus
Game.Clicker.prototype.getMultiBonus = function() {
  var bonus = 1;
  for (var i = 0; i < this.multiUpgrades.length; i++) {
    bonus *= this.multiUpgrades[i].getBonus();
  }
  return bonus;
};
// Calculate scaling bonus
Game.Clicker.prototype.getScaleBonus = function() {
  var bonus = 1;
  for (var i = 0; i < this.scaleUpgrades.length; i++) {
    bonus *= this.scaleUpgrades[i].getBonus();
  }
  return bonus;
};



/* Producer Class */
// Constructor
Game.Producer = function(name, baseCost, baseProduction, baseThreshold) {
  this.name = name;
  this.quantityOwned = 0;
  this.baseCost = baseCost;
  this.baseProduction = baseProduction;
  this.baseThreshold = baseThreshold;
  this.progress = 0;
  this.thresholdUpgrades = [];
  this.addUpgrades = [];
  this.multiUpgrades = [];
  this.scaleUpgrades = [];
  this.buffs = [];
  this.buyable;
};
// Cost Growth Rate
Game.Producer.prototype.costGrowth = 1.1;
// Current cost
Game.Producer.prototype.currentCost = function() {
  return Math.round(this.baseCost * Math.pow(this.costGrowth, this.quantityOwned));
};
// Calculate cost for quantity
Game.Producer.prototype.getCost = function(quantity) {
  return Math.round(this.currentCost() * ((Math.pow(this.costGrowth, quantity) - 1) / (this.costGrowth - 1)));
};
// Calculate production for a single unit
Game.Producer.prototype.unitProduction = function() {
  return Math.round((this.baseProduction + this.getAddBonus()) * this.getMultiBonus() * this.getScaleBonus());
};
// Calculate production per second for a single unit
Game.Producer.prototype.unitProductionRate = function() {
  return Math.round((this.baseProduction + this.getAddBonus()) * this.getMultiBonus() * this.getScaleBonus() / this.currentThreshold());
};
// Calculate total production
Game.Producer.prototype.totalProduction = function() {
  return Math.round((this.baseProduction + this.getAddBonus()) * this.getMultiBonus() * this.getScaleBonus() * this.quantityOwned);
};
// Calculate the current threshold
Game.Producer.prototype.currentThreshold = function() {
  var threshold = this.baseThreshold;
  for (upgrade in this.thresholdUpgrades) {
    threshold -= upgrade.getBonus();
  }
  return threshold < 1 ? 1 : threshold;
};
// Calculate additive bonus
Game.Producer.prototype.getAddBonus = function() {
  var bonus = 0;
  for (var i = 0; i < this.addUpgrades.length; i++) {
    bonus += this.addUpgrades[i].getBonus();
  }
  return bonus;
};
// Calculate multiplicative bonus
Game.Producer.prototype.getMultiBonus = function() {
  var bonus = 1;
  for (var i = 0; i < this.multiUpgrades.length; i++) {
    bonus *= this.multiUpgrades[i].getBonus();
  }
  return bonus;
};
// Calculate scaling bonus
Game.Producer.prototype.getScaleBonus = function() {
  var bonus = 1;
  for (var i = 0; i < this.scaleUpgrades.length; i++) {
    bonus *= this.scaleUpgrades[i].getBonus();
  }
  return bonus;
};
// Tick update for production
Game.Producer.prototype.tick = function(progress) {
  this.progress += progress;
  if (this.progress >= this.currentThreshold()) {
    Game.player.collectProduction(this.totalProduction());
    this.progress = 0;
  }
};



/* Upgrade Class */
// Constructor
Game.Upgrade = function(name, cost, type, bonus, target) {
  this.name = name;
  this.cost = cost;
  this.type = type;
  this.bonus = bonus;
  this.unlocked;
  this.target = target;
  this.effect;
  this.description;
  this.buyable;
};
// Calculate bonus value
Game.Upgrade.prototype.getBonus = function() {
  return this.bonus;
};

buyAddBonus = function() {
  Game.clicker.addUpgrades.push(new Game.Upgrade("",0,Game.UpgradeTypes.Add, 1, Game.testProd));
  document.getElementById("addBonusDisplay").innerHTML = "Add Bonus: " + Game.clicker.getAddBonus();
  document.getElementById("clickValueDisplay").innerHTML = "Click Value: " + Game.clicker.clickValue();
  Game.clicker.addUpgrades[0].target.addUpgrades.push(Game.clicker.addUpgrades[0]);
  console.log(Game.clicker.addUpgrades[0].target.quantityOwned);
};

buyMultiBonus = function() {
  Game.clicker.multiUpgrades.push(new Game.Upgrade("",0,Game.UpgradeTypes.Multi, 1.5, Game.testProd));
  document.getElementById("multiBonusDisplay").innerHTML = "Multi Bonus: " + Game.clicker.getMultiBonus();
  document.getElementById("clickValueDisplay").innerHTML = "Click Value: " + Game.clicker.clickValue();
  console.log(Game.clicker.multiUpgrades[0].target.quantityOwned);
  Game.clicker.addUpgrades[0].bonus += 1;
};


/* Debug Testing Code */
// Setup player
Game.player = new Game.Player();
// Setup Clicker
Game.clicker = new Game.Clicker();

// Test Producer class
Game.testProd = new Game.Producer("Test", 10, 10, 1);
Game.testProd.quantityOwned = 3;
console.log(Game.testProd.currentCost());
console.log(Game.testProd.getCost(1));
console.log(Game.testProd.getCost(9));
// Test payouts
Game.testProd.player = Game.player;
console.log("TICKING STARTED");
setInterval(function() { Game.testProd.tick(0.2); }, 200);

var listprod = [Game.testProd, Game.testProd];
listprod[0].quantityOwned = 4;
listprod[1].quantityOwned = 1;
