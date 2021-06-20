class Entity {
  constructor(id, name)
  {
    this.id = id || 0;
    this.name = name || "Unknown Entity";
  }
};

module.exports = { Entity };