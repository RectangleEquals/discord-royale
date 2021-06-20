class World
{
  constructor(seed, areas, players, monsters)
  {
    let now = new Date(Date.now());
    this.seed = seed || now.valueOf();
    this.time = now.getTime().valueOf();
    this.areas = areas || [];
    this.players = players || [];
    this.monsters = monsters || [];
  }

  toString() {
    return JSON.stringify({
      seed: this.seed,
      time: this.time,
      areas: this.areas,
      players: this.players,
      monsters: this.monsters,
      guilds: this.guilds
    });
  }
};

module.exports = { World };