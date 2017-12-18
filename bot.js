const Discord = require('discord.js');
const auth = require('./auth.json');

const client = new Discord.Client();
const pre = '-';

client.on('ready', () => {
  console.log('Bot in.');
  console.log(`Users: ${client.users.size}. Channels: ${client.channels.size}. Guilds: ${client.guilds.size}.`);
});

client.on('guildCreate', guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  guild.channels.find('name', 'general').send('PUBG roulette initialize!');
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on('guildDelete', guild => {
  guild.channels.find('name', 'general').send('See ya!');
  client.user.setGame(`on ${client.guilds.size} servers`);
});


client.on('message', async message => {
  if (!message.content.startsWith(pre) || message.author.bot) { return; }

  if (message.content ===  `${pre}here?`) {
    message.channel.send('I\'m here!');
  }
});

client.login(auth.token);
