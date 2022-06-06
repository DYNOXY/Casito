const { Interaction, Message, Client, MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
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

    embed.setDescription(`Select The Volume To Set! Within 10 Seconds`);
    const row = (disabled) => {
      return new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("volumeMenu")
          .setPlaceholder(`Select Volume!`)
          .addOptions(
            [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 125, 150, 175, 200].map((e) => {
              return {
                label: e.toString(),
                description: `Set The volume to ${e.toString()}!`,
                value: e.toString(),
              };
            }),
          )
          .setDisabled(disabled),
      );
    };

    const msg = await interaction.reply({ embeds: [embed], components: [row(false)], fetchReply: true }).catch(client.handleError);

    setInterval(async () => {
      await interaction.deleteReply().catch(() => {});
    }, 7500);

    const collector = msg?.createMessageComponentCollector({ time: 10000, filter: (i) => i.user.id === interaction.user.id, componentType: "SELECT_MENU" });

    collector.on("collect", async (intr) => {
      if (intr.isSelectMenu()) {
        const [value] = intr.values;

        if (!player) {
          embed.setDescription(`No Player were Found! Try Playing Some Music **First**!`);
          return await intr.update({ components: [row(true)], embeds: [embed] });
        }

        player.setVolume(parseInt(value));
        mainMsg.setFooterStatus(player);
        embed.setDescription(`Volume Selected for **${player.volume}**`);
        await intr.update({ components: [row(true)], embeds: [embed] });

        setTimeout(async () => {
          await intr.deleteReply().catch(client.handleError);
        }, 3000);
      }
    });
  } catch (error) {
    client.handleError(error);
  }
};
