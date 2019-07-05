const Discord = require('discord.js');
const bot = new Discord.Client();

require('dotenv').config();

const fees = {
  Stockx: n => 0.095 * n,
  Paypal: n => (0.029 * n) + 0.3,
  Ebay: n => 0.1 * n + fees.Paypal(n - (0.1*n)),
  Goat: n => 0.095 * n + fees.Paypal(n - 0.095*n),
}

bot.on('message', msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith('!fee')) return;
  const [,number] = msg.content.split(' ');
  const embed = new Discord.RichEmbed();

  if (isNaN(number)) return msg.channel.send({ embed: { 
      color: 3447003, 
      description: ':interrobang: Argument must be a number.'
    }
  });

  Object.keys(fees).forEach(fee => {
    embed.addField(`${fee} Payout`, `$${Number(number - fees[fee](number)).toFixed(2)}`);
  });

  msg.channel.send(embed);
});

bot.login(process.env.BOT_TOKEN);

