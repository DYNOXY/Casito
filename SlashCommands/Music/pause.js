const { Client, Interaction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "pause",
  description: "To Pause Current Track!",
  type: "CHAT_INPUT",
  setupChannel: true,
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  execute: async (client, interaction) => {
    try {
      if (!interaction.isCommand()) return;

      const embed = new MessageEmbed().setColor(client.colors.main);

      const player = client.manager.players.get(interaction.guild.id);

      if (!player) {
        embed.setDescription(`Nothing is Playing!`);
        
        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      }
      const vc = interaction.member.voice?.channel;
      if (vc?.id !== player.voiceChannel) {
        embed.setDescription(`You Need To Join ${guild.channels.cache.get(player.voiceChannel)?.toString() || `Same VC`}!`);
        return await interaction.editReply({ embeds: [embed], ephemeral: true }).catch(client.handleError);
      }

      if (player.queue.current.requester?.id !== interaction.user.id && !interaction.member.permissions.has("MANAGE_GUILD")) {
        embed.setDescription(`You Cant Pause this Track!`);

        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      }

      if (player.paused) {
        embed.setDescription(`Track already Paused!`);

        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      }

      player.pause(true);

      embed.setDescription(`Paused The Track!`);
      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      client.handleError(err);
    }
  },
};
