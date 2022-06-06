const { Message, Client, MessageEmbed, MessageActionRow, MessageButton, ButtonInteraction } = require("discord.js");
const { Player } = require("erela.js");
const MainMsg = require("../Utility/MainMsg");

/**
 *
 * @param {Client} client
 * @param {ButtonInteraction} interaction
 * @param {Player} player
 * @param {MainMsg} mainMsg
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

    const row = new MessageActionRow().addComponents(new MessageButton().setCustomId("loop_queue").setLabel("Queue").setStyle("SUCCESS"), new MessageButton().setCustomId("loop_track").setLabel("Current Track").setStyle("SUCCESS"));

    if (player?.queueRepeat || player?.trackRepeat) {
      row.addComponents(new MessageButton().setCustomId("loop_reset").setLabel("Reset loop").setStyle("DANGER"));
    }

    if (!player?.queueRepeat && !player?.trackRepeat) {
      embed.setDescription(`Specify What You Want To loop!`);
    } else {
      embed.setDescription(`Already looping ${player?.queueRepeat ? "Queue" : player?.trackRepeat ? "Current Track" : ""}! Choose To Change!`);
    }

    const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true }).catch(client.handleError);

    setInterval(async () => {
      await interaction.deleteReply().catch(() => {});
    }, 5000);

    const collector = msg.createMessageComponentCollector({ componentType: "BUTTON" });
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
      if (i.customId === "loop_queue") {
        try {
          player?.setTrackRepeat(false);
          embed.setDescription(`${player?.queueRepeat ? `Disabled Queue loop!` : `looping the Queue!`}`);
          player?.setQueueRepeat(!player?.queueRepeat);
          await interaction.deleteReply();
          mainMsg.setFooterStatus(player);
          return await i.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
          client.handleError(error);
        }
      } else if (i.customId === "loop_track") {
        try {
          player?.setQueueRepeat(false);
          embed.setDescription(`${player?.trackRepeat ? `Disabled Track loop!` : `looping Current Track!`}`);
          player?.setTrackRepeat(!player?.trackRepeat);
          await interaction.deleteReply();
          mainMsg.setFooterStatus(player);
          return await i.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
          client.handleError(error);
        }
      } else if (i.customId === "loop_reset") {
        try {
          player?.setQueueRepeat(false);
          player?.setTrackRepeat(false);
          embed.setDescription(`Disabled ${player?.queueRepeat ? "Queue looping!" : player?.trackRepeat ? "Track looping!" : "loop!"}`);
          await interaction.deleteReply();
          mainMsg.setFooterStatus(player);
          return await i.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
          client.handleError(error);
        }
      }
    });
  } catch (error) {
    client.handleError(error);
  }
};
