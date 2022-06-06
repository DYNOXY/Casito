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
    if (!interaction.isButton()) return;

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

    // player.bassboost = true;

    const selectMenuRow = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("filters_menu")
        .setPlaceholder("Choose filter!")
        .addOptions([
          {
            label: "8D",
            value: "eightD",
          },
          {
            label: "Bassboost",
            value: "bassboost",
          },
          {
            label: "Nightcore",
            value: "nightcore",
          },
          {
            label: "pop",
            value: "pop",
          },
          {
            label: "Treblebass",
            value: "treblebass",
          },
          {
            label: "Soft",
            value: "soft",
          },
          {
            label: "Karaoke",
            value: "karaoke",
          },
          {
            label: "Vibrato",
            value: "vibrato",
          },
          {
            label: "Tremolo",
            value: "tremolo",
          },
          {
            label: "Vaporwave",
            value: "vaporwave",
          },
          {
            label: "Reset",
            value: "reset",
          },
        ]),
    );

    embed.setDescription(`Select filters to Enable!`);
    const mesg = await interaction.reply({ embeds: [embed], components: [selectMenuRow], fetchReply: true }).catch(client.handleError);

    setInterval(async () => {
      await interaction.deleteReply().catch(() => {});
    }, 5000);

    const collector = mesg.createMessageComponentCollector();

    const currTime = Date.now();

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) {
        embed.setDescription("You cant use this!");
        return i.reply({ embeds: [embed], ephemeral: true });
      }
      if (Date.now() - 5000 > currTime) {
        embed.setDescription("You took More than 5 Seconds to Respond!");
        await interaction.deleteReply();
        return await i.reply({ embeds: [embed], ephemeral: true });
      }

      if (!player) {
        embed.setDescription(`Nothing is Playing!`);
        mainMsg.reset();
        await interaction.deleteReply();
        return await i.reply({ embeds: [embed], ephemeral: true });
      }
      const vc = i.member.voice?.channel;
      if (vc?.id !== player.voiceChannel) {
        embed.setDescription(`You Need To Join ${i.guild.channels.cache.get(player.voiceChannel)?.toString() || `Same VC`}!`);
        return await i.reply({ embeds: [embed], ephemeral: true });
      }

      if (i.customId === "filters_menu") {
        const [value] = i.values;

        if (value === "reset") {
          player.reset();
          embed.setDescription(`Cleared all filters!`);
          await interaction.deleteReply();
          return await i.reply({ embeds: [embed], ephemeral: true });
        }

        player[value] = true;

        embed.setDescription(`Enabled ${i.component.options.find((e) => e.value === value).label} filter!`);

        await interaction.deleteReply();
        await i.reply({ embeds: [embed], ephemeral: true });
        mainMsg.setFooterStatus(player);
      }
    });
  } catch (error) {
    client.handleError(error);
  }
};
