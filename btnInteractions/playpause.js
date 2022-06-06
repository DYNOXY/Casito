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
    const { guild } = interaction;
    const embed = new MessageEmbed().setColor(client.colors.main);
    if (!player) {
      embed.setDescription(`Nothing is Playing!`);
      mainMsg.reset();
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const vc = interaction.member.voice?.channel;
    if (vc?.id !== player.voiceChannel) {
      embed.setDescription(`You Need To Join ${guild.channels.cache.get(player.voiceChannel)?.toString() || `Same VC`}!`);
      return await interaction.reply({ embeds: [embed], ephemeral: true }).catch(client.handleError);
    }

    const btn = await interaction.message.components[0].components.find((e) => e.customId === "playpause");
    btn.emoji = player?.paused ? { id: "891360855059492914", name: "pause", animated: undefined } : { id: "891360855009132584", name: "play", animated: undefined };

    const { message } = interaction;
    const { content, components, embeds } = message;

    await interaction.message?.edit({ content, components, embeds }).catch(client.handleError);

    embed.setDescription(`${player.paused ? `Resumed` : `Paused`} the Player!`);

    mainMsg.setFooter({ text: `${player.paused ? `Resumed` : `Paused`} by ${interaction.user.tag}` }).catch(client.handleError);

    setTimeout(async () => {
      mainMsg.setFooter(null).catch(client.handleError);
    }, 10000);
    player.pause(!player.paused);

    await interaction.reply({ embeds: [embed], ephemeral: true }).catch(client.handleError);
  } catch (error) {
    client.handleError(error);
  }
};
