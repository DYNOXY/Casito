const { Client, Interaction, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");

module.exports = {
  name: "help",
  description: "Help for Bot!",
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

      const dirs = [...new Set(client.slashCommands.map((c) => c.directory))];

      const emojis = {
        music: "<:Music:894516473186385990>",
        settings: "<:Settings:894516654912966676>",
        info: "<:Info:894517215913705512>",
      };
      const descriptions = {
        music: "Includes All Music Player Related Commands!",
        settings: "Commands to Configure Bot Settings!",
        info: "Other Usefull Commands!",
      };

      const helpArray = dirs.map((d) => {
        const getCmd = client.slashCommands
          .filter((c) => c.directory === d)
          .map((c) => {
            return {
              name: c.name || "No Name",
              description: c.description || "No Description",
            };
          });
        return {
          name: d,
          commands: getCmd,
          desc: descriptions[d.toLowerCase()],
          emoji: emojis[d.toLowerCase()],
        };
      });

      const { invite, supportServer } = process.env.links;

      const linkButtons = new MessageActionRow().addComponents(new MessageButton().setURL(invite).setLabel("Invite Me!").setStyle("LINK"), new MessageButton().setURL(supportServer).setLabel("Support!").setStyle("LINK"));

      const cmpntCB = (disabled = false) => {
        return new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setPlaceholder(`Select Commands Category!`)
            .setCustomId("categMenu")
            .setDisabled(disabled)
            .addOptions([
              helpArray.map(({ name, emoji, desc }) => {
                return {
                  label: name,
                  description: desc,
                  value: name,
                  emoji,
                };
              }),
            ]),
        );
      };

      // const new

      embed.setTitle(`Casito Help!`).setDescription(`**Bot Setup!**
      **1.** Use \`/setup\` To Start Setup! will take 1-2 seconds
      **2.** Now Edit that Channel To Whatever You Want!
      **3.** Send Song Name in The Channel To Play Music!
      **4.** Enjoy The Music!

      **Warning!**
      Deleting Setup **Channel** / **Message** will Stop The Player\n& will delete Settings Configured like **24/7**!`);
      const mesg = await interaction.editReply({ embeds: [embed], components: [cmpntCB(), linkButtons], fetchReply: true });

      const collector = mesg.createMessageComponentCollector({ time: 60000, filter: (i) => i.user.id === interaction.user.id, componentType: "SELECT_MENU" });

      collector.on("collect", async (i) => {
        const [value] = i.values;

        const categ = helpArray.find((e) => e.name.toLowerCase() === value.toLowerCase());

        embed.fields = [];
        embed.setDescription(`Category: **${categ.name}**`).addFields(
          categ.commands.map(({ name, description }) => {
            return {
              name: `\`${name}\``,
              value: `${description}`,
              inline: true,
            };
          }),
        );
        await i.update({ embeds: [embed] });
      });
    } catch (err) {
      client.handleError(err);
    }
  },
};
