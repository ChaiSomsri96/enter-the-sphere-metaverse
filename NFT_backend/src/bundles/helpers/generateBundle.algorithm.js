const db = require("../../../models");

const generateBundleAlgo = async () => {
  // get list of cards from db
  const cards = await db.Cards.findAll();

  const itemDrps = new WeightedRandomBag();
  for (let i = 0; i < cards.length; i++) {
    itemDrps.addEntry(cards[i], cards[i].chance);
  }
  const selectedCards = [];
  setTimeout(() => {
    console.log("itemDrps", itemDrps);
  }, 3);

  // drawing random entries from it
  for (let i = 0; i < 5; i++) {
    selectedCards.push(itemDrops.getRandom());
  }

  return selectedCards;
};

const WeightedRandomBag = function () {
  var entries = [];
  var accumulatedWeight = 0.98;

  this.addEntry = function (object, weight) {
    accumulatedWeight += weight;
    entries.push({ object: object, accumulatedWeight: accumulatedWeight });
  };

  this.getRandom = function () {
    var r = Math.random() * accumulatedWeight;
    return entries.find(function (entry) {
      return entry.accumulatedWeight >= r;
    }).object;
  };
};
module.exports = generateBundleAlgo;
