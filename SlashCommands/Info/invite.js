const { Client, Interaction, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
  name: "invite",
  description: "Invite Links for Bot!",
  type: "CHAT_INPUT",
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  execute: async (client, interaction) => {
    try {
      if (!interaction.isCommand()) return;

      const {supportServer, invite} = process.env.links;

      const row = new MessageActionRow().addComponents(new MessageButton().setURL(invite).setLabel("Invite Me").setStyle("LINK"), new MessageButton().setURL(supportServer).setLabel("Support Server").setStyle("LINK"));
      const inviteEmbed = new MessageEmbed().setColor(client.colors.main).setDescription("Take Your links!");
      await interaction.editReply({ embeds: [inviteEmbed], components: [row] });
    } catch (err) {
      client.handleError(err);
    }
  },
};
