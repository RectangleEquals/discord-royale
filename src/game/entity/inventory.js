const { QuestItem, Consumable, Currency, Equipment } = require('./item');

class Inventory
{
  constructor()
  {
    this.currency = [ new Currency() ];
    this.consumables = [ new Consumable() ];
    this.equipment = [ new Equipment() ];
  }

  getWeight()
  {
    let currencyWeight = 0;
    this.currency.forEach(e => {
      currencyWeight += e.weight;
    });
    
    let consumableWeight = 0;
    this.consumables.forEach(e => {
      consumableWeight += e.weight;
    });

    let equipmentWeight = 0;
    this.equipment.forEach(e => {
      equipmentWeight += e.weight;
    });
    
    return currencyWeight + consumableWeight + equipmentWeight;
  }
};

class PlayerInventory extends Inventory
{
  constructor()
  {
    super();
    this.questItems = [ new QuestItem() ];
  }
};

module.exports = { Inventory, PlayerInventory };