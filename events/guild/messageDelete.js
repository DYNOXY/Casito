const { Client, Message } = require("discord.js");
const GuildConfig = require("../../models/GuildConfig");
// models

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @returns
 */
module.exports = async (client, message) => {
  try {
    const { guild } = message;
    const guildConfigs = await GuildConfig.findOne({ GuildID: guild.id });

    if (guildConfigs) {
      if (message.id === guildConfigs.Message) {
        const player = await client.manager.players.get(guild.id);
        if (player) player.destroy();
        // const { embeds, components } = message;
        const msg = await message.channel.send({ embeds: [client.defaultEmbed], components: client.defaultComponents, content: client.defaultMessage }).catch(client.handleError);
        await GuildConfig.findOneAndUpdate({ GuildID: guild.id }, { Message: msg.id });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
