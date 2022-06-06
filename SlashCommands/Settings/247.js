const { Client, Interaction, MessageEmbed } = require("discord.js");
const GuildConfig = require("../../models/GuildConfig");

module.exports = {
  name: "247",
  description: "Enable / Disable 24/7 VC!",
  type: "CHAT_INPUT",
  permissions: ["MANAGE_GUILD"],
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  execute: async (client, interaction) => {
    try {
      if (!interaction.isCommand()) return;

      let player = client.manager.players.get(interaction.guild.id);

      if (!player) {
        player = client.manager.create({
          guild: interaction.guild.id,
          voiceChannel: interaction.member.voice?.channel.id,
          textChannel: interaction.channel.id,
          selfDeafen: true,
        });
        await player.connect();
      }

      const playerVc = await interaction.guild.channels.fetch(player?.voiceChannel).catch(client.handleError);

      const embed = new MessageEmbed().setColor(client.colors.main);

      const config = await GuildConfig.findOne({ GuildID: interaction.guildId });

      const cond = config?.TwentyFourSeven ? !config?.TwentyFourSeven : true;

      player.twentyFourSeven = !player.twentyFourSeven;

      await GuildConfig.findOneAndUpdate({ GuildID: interaction.guildId }, { TwentyFourSeven: cond, VoiceChannel: !cond ? null : playerVc?.id }, { upsert: true });

      embed.setDescription(`**${cond ? `Enabled` : `Disabled`}** 24/7${cond ? ` & Selected ${playerVc.toString()} for Auto Reconnect!` : ``}`);
      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      client.handleError(err);
    }
  },
};