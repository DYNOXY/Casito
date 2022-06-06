const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "help",
  description: "Gives Some Help to The User!",
  execute: async (client, message, args, PREFIX) => {
    if (args[0]) {
      let command = args[0];
      if (command.startsWith(PREFIX)) {
        command = command.split(PREFIX)[1];
      }
      const cmdInfo = client.commands.get(command);

      if (!cmdInfo) {
        const report = new MessageButton().setStyle("LINK").setURL(process.env.links.supportServer).setLabel("Report");
        const errEmbed = new MessageEmbed().setTitle(`${client.emos.error} Error`).setDescription("No Command Found");

        return message.reply({ embeds: [errEmbed], components: [new MessageActionRow().addComponents(report)] });
      }
      if (!cmdInfo.usage) {
        cmdInfo.usage = "NO DESCRIPTION GIVEN";
      }
      if (!cmdInfo.description) {
        cmdInfo.description = "NO DESCRIPTION GIVEN";
      }
      let permissions = "";
      if (cmdInfo.permission && cmdInfo.permission.length) {
        cmdInfo.permission.forEach((perm) => {
          cmdInfo.permission.length > !1 ? (permissions += `${perm}`) : (permissions += `,${perm}`);
        });
      } else {
        permissions = "No Permission Given";
      }

      const cmdHelpEmbed = new MessageEmbed()
        .setColor("2f3136")
        .setTitle("Command:  `$" + command + "`")
        .addFields(
          {
            name: "Description: ",
            value: cmdInfo.description,
          },
          {
            name: "Usage: ",
            value: cmdInfo.usage,
          },
          {
            name: "Permissions Needed: ",
            value: permissions,
          },
        )
        .setTimestamp(new Date());

      return message.reply({ embeds: [cmdHelpEmbed] }).catch(client.handleError);
    }

    const helpEmbed = new MessageEmbed()
      .setColor(client.colors.main)
      .addField(`${client.user.username} Commands`, `You can play music by joining a voice channel and typing =play. The command accepts song names, video links, playlist links & Spotify links.`)
      .setThumbnail(client.user.displayAvatarURL())
      .addField(`To get **HELP** for a Command use`, `\`\`\`${PREFIX}help <COMMAND>\`\`\``)
      .addFields(
        {
          name: `Music - [17]`,
          value: "`join`, `leave`, `clear`, `loop`, `move`, `nowplaying`, `pause`, `play`, `previous`, `queue`, `remove`, `resume`, `search`, `skip`, `seek`, `stop`, `volume`",
        },
        {
          name: `Filters - [13]`,
          value: "`bass`, `bassboost`, `deepbass`, `nightcore`, `pitch`, `pop`, `reset`, `soft`, `speed`, `vaporwave`",
        },
        {
          name: `Config - [3]`,
          value: "`prefix`, `24/7`, `setchannel`",
        },
        {
          name: `Premium - [2]`,
          value: "`premium`, `validity`",
        },
        {
          name: `Utility - [5]`,
          value: "`help`, `ping`, `invite`, `uptime`, `stats`",
        },
      )
      .setFooter(`Requested By ${message.member.displayName}`, message.author.displayAvatarURL())
      .setTimestamp(new Date());

    // Buttons
    const Invite = new MessageButton().setStyle("LINK").setURL("https://dsc.gg/sensor").setLabel("Invite Me");
    const SupportServer = new MessageButton().setStyle("LINK").setURL(process.env.links.supportServer).setLabel("Support Server");
    const VoteMe = new MessageButton().setStyle("LINK").setURL("https://top.gg/bot/860231247095398400/vote").setLabel("Vote Me");
    const Premium = new MessageButton().setStyle("LINK").setURL(process.env.links.premium).setLabel("Premium");

    const row = new MessageActionRow().addComponents(Invite, SupportServer, VoteMe, Premium);

    message.reply({ embeds: [helpEmbed], components: [row] });
  },
};
