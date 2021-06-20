// Stats are dynamic, temporal or runtime-calculated variables

class Stats
{
  constructor()
  {
    this.hp = 0;
    this.stamina = 0;
    this.attack = 0;
    this.defense = 0;
  }
};

class PlayerStats extends Stats
{
  constructor() {
    super();
    this.xp = 0;
  }
};

module.exports = { Stats, PlayerStats };