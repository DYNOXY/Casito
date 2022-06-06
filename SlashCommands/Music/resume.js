const { Client, Interaction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "resume",
  description: "To Resume Current Track!",
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

      if (!player.paused) {
        embed.setDescription(`Track is Not Paused!`);

        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      }

      player.pause(false);

      embed.setDescription(`Resumed The Track!`);
      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      client.handleError(err);
    }
  },
};
