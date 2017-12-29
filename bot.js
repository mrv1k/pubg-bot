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

  const cArr = message.content.substring(3).split(' ');
  let command;
  let mapJSON;
  if (cArr[0] === 'e' || cArr[0] === 'erangel' ) {
    mapJSON = erangel;
  } else {
    // set erangel by default
    cArr.unshift('e');
    mapJSON = erangel;
  }
  console.log(cArr);

  if (cArr[2] === '-L' || cArr[2] === '--list') {
    if (cArr[1] === 'military' || cArr[1] === 'mili') {
      command = Object.values(mapJSON['military']);
    } else if (cArr[1] === 'military small') {
      command = Object.values(mapJSON['military_small']);
    } else if (cArr[1] === 'high' || cArr[1] === 'h') {
      command = Object.values(mapJSON['high']);
    } else if (cArr[1] === 'medium' || cArr[1] === 'm') {
      command = Object.values(mapJSON['medium']).join(', ');
    }
    message.reply(`"${cArr[1]}" contains:\n${command}.`);
    return;
  } else {
    if (cArr[1] === 'military' || cArr[1] === 'mili') {
      command = genDropLoc(mapJSON, 'military');
    } else if (cArr[1] === 'military small') {
      command = genDropLoc(mapJSON, 'military_small');
    } else if (cArr[1] === 'high' || cArr[1] === 'h') {
      command = genDropLoc(mapJSON, 'high');
    } else if (cArr[1] === 'medium' || cArr[1] === 'm') {
      command = genDropLoc(mapJSON, 'medium');
    } else if (cArr[1] === 'low') {
      message.reply(mapJSON.low);
      return;
    }
    message.reply(command);
    return;
  }

  if (cArr[1] === 'help' || cArr[1] === 'halp') {
    message.channel.send(
      new Discord.RichEmbed()
      .setColor('#16a085')
      .setDescription(`
-p <loot level>

Possible options **currently unavailable**
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
    message.reply(`'${cArr.join(' ')}' is not a pubg-bot command. See 'p --help'.`);
    return;
  }
});


client.login(auth.token);
