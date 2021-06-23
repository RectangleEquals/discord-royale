import { Entity } from './entity.js';
import { PlayerAttributes } from './attributes.js';
import { Vector2 } from '../vector2.js';
import { PlayerInventory } from './inventory.js';

export class Player extends Entity
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