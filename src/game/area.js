const { Vector2 } = require('./vector2');

class Area
{
  constructor(world, name, location, players, monsters) {
    this.name = name || "Unknown Place";
    this.world = world || {};
    this.location = location || new Vector2();
    this.players = players || [];
    this.monsters = monsters || [];
  }

  toString() {
    return JSON.stringify({
      name: this.name,
      world: this.world,
      location: this.location,
      players: this.players,
      monsters: this.monsters
    });
  }
};

module.exports = { Area };