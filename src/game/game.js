import { conf } from '../conf.js';
import Canvas from 'node-canvas';
import Discord from 'discord.js';
import { World } from "./world.js";
import { Profile } from './ui/profile.js';

export const GameState = Object.freeze({
  Idle:       Symbol("idle"),
  Lobby:      Symbol("lobby"),
  Generation: Symbol("generation"),
  Playing:    Symbol("playing")
});

let g_gameInstance;

export class Game
{
  constructor(bot, world) {
    this.bot = bot;
    this.world = world || new World(conf("WORLD_TEST_SEED"));
    this.state = GameState.Idle;
    this.lobby = {};
    this.lobby.players = [];
    this.lobby.timeCreated = undefined;
    this.lobby.timeStarting = undefined;
    g_gameInstance = this;
  }

  static get(bot) {
    return g_gameInstance || new Game(bot);
  }

  async startLobby() {
    if(this.state === GameState.Idle) {
      this.state = GameState.Lobby;
      this.lobby.timeCreated = new Date(Date.now());
      this.lobby.timeStarting = new Date(this.lobby.timeCreated.getTime() + conf("LOBBY_WAIT_TIME"));
      let channel = await this.bot.channels.fetch(conf("CHANNEL_ID"));
      channel.send("Lobby created: " + this.lobby.timeCreated.toString() + "\nStarting at: " + this.lobby.timeStarting.toString());
      this.updateLobby(channel);
    }
  }

  async updateLobby(channel)
  {
    if(g_gameInstance.state !== GameState.Lobby) {
      console.error("Tried to update the lobby in " + g_gameInstance.state.toString() + " state!");
      return;
    }

    let now = new Date(Date.now());
    let diff = g_gameInstance.lobby.timeStarting.getTime() - now.getTime();

    // If the lobby countdown timer has expired
    if(diff <= 0) {
      g_gameInstance.state = GameState.Generation;
      let playerNames = [];
      g_gameInstance.lobby.players.forEach(p => {
        playerNames.push( p.name );
      });
      let strPlayers = playerNames.toString();
      strPlayers = strPlayers.replace(/,/g, ", ");
      channel.send(`Starting game for: ${strPlayers}`);
      return;
    }

    // Send a "countdown" channel notification
    let strTime = "";
    if(diff >= 60000) {
      let duration = diff / 1000;
      let minutes = ~~((duration % 3600) / 60);
      let seconds = ~~duration % 60;
      strTime = `${minutes}m${seconds}s`;
    } else {
      strTime = `${~~(diff / 1000).toString()} seconds`; 
    }
    channel.send(`Game starting in **${strTime}**...`);

    setTimeout(g_gameInstance.updateLobby, conf("LOBBY_UPDATE_FREQUENCY"), channel);
  }

  async onPlayerJoin(message)
  {
    switch(this.state)
    {
      case GameState.Lobby: {
        let player = this.world.findOrCreatePlayer(message.member);
        this.lobby.players.push(player);
        message.channel.send(`${message.member} has joined the lobby!`);
        break;
      }
      case GameState.Generation:
      case GameState.Playing:
        message.channel.send(` Sorry ${message.member}, there is already a game in session!`);
        break;
      case GameState.Idle:
        message.channel.send(`${message.member} has started a new game!\n Type \`join\` to play!`);
        let player = this.world.findOrCreatePlayer(message.member);
        this.lobby.players.push(player);
        this.startLobby();
        break;
      default:
        break;
    }
  }

  async onPlayerHunt(message) {
    channel.send("Hunting not yet implemented :(");
  }

  async onPlayerProfile(message)
  {
    let player = this.world.findOrCreatePlayer(message.member);
    const canvas = Canvas.createCanvas(conf("PROFILE_CANVAS_WIDTH"), conf("PROFILE_CANVAS_HEIGHT"));
    const context = canvas.getContext('2d');
    let profile = new Profile(context, message.member, player);
    await profile.render();
  
    // attach and send
    const filename = 'profile-' + message.member.id + '.png';
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), filename);
    message.channel.send(`Here's your profile, ${message.member}!`, attachment);
  }
};