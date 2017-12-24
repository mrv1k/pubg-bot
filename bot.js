const chalk = require('chalk');
const Discord = require('discord.js');
const auth = require('./auth.json');
const erangel = require('./maps/erangel.json');
const client = new Discord.Client();

const pre = '-p';

client.on('guildCreate', (guild) => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  guild.channels.find('name', 'general').send('``-p help`` to see options');
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on('guildDelete', (guild) => {
  console.log(`I've left ${guild.name}`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on('debug', (e) => console.log(chalk.blue(e)));
client.on('warn', (e) => console.warn(chalk.bgYellow(e)));
client.on('error', (e) => console.error(chalk.bgRed(e)));


client.on('message', (message) => {
  if (!message.content.startsWith(pre) || message.author.bot) return;

  let arr;
  const cArr = message.content.split(' ');
  c = cArr[1];
  if (c === 'military' || c === 'mili') {
    arr = Object.values(erangel.military);
  } else if (c === 'military small') {
    arr = Object.values(erangel.military_small);
  } else if (c === 'high' || c === 'h') {
    arr = Object.values(erangel.high);
  } else if (c === 'medium' || c === 'm') {
    arr = Object.values(erangel.medium);
  } else if (c === 'low') {
    message.reply(erangel.low);
    return;
  } else if (c === 'help' || c === 'halp') {
    message.author.send(
      new Discord.RichEmbed()
      .setColor('#16a085')
      .setDescription(`
-p <map> <loot level>

**Only erangel drops currently available so <map> is already erangel, drop it**
**-p <loot level>**


Possible options currently unavailable
[-E-<location(s)>|--exclude-<location(s)>]
[-L|--list]
[-T|--time]

<loot level>:
  **[-military|--mili]** :: high chance of military loot spawn
  **[-high|--h]**            :: high risk, high reward
  **[-medium|--m]**    :: medium risk, medium RNG
  **[-military small]** :: small chance of military loot spawn

**Other**
**-p help**
      `)
      .setFooter(`High/Medium from pubgmap.io, Military from imgur.com/a/uEGe5`)
  );
    return;
  } else {
    return;
  }
  const rand = Math.round(Math.random() * arr.length);
  console.log(arr.length, arr[rand], rand);
  message.reply(arr[rand]);
});


client.login(auth.token);
