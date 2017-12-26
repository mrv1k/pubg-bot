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

/**
 * @param {object} map Map with drop locations
 * @param {string} lootLvl Desired loot level
 * @return {string} Randomized drop location using pure random
 */
function genDropLoc(map, lootLvl) {
  const values = Object.values(map[lootLvl]);
  const rand = Math.round(Math.random() * values.length);
  return values[rand];
}

client.on('message', (message) => {
  if (!message.content.startsWith(pre) || message.author.bot) return;

  const cArr = message.content.substring(3).split(' ')[0];
  let dropLoc;
  if (cArr === 'military' || cArr === 'mili') {
    dropLoc = genDropLoc(erangel, 'military');
  } else if (cArr === 'military small') {
    dropLoc = genDropLoc(erangel, 'military_small');
  } else if (cArr === 'high' || cArr === 'h') {
    dropLoc = genDropLoc(erangel, 'high');
  } else if (cArr === 'medium' || cArr === 'm') {
    dropLoc = genDropLoc(erangel, 'medium');
  } else if (cArr === 'low') {
    message.reply(erangel.low);
    return;
  } else if (cArr === 'help' || cArr === 'halp') {
    message.channel.send(
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
  message.reply(dropLoc);
});


client.login(auth.token);
