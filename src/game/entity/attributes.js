import { Stats, PlayerStats } from './stats.js';

// Attributes are static, pre-determined, or rarely changed variables

export class Attributes
{
  constructor() {
    this.level = 0;
    this.strength = 0;
    this.dexterity = 0;
    this.intelligence = 0;
  }

  toString() {
    return "{ Attributes (Unimplemented) }";
  }
}

export class EntityAttributes extends Attributes
{
  constructor() {
    super();
    this.max_hp = 0;
    this.max_stamina = 0;
    this.stats = new Stats();
  }

  toString() {
    return "{ EntityAttributes (Unimplemented) }";
  }
}

export class PlayerAttributes extends Attributes
{
  constructor()
  {
    super();
    this.max_hp = 0;
    this.max_stamina = 0;
    this.max_xp = 0;
    this.stats = new PlayerStats();
  }

  toString() {
    return JSON.stringify(this, null, 2);
  }
};