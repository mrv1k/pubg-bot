const Discord = require('discord.js');
const auth = require('./auth.json');
const erangel = require('./maps/erangel.json');
const client = new Discord.Client();

const pre = '-p';

// client.on('ready', () => {
//   console.log('Bot in.');
//   console.log(`Users: ${client.users.size}. Channels: ${client.channels.size}. Guilds: ${client.guilds.size}.`);
// });

client.on('guildCreate', (guild) => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  guild.channels.find('name', 'general').send('``-p help`` to see options');
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on('guildDelete', (guild) => {
  guild.channels.find('name', 'general').send('See ya!');
  client.user.setGame(`on ${client.guilds.size} servers`);
});


client.on('message', (message) => {
  if (!message.content.startsWith(pre) || message.author.bot) return;

  let arr;
  const c = message.content;
  if (c === `${pre} military` || c === `${pre} mili`) {
    arr = Object.values(erangel.military);
  } else if (c === `${pre} military small`) {
    arr = Object.values(erangel.military_small);
  } else if (c === `${pre} high` || c === `${pre} h`) {
    arr = Object.values(erangel.high);
  } else if (c === `${pre} medium` || c === `${pre} m`) {
    arr = Object.values(erangel.medium);
  } else if (c === `${pre} low`) {
    message.reply(erangel.low);
    return;
  } else if (c === `${pre} help` || c === `${pre} halp`) {
    message.author.send(
      new Discord.RichEmbed()
      .setColor('#16a085')
      .setDescription(`
__**Random A Drop Location**__
**-p military** (-p mili)
**-p high** (-p h)
**-p medium** (-p m)
**-p military small**

__**List All Possible Drop Locations**__ (Early access coming soon™)
**-pl military**
**-pl high**
**-pl medium**
**-pl military small**

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
