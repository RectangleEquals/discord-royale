const { Attributes } = require("./attributes");

const ItemType = Object.freeze({
  Undefined:  Symbol("undefined"),
  Quest:      Symbol("quest"),
  Currency:   Symbol("currency"),
  Consumable: Symbol("consumable"),
  Equipment:  Symbol("equipment")
});

const ItemRarity = Object.freeze({
  Common:     Symbol("common"),
  Rare:       Symbol("rare"),
  Epic:       Symbol("epic"),
  Legendary:  Symbol("legendary")
});

class Item
{
  constructor(type, name, iconUri)
  {
    this.type = type || ItemType.Undefined;
    this.name = name || "Unknown Item";
    this.icon = iconUri || "https://game-icons.net/icons/ffffff/000000/1x1/lorc/uncertainty.png";
  }
};

class QuestItem extends Item
{
  constructor(name, iconUri)
  {
    super(ItemType.Quest, name, iconUri);
  }
}

class DroppableItem extends Item
{
  constructor(type, name, iconUri, weight, onDrop)
  {
    super(type == ItemType.Quest ? ItemType.Undefined : type, name, iconUri);
    this.weight = weight || 0;
    this.onDrop = onDrop;
  }

  // Drops this item
  drop() {
    if(this.onDrop)
      this.onDrop(this);
  }
}

class Currency extends DroppableItem
{
  constructor(name, iconUri, weight, value, onDrop)
  {
    super(ItemType.Currency, name, iconUri, weight, onDrop);
    this.value = value || 1;
  }
};

class Consumable extends DroppableItem
{
  constructor(name, iconUri, weight, value, onDrop, onUse)
  {
    super(ItemType.Consumable, name, iconUri, weight, onDrop);
    this.value = value || 1;
    this.onUse = onUse;
  }

  // Uses this item
  use() {
    if(this.onUse)
      this.onUse(this);
  }
};

class Equipment extends DroppableItem
{
  constructor(name, iconUri, weight, attributeRequirements, rarity, value, onDrop, onEquip, onUnequip)
  {
    super(ItemType.Equipment, name, iconUri, weight, onDrop);
    this.rarity = rarity || ItemRarity.Common;
    this.attributeRequirements = attributeRequirements || new Attributes();
    this.value = value || 0;
    this.onEquip = onEquip;
    this.onUnequip = onUnequip;
  }

  // Equips this item
  equip()
  {
    if(this.onEquip)
      this.onEquip(this);
  }

  // Unequips this item
  unequip()
  {
    if(this.onUnequip)
      this.onUnequip(this);
  }
};

module.exports = { QuestItem, Consumable, Currency, Equipment };