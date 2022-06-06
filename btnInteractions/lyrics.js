const { Interaction, Message, Client, MessageEmbed } = require("discord.js");
const { Player } = require("erela.js");
const { getLyrics } = require(`genius-lyrics-api`);

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 * @param {Player} player
 * @param {Message} mainMsg
 */
module.exports = async (client, interaction, player, mainMsg) => {
  try {
    const embed = new MessageEmbed().setColor(client.colors.main);
    if (!player) {
      embed.setDescription(`Nothing is Playing!`);
      mainMsg.reset();
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!player?.queue?.current) {
      embed.setDescription(`No Current Track Playing!`);
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const lyrics = await getLyrics({
      apiKey: process.env.geniusApiKey,
      artist: player.queue.current.author,
      title: player.queue.current.title,
      optimizeQuery: true,
    }).catch(client.handleError);

    embed.setDescription(lyrics ? `**${player.queue.current.title}**:\n${lyrics}` : `No lyrics Found for **${player.queue.current.title}**`);
    return await interaction.reply({ embeds: [embed], ephemeral: true }).catch(client.handleError);
  } catch (error) {
    client.handleError(error);
  }
};
