import { Game } from './game.js';
import { Player } from './entity/player.js';
import * as random from 'random-seedable';

export class World
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

  async generate()
  {
    const rand = new random.XORShift64(this.seed);
    let game = Game.get();
    this.players = game.lobby.players;
    this.players.forEach(player => {
      player.attributes.level = 1;
      player.attributes.strength = ~~(2 + (rand.float() * 3));
      player.attributes.dexterity = ~~(2 + (rand.float() * 3));
      player.attributes.intelligence = ~~(2 + (rand.float() * 3));
      player.attributes.max_hp = 100;
      player.attributes.max_stamina = 5;
      player.attributes.max_xp = 50;
      player.attributes.stats.hp = 50;
      player.attributes.stats.stamina = 5;
      player.attributes.stats.xp = 20;
    });
  }

  findOrCreatePlayer(member)
  {
    let player = {};
  
    // Check for existing player
    this.players.forEach(p => {
      if(p.id === member.user.id)
        player = p;
    });
  
    // If player not found, create a new one
    if(!player.id) {
      player = new Player(member.user.id, member.displayName);
      player.attributes.level = 1;
      player.attributes.strength = 5;
      player.attributes.dexterity = 3;
      player.attributes.intelligence = 1;
      player.attributes.max_hp = 100;
      player.attributes.max_stamina = 5;
      player.attributes.max_xp = 50;
      player.attributes.stats.hp = 50;
      player.attributes.stats.stamina = 5;
      player.attributes.stats.xp = 20;
      this.players.push(player);
    }
  
    return player;
  }

  findPlayerById(id)
  {
    let player = {};
  
    // Check for existing player
    this.players.forEach(p => {
      if(p.id === id)
        player = p;
    });
  
    return player.id ? player : undefined;
  }
  
  updatePlayer(player)
  {
    try {
      console.log("Updating player information for `" + player.id + "`...");
      this.players.forEach(p => {
        if(p.id === player.id) {
          this.players[this.players.indexOf(p)] = player;
          throw "Success!";
        }
      });
      throw "Failure!";
    } catch (error) {
      if(error === "Success!") {
        console.log(error);
        return true;
      } else {
        console.error(error);
        return false;
      }
    }
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