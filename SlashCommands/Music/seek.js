const { Client, Interaction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "seek",
  description: "Seek current Track!",
  type: "CHAT_INPUT",
  options: [
    {
      name: "duration",
      description: "Seconds to Seed from Current Track",
      type: 4,
      required: true,
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  execute: async (client, interaction) => {
    try {
      if (!interaction.isCommand()) return;

      const duration = interaction.options.getInteger("duration");

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
        embed.setDescription(`You Cant Seek this Track!`);
        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      }

      const seekDuration = duration * 1000;

      if (player.position + seekDuration > player.queue.current.duration) {
        embed.setDescription(`You Cant Seek the Track More than its length!`);
        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      }

      player.seek(player.position + seekDuration);

      embed.setDescription(`Seeked ${duration} Seconds from Current Track!`);

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      client.handleError(err);
    }
  },
};
