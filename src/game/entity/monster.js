import { Entity } from './entity.js';
import { EntityAttributes } from './attributes.js';
import { Vector2 } from '../vector2.js';
import { Inventory } from './inventory.js';

export class Monster extends Entity
{
  constructor(id, name, attributes)
  {
    super(id, name || "Unknown Monster");
    this.attributes = attributes || new EntityAttributes();
    this.location = new Vector2();
    this.inventory = new Inventory();
  }
};