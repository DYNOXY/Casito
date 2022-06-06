const { Client, Interaction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Ping of Bot",
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
      const msg = await interaction.editReply({ content: "Pinging...", fetchReply: true });

      embed.setDescription(`Websocket : **${Math.round(client.ws.ping)}ms**\nBot : **${msg.createdTimestamp - interaction.createdTimestamp}ms**`);
      await interaction.editReply({ content: "Pong!", embeds: [embed] });
    } catch (err) {
      client.handleError(err);
    }
  },
};
