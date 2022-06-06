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
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (player.queue.length <= 0) {
      embed.setDescription(`Queue length is too Small to Skip!`);
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (player.queue.current.requester?.id !== interaction.user.id && !interaction.member.permissions.has("MANAGE_GUILD")) {
      embed.setDescription(`You Cant Skip this Track!`);

      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    player.stop();

    embed.setDescription(`Skipped to Next Song!`);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    client.handleError(error);
  }
};
