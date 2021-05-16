const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const ayar = db.get('ayar') || {};
const client = global.client;
module.exports = () => {
  console.log("Bot aktif!");
  client.user.setActivity(`Synayzen lvar 💕 Assassin's Creed Family`, {
    type: "STREAMING",
    url: "https://www.twitch.tv/synayzen"})
        .then(presence => console.log(`HAZIR KAPTAN ASSASSİNS!  ${presence.game ? presence.game.none : '🛠'}`))
        .catch(console.error);
  if (ayar.botSesKanali && client.channels.cache.has(ayar.botSesKanali)) client.channels.cache.get(ayar.botSesKanali).join().catch();
}
module.exports.configuration = {
  name: "ready"
}