const { Client, Interaction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "disconnect",
  description: "To Disconnect Player to VC!",
  type: "CHAT_INPUT",
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  execute: async (client, interaction) => {
    try {
      if (!interaction.isCommand()) return;

      const embed = new MessageEmbed().setColor(client.colors.main);

      let player = client.manager.players.get(interaction.guild.id);

      const vc = interaction.member.voice?.channel;
      if (vc?.id !== player?.voiceChannel) {
        embed.setDescription(`You Need To Join ${interaction.guild.channels.cache.get(player?.voiceChannel)?.toString() || `Same VC`}!`);
        return await interaction.editReply({ embeds: [embed] });
      }

      const rememberVC = interaction.guild.channels.cache.get(player?.voiceChannel);

      if (player) {
        player.destroy();
      } else {
        await interaction.member.voice?.channel.leave();
      }

      embed.setDescription(`**Disconnected** from ${rememberVC ? rememberVC.toString() : interaction.member.voice?.channel.toString()}`);

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      client.handleError(err);
    }
  },
};
