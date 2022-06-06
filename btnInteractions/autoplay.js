const { Interaction, Message, Client, MessageEmbed, GuildChannel, TextChannel } = require("discord.js");
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

    // console.log(player.get("autoplay"));

    embed.setDescription(`Not Ready Yet!`);
    await interaction.reply({ embeds: [embed], ephemeral: true }).catch(client.handleError);
  } catch (error) {
    client.handleError(error);
  }
};
