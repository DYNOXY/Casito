const { Client, Interaction, MessageEmbed } = require("discord.js");
const GuildConfig = require("../../models/GuildConfig");

module.exports = {
  name: "join",
  description: "To Connect Player to VC!",
  type: "CHAT_INPUT",
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  execute: async (client, interaction) => {
    try {
      if (!interaction.isCommand()) return;

      const guildConfigs = await GuildConfig.findOne({ GuildID: interaction.guildId });

      const embed = new MessageEmbed().setColor(client.colors.main);

      let player = client.manager.players.get(interaction.guild.id);

      if (!interaction.member.voice?.channel) {
        embed.setDescription(`You Need to Join VC!`);
        return await interaction.editReply({ embeds: [embed] });
      }

      if (!player) {
        player = client.manager.create({
          guild: interaction.guild.id,
          voiceChannel: interaction.member.voice?.channel.id,
          textChannel: interaction.channel.id,
          selfDeafen: true,
        });

        await player.connect();
      } else {
        await player.setVoiceChannel(interaction.member.voice?.channel.id);
        await player.setTextChannel(interaction.channel.id);

        await player.connect();
      }

      if (guildConfigs?.TwentyFourSeven) {
        player.twentyFourSeven = guildConfigs?.TwentyFourSeven;
      }
      const channel = interaction.guild.channels.cache.get(interaction.member.voice?.channel.id);

      embed.setDescription(`**Connected** to ${channel?.toString()}`);
      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      client.handleError(err);
    }
  },
};
