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

    if (!player.queue.length) {
      embed.setDescription(`Queue list is Empty!`);
      return await interaction.reply({ embeds: [embed], ephemeral: true }).catch(client.handleError);
    } else if (player.queue.length <= 1) {
      embed.setDescription(`Queue list is too Short to be Shuffled!`);
      return await interaction.reply({ embeds: [embed], ephemeral: true }).catch(client.handleError);
    }

    player.queue.shuffle();
    mainMsg.setEmbed(null, `**__Queue list :-__**\n${getQueue(player.queue)}`).catch(client.handleError);

    embed.setDescription(`Shuffle The Queue!`);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    client.handleError(error);
  }
};
