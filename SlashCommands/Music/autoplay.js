const { Client, Interaction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "autoplay",
  description: "Toggle Player Autoplay!",
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

      embed.setDescription(`Autoplay is Not Ready Yet!`);

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      client.handleError(err);
    }
  },
};
