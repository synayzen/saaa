const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const jdb = new qdb.table("cezalar");
const kdb = new qdb.table("kullanici");
const ms = require('ms');

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter("⚔ Assassins Developed by Synayzen İvar").setColor("#9900ff").setTimestamp();
  if(!ayar.muteRolu || !ayar.muteciRolleri) return message.channel.send("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(embed.setDescription(`Temp Mute komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`)).then(x => x.delete({timeout: 5000}));
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!uye) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  let muteler = jdb.get(`tempmute`) || [];
  let sure = args[1];
  let reason = args.splice(2).join(" ");
  if(!sure || !ms(sure) || !reason) return message.channel.send(embed.setDescription("Geçerli bir süre (1s/1m/1h/1d) ve sebep belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  await uye.roles.add(ayar.muteRolu).catch();
  if (!muteler.some(j => j.id == uye.id)) {
    jdb.push(`tempmute`, {id: uye.id, kalkmaZamani: Date.now()+ms(sure)})
    kdb.add(`kullanici.${message.author.id}.mute`, 1);
    kdb.push(`kullanici.${uye.id}.sicil`, {
      Yetkili: message.author.id,
      Tip: "MUTE",
      Sebep: reason,
      Zaman: Date.now()
    });
  };
  message.channel.send(embed.setDescription(`<:muteli:842034165918728212> ${uye} üyesi, ${message.author} tarafından **${sure}** boyunca **${reason}** nedeniyle mutelendi!`)).catch();
  if(ayar.muteLogKanali && client.channels.cache.has(ayar.muteLogKanali)) client.channels.cache.get(ayar.muteLogKanali).send(embed.setDescription(`<:muteli:842034165918728212> **Mutelendirildi!** \n **Mutelenilen:** ${uye} (\`${uye.id}\`) \n **Yetkili:** ${message.author} (\`${message.author.id}\`) \n **Süre:** \`${sure}\` \n **Sebep:** \`${reason}\` nedeniyle mutelendi!`)).catch();
};
module.exports.configuration = {
  name: "tempmute",
  aliases: ['tempsusturmak', 'sürelimute', 'geçici-mute'],
  usage: "tempmute [üye] [süre] [sebep]",
  description: "Belirtilen üyeyi süreli muteler."
};