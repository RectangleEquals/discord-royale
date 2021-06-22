const Entity = require('./entity').Entity;
const { PlayerAttributes } = require('./attributes');
const { Vector2 } = require('../vector2');
const { PlayerInventory } = require('./inventory');

class Player extends Entity
{
  constructor(id, name, attributes)
  {
    super(id, name || "Unknown Player");
    this.attributes = attributes || new PlayerAttributes();
    this.location = new Vector2();
    this.inventory = new PlayerInventory();
  }
  
  toString() {
    return JSON.stringify(this, null, 2);
  }
};

module.exports = { Player };