const { Interaction, Message, Client, MessageEmbed } = require("discord.js");
const { Player } = require("erela.js");

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
    const vc = interaction.member.voice?.channel;
    if (vc?.id !== player.voiceChannel) {
      embed.setDescription(`You Need To Join ${interaction.guild.channels.cache.get(player.voiceChannel)?.toString() || `Same VC`}!`);
      return await interaction.reply({ embeds: [embed], ephemeral: true }).catch(client.handleError);
    }
    if (player.queue.current.requester?.id !== interaction.user.id && !interaction.member.permissions.has("MANAGE_GUILD")) {
      embed.setDescription(`You Cant Stop this Queue!`);
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (player) player.stop();

    if (player && player.queue) player.queue.clear();

    if (!player.twentyFourSeven) {
      player.destroy();
    }

    embed.setDescription(`Stopped The Music${!player.twentyFourSeven ? ` & Destroyed The Player` : ""} by ${interaction.member.toString()}!`);

    mainMsg.reset();
    mainMsg.setFooterStatus(player);

    return await interaction.reply({ embeds: [embed] }).catch(client.handleError);
  } catch (error) {
    client.handleError(error);
  }
};
