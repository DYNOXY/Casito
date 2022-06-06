const { Client, Interaction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "shuffle",
  description: "Shuffle Current Queue!",
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

      if (!player.queue.length) {
        embed.setDescription(`Queue list is Empty!`);
        return await interaction.editReply({ embeds: [embed], ephemeral: true }).catch(client.handleError);
      } else if (player.queue.length <= 1) {
        embed.setDescription(`Queue list is too Short to be Shuffled!`);
        return await interaction.editReply({ embeds: [embed], ephemeral: true }).catch(client.handleError);
      }

      player.queue.shuffle();

      embed.setDescription(`Shuffled ${player.queue.length} Tracks!`);

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      client.handleError(err);
    }
  },
};
