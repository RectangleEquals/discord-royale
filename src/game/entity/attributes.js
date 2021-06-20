const { Stats, PlayerStats } = require('./stats');

// Attributes are static, pre-determined, or rarely changed variables

class Attributes
{
  constructor() {
    this.level = 0;
    this.strength = 0;
    this.dexterity = 0;
    this.intelligence = 0;
  }
}

class EntityAttributes extends Attributes
{
  constructor() {
    super();
    this.max_hp = 0;
    this.max_stamina = 0;
    this.stats = new Stats();
  }
}

class PlayerAttributes extends EntityAttributes
{
  constructor()
  {
    super();
    this.max_xp = 0;
    this.stats = new PlayerStats();
  }
};

module.exports = { Attributes, EntityAttributes, PlayerAttributes };