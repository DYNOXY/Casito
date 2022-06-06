const { Client } = require("discord.js");
const GuildConfig = require("../models/GuildConfig");

/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
  return new Promise(async (res, rej) => {
    try {
      // console.log("-".repeat(38).yellow);
      // console.log(`[●] Resetting Embeds...\n`.magenta);

      const data = await GuildConfig.find({ GuildID: [...client.guilds.cache.map((e) => e.id)] });

      data.forEach(async (e) => {
        const guild = client.guilds.cache.get(e.GuildID);
        if (!guild) return;
        const channel = guild?.channels.cache.get(e.TextChannel);
        // client.db.set(e.GuildID, e);
        const msg = await channel.messages.fetch(e.Message).catch((e) => {});
        if (msg) msg.delete();
        //
        const mesg = await channel.send({ embeds: [client.defaultEmbed] });

        await GuildConfig.findOneAndUpdate({ GuildID: guild.id }, { Message: mesg.id });

        // console.log(`[✔] Cached database for ${guild.name} [${e.GuildID.cyan}${"]".green}`.green);
      });

      // console.log("-".repeat(38).yellow);
      // client.settings
      res();
    } catch (err) {
      console.log(`Error While Resetting Embeds => `.red, err);
    }
  });
};
