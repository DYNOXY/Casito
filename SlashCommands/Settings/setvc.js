const { Client, Interaction, MessageEmbed } = require("discord.js");
const GuildConfig = require("../../models/GuildConfig");

module.exports = {
  name: "setvc",
  description: "Set Voice Channel to Auto Reconnect",
  type: "CHAT_INPUT",
  options: [
    {
      name: "channel",
      description: "Voice Channel to Set",
      type: 7,
      required: true,
    },
  ],
  permissions: ["MANAGE_GUILD"],
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  execute: async (client, interaction) => {
    try {
      if (!interaction.isCommand()) return;

      const channel = interaction.options.getChannel("channel");

      const embed = new MessageEmbed().setColor(client.colors.main);

      if (channel.type !== "GUILD_STAGE_VOICE" || channel.type !== "GUILD_VOICE") {
        embed.setDescription(`Channel must be a Voice/Stage Channel`);
        return await interaction.editReply({ embeds: [embed] });
      }

      let player = client.manager.players.get(interaction.guild.id);

      if (!player) {
        player = client.manager.create({
          guild: interaction.guild.id,
          voiceChannel: embed.id,
          textChannel: interaction.channel.id,
          selfDeafen: true,
        });
        await player.connect();
      }
      player.setVoiceChannel(channel.id);
      player.connect();

      await GuildConfig.findOneAndUpdate({ GuildID: interaction.guildId }, { VoiceChannel: channel.id }, { upsert: true });
      embed.setDescription(`Selected ${channel.toString()} for Auto Reconnect!`);
      return await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      client.handleError(err)
    }
  },
};
