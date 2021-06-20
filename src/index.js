let app = require('./app');
app.server.db = require('./db');
const Discord = require('discord.js');
app.bot = new Discord.Client();
const Canvas = require('node-canvas');
const { World } = require('./game/world');
const { Player } = require('./game/entity/player');
const { PlayerAttributes } = require('./game/entity/attributes');
const { config } = require('./config');
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
  console.log("Logged into Discord!");
});

app.bot.on('message', message =>
{
  if (message.content === 'profile' && message.channel.id === config("CHANNEL_ID")) {
    let player = new Player(message.member.id, message.member.displayName, new PlayerAttributes());
    player.attributes.level = 1;
    player.attributes.strength = 5;
    player.attributes.dexterity = 3;
    player.attributes.intelligence = 1;
    g_world.players.push(player);
		showProfile(player, message.member, message.channel);
	}
  if (message.content === 'self' && message.channel.id === config("CHANNEL_ID")) {
    message.channel.send("profile");
  }
});

async function showProfile(player, member, channel)
{
  let profile = new Profile(member, player);
	const canvas = Canvas.createCanvas(profile.rects.Canvas.width, profile.rects.Canvas.height);
	const context = canvas.getContext('2d');
  await profile.render(context);

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