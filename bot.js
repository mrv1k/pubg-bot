const Discord = require('discord.js');
const auth = require('./auth.json');
const erangel = require('./erangel.json');

const client = new Discord.Client();
const pre = '-';

client.on('ready', () => {
  console.log('Bot in.');
  console.log(`Users: ${client.users.size}. Channels: ${client.channels.size}. Guilds: ${client.guilds.size}.`);
});

client.on('guildCreate', (guild) => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  guild.channels.find('name', 'general').send('PUBG roulette initialize!');
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on('guildDelete', (guild) => {
  guild.channels.find('name', 'general').send('See ya!');
  client.user.setGame(`on ${client.guilds.size} servers`);
});


client.on('message', (message) => {
  if (!message.content.startsWith(pre) || message.author.bot) return;

  let arr;
  let r = Math.random();
  const c = message.content;
  if (c === `${pre}military` || c === `${pre}mili`) {
    arr = Object.values(erangel.military);
  } else if (c === `${pre}military small`) {
    arr = Object.values(erangel.military_small);
  } else if (c === `${pre}high` || c === `${pre}h`) {
    arr = Object.values(erangel.high);
  } else if (c === `${pre}medium` || c === `${pre}m`) {
    arr = Object.values(erangel.medium);
  } else if (c === `${pre}low`) {
    message.reply(erangel.low);
    return;
  } else if (c === `${pre}pubg-bot`) {
    message.channel.send([
      ' Type "-" and any of the following e.g: -mili',
      'military       || mili',
      'high             || h',
      'medium      || m',

      'or military small',
    ]);
    return;
  } else {
    return;
  }
  r = Math.round(r);
  message.reply(arr[r]);
});

client.login(auth.token);
