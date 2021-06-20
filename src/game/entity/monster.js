const { Entity } = require('./entity');
const { EntityAttributes } = require('./attributes');
const { Vector2 } = require('../vector2');
const { Inventory } = require('./inventory');

class Monster extends Entity
{
  constructor(id, name, attributes)
  {
    super(id, name || "Unknown Monster");
    this.attributes = attributes || new EntityAttributes();
    this.location = new Vector2();
    this.inventory = new Inventory();
  }
};

module.exports = { Monster };