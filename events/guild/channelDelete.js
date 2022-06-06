const { MessageEmbed, Client, GuildChannel } = require("discord.js");
const GuildConfig = require("../../models/GuildConfig");
/**
 *
 * @param {Client} client
 * @param {GuildChannel} channel
 * @returns
 */

module.exports = async (client, channel) => {
  try {
    const { guild } = channel;
    const guildConfigs = await GuildConfig.findOne({ GuildID: guild.id });

    if (guildConfigs) {
      if (channel.id === guildConfigs.TextChannel) {
        const player = await client.manager.players.get(guild.id);
        if (player) player.destroy();
        await GuildConfig.findOneAndDelete({ GuildID: guild.id });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
