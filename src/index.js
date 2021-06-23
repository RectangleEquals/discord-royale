import { conf } from './conf.js';
import WebSocketServer from "ws";
import http from "http";
import express from "express";

let app = {};
app.server = {
  express: express(),
  http: {},
  ws: {}
};

app.server.express.use(express.static(process.cwd() + "/"));
app.server.http = http.createServer(app.server.express);
const port = conf("PORT");
app.server.http.listen(port);
console.log("http server listening on %d", port);

app.server.ws = new WebSocketServer.Server({server: app.server.http});
console.log("websocket server created");

import Discord from 'discord.js';
app.bot = new Discord.Client();
import { Game } from './game/game.js';

app.bot.on("guildCreate", (guild) => {
  console.log(`Joined new guild: ${guild.name}`);
  console.log(`Guild details: ${JSON.stringify(guild)}`);
  server.db.addGuild(guild);
});

app.bot.on("guildCreate", (guild) => {
  console.log(`Joined new guild: ${guild.name}`);
  console.log(`Guild details: ${JSON.stringify(guild)}`);
  app.server.db.removeGuild(guild);
});

app.server.ws.on("connection", function(ws, req)
{
  console.log("websocket connection open");

  ws.send("OK", () => { });
  ws.on('message', async (message) => {
    const channel = await app.bot.channels.fetch(conf("CHANNEL_ID"));
    await channel.send(message);
  });

  ws.on("close", () => {
    console.log("websocket connection close");
  });
});

app.bot.on('ready', () => {
  console.log(`Logged in as ${app.bot.user.tag}!`);
  // app.bot.channels.fetch(conf("CHANNEL_ID"))
  //   .then(channel => channel.send("profile"));
  app.bot.channels.fetch(conf("CHANNEL_ID"))
    .then(channel => channel.send("bot join"));
});

async function purgeChannel(channel)
{
  let messages = await channel.messages.fetch({ limit: 100 });
  while(messages.size >= 2) {
    channel.bulkDelete(messages);
    messages = await channel.messages.fetch({ limit: 100 });
  }
}

app.bot.on('message', message =>
{
  // Ignore all messages from channels that haven't been whitelisted
  if(!(message.channel.id === conf("CHANNEL_ID")))
    return;

  if(message.content === 'purge') {
    purgeChannel(message.channel);
  }

  if(message.content === 'join') {
    Game.get(app.bot).onPlayerJoin(message);
  }

  if(message.content === 'gamestate') {
    message.channel.send(Game.get(app.bot).state.toString());
  }

  if (message.content === 'profile') {
    Game.get(app.bot).onPlayerProfile(message);
	}

  if (message.content.startsWith('bot ')) {
    let parts = message.content.split(' ');
    message.channel.send(parts[1]);
  }

  if(message.content === 'hunt') {
    Game.get(app.bot).onPlayerHunt(message);
  }

  if(message.content === 'get') {
    let player = Game.get(app.bot).world.findOrCreatePlayer(message.member);
    message.channel.send(
      "Player info for `" + player.name + "`:\n`" + player.toString() + "`"
    );
  }

  if(message.content.startsWith('set '))
  {
    let parts = message.content.split(' ');
    let player = Game.get(app.bot).world.findOrCreatePlayer(message.member);

    switch(parts[1])
    {
      case 'level':
        player.attributes.level = parts[2];
        break;
      case 'xp':
        player.attributes.stats.xp = parts[2];
        player.attributes.max_xp = parts[3];
        break;
      case 'hp':
        player.attributes.stats.hp = parts[2];
        player.attributes.max_hp = parts[3];
        break;
      case 'stamina':
        player.attributes.stats.stamina = parts[2];
        player.attributes.max_stamina = parts[3];
        break;
      case 'str':
        player.attributes.strength = parts[2];
        break;
      case 'dex':
        player.attributes.dexterity = parts[2];
        break;
      case 'int':
        player.attributes.intelligence = parts[2];
        break;
      default:
        break;
    }
    updatePlayer(player);

    message.channel.send(
      "Player information updated for `" + player.name + "`:\n`" + player.toString() + "`"
    );
  }
});

app.bot.on('guildMemberAdd', async member =>
{
  let channel = await app.bot.channels.fetch(conf("CHANNEL_ID"));
	if (!channel)
    return;
});

app.bot.login(conf("BOT_TOKEN"));