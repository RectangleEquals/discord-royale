let app = require('./app');
app.server.db = require('./db');
const Discord = require('discord.js');
app.bot = new Discord.Client();
const Canvas = require('node-canvas');
const { config } = require('./config');
const { World } = require('./game/world');
const { Player } = require('./game/entity/player');
const { Profile } = require('./game/ui/profile');

let g_world = new World();

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
  console.log("websocket connection open")

  ws.send("OK", () => { });
  ws.on('message', async (message) => {
    const channel = await app.bot.channels.fetch(config("CHANNEL_ID"));
    await channel.send(message);
  });

  ws.on("close", () => {
    console.log("websocket connection close")
  });
});

app.bot.on('ready', () => {
  console.log(`Logged in as ${app.bot.user.tag}!`);
  // app.bot.channels.fetch(config("CHANNEL_ID"))
  //   .then(channel => channel.send("profile"));
  app.bot.channels.fetch(config("CHANNEL_ID"))
    .then(channel => channel.send("get"));
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
  if(!(message.channel.id === config("CHANNEL_ID")))
    return;

  if(message.content === 'purge') {
    purgeChannel(message.channel);
  }

  if (message.content === 'profile')
  {
    let player = findOrCreatePlayer(message.member);
		showProfile(player, message.member, message.channel);
	}

  if (message.content === 'self') {
    message.channel.send("profile");
  }

  if(message.content === 'get') {
    let player = findOrCreatePlayer(message.member);
    message.channel.send(
      "Player info for `" + player.name + "`:\n`" + player.toString() + "`"
    );
  }

  if(message.content.startsWith('set '))
  {
    let parts = message.content.split(' ');
    let player = findOrCreatePlayer(message.member);

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

function findOrCreatePlayer(member)
{
  let player = {};

  // Check for existing player
  g_world.players.forEach(p => {
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
    g_world.players.push(player);
  }

  return player;
}

function updatePlayer(player)
{
  try {
    console.log("Updating player information for `" + player.id + "`...");
    g_world.players.forEach(p => {
      if(p.id === player.id) {
        g_world.players[g_world.players.indexOf(p)] = player;
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

async function showProfile(player, member, channel)
{
  const canvas = Canvas.createCanvas(config("PROFILE_CANVAS_WIDTH"), config("PROFILE_CANVAS_HEIGHT"));
	const context = canvas.getContext('2d');
  let profile = new Profile(context, member, player);
  await profile.render();

  // attach and send
  const filename = 'profile-' + member.id + '.png';
  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), filename);
  channel.send(`Here's your profile, ${member}!`, attachment);
}

app.bot.on('guildMemberAdd', async member =>
{
  let channel = await app.bot.channels.fetch(config("CHANNEL_ID"));
	if (!channel)
    return;
});

app.bot.login(config("BOT_TOKEN"));