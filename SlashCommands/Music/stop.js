const { Client, Interaction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "stop",
  description: "Stop the Player!",
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

        return await interaction.editReply({ embeds: [embed] });
      }
      const vc = interaction.member.voice?.channel;
      if (vc?.id !== player.voiceChannel) {
        embed.setDescription(`You Need To Join ${interaction.guild.channels.cache.get(player.voiceChannel)?.toString() || `Same VC`}!`);
        return await interaction.editReply({ embeds: [embed] }).catch(client.handleError);
      }
      if (player.queue.current.requester?.id !== interaction.user.id && !interaction.member.permissions.has("MANAGE_GUILD")) {
        embed.setDescription(`You Cant Stop this Queue!`);
        return await interaction.editReply({ embeds: [embed] });
      }

      if (player) player.stop();

      if (player && player.queue) player.queue.clear();

      if (!player.twentyFourSeven) {
        player.destroy();
      }

      embed.setDescription(`Stopped The Music${!player.twentyFourSeven ? ` & Destroyed The Player` : ""} by ${interaction.member.toString()}!`);

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      client.handleError(err);
    }
  },
};
