// Stats are dynamic, temporal or runtime-calculated variables

export class Stats
{
  constructor()
  {
    this.hp = 0;
    this.stamina = 0;
    this.attack = 0;
    this.defense = 0;
  }

  toString() {
    return "{ Stats (Unimplemented) }";
  }
};

export class PlayerStats extends Stats
{
  constructor() {
    super();
    this.xp = 0;
  }

  toString() {
    return JSON.stringify(this, null, 2);
  }
};