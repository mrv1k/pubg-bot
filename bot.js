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
 * @param {string|array} exclude Location to exclude from the list
 * @return {string} Randomized drop location using random
 */
function genDropLoc(map, lootLvl, exclude) {
  let values = {};
  if (exclude) {
    Object.assign(values, map[lootLvl]);
    delete values[exclude.toLowerCase()];
    console.log(values);
  } else {
    values = Object.values(map[lootLvl]);
  }

  const rand = Math.round(Math.random() * values.length);
  return values[rand];
}

client.on('message', (message) => {
  if (!message.content.startsWith(pre) || message.author.bot) return;

  const cArr = message.content.substring(3).split(' ');
  let command;
  let mapJSON;
  if (cArr[0] === 'e' || cArr[0] === 'erangel') {
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
  } else if ((cArr[2] === '-E' || cArr[2] === '--exclude')
    && (/[a-z]/i.test(cArr[3]) || Array.isArray(cArr[3]))
  ) {
    if (cArr[1] === 'military' || cArr[1] === 'mili') {
      command = genDropLoc(mapJSON, 'military', cArr[3]);
    } else if (cArr[1] === 'military small') {
      command = genDropLoc(mapJSON, 'military_small', cArr[3]);
    } else if (cArr[1] === 'high' || cArr[1] === 'h') {
      command = genDropLoc(mapJSON, 'high', cArr[3]);
    } else if (cArr[1] === 'medium' || cArr[1] === 'm') {
      command = genDropLoc(mapJSON, 'medium', cArr[3]);
    }
    console.log(command);
    message.reply(command);
  } else if (cArr[2] === undefined || (cArr[2] === '-T' || cArr[2] === '--time')) {
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
    } else if (cArr[1] === 'help' || cArr[1] === 'halp') {
      message.channel.send(
        new Discord.RichEmbed()
          .setColor('#16a085')
          .setDescription(`
**-p <loot level> [options]** - Choose a random location based on loot level

<loot level>
  **<-military|--mili>** :: high chance of military loot spawn
  **<-high|--h>**            :: high risk, high reward
  **<-medium|--m>**    :: medium risk, medium RNG
  **<-military small>** :: small chance of military loot spawn

Options
  **[-L|--list]**                 :: Display possible options for selected group
  **[-T n|--time n]**       :: Delay the results by n seconds (n can be from 1 to 10)
  Unavailable
  **[-E place|**                 :: Exclude location from the drop list.
     **--exclude place]** :: Exclude multiple by listing them through comma (1,2,3)

Other:
  -p help
        `)
          .setFooter(`High/Medium from pubgmap.io, Military from imgur.com/a/uEGe5`)
      );
      return; // help return
    }
    if (cArr[2] === '-T' || cArr[2] === '--time') {
      if (cArr[3] > 10) {
        message.reply(`Woah. Calm down there cowboy. Limited ${cArr[3]} to 10 seconds.`);
        cArr[3] = 10;
      } else if (cArr[3] <= 0) {
        message.reply(`Negative time? Really? Come on. Changed ${cArr[3]} to 0 seconds.`);
        cArr[3] = 0;
      }
      setTimeout(() => {
        message.reply(command);
      }, Math.round(cArr[3]) * 1000);
    } else {
      message.reply(command);
    }
    return; // undefined/default return
  } else {
    message.reply(`'${cArr.join(' ')}' is not a pubg-bot command. See 'p --help'.`);
    return;
  }
});


client.login(auth.token);
