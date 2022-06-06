const { MessageEmbed, Client, Interaction } = require("discord.js");
const GuildConfig = require("../../models/GuildConfig");

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 * @returns
 */
module.exports = async (client, interaction) => {
  try {
    const embed = new MessageEmbed().setColor(client.colors.main);
    const { guild } = interaction;
    const { OWNERS } = process.env;

    if (interaction.isCommand()) {
      const cmd = client.slashCommands.get(interaction.commandName);

      if (!cmd) return;

      if (cmd.underDevelopment && !OWNERS.includes(interaction.user.id)) {
        embed.setDescription(`**OOPS**, Command Under Development.`);

        return await interaction.reply({ embeds: [embed], ephemeral: true });
      }

      await interaction.deferReply().catch(console.error);

      if (!interaction.channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
        return await interaction.user.send({ content: "Hey! I Need You Forgot to Give Me `EMBED_LINKS` Permissions!" });
      }
      if (!interaction.channel.permissionsFor(guild.me).has("EMBED_LINKS")) {
        return await interaction.editReply({ content: "Hey! I Need `EMBED_LINKS` Permissions!" });
      }

      if (!OWNERS.includes(interaction.user.id) && !interaction.member.permissions.has(cmd.permissions || []) && cmd.permissions) {
        embed.setDescription(`**You Dont Have ${cmd.permissions.length <= 1 ? "This" : "These"} Permission${cmd.permissions.length <= 1 ? "" : "s"}**\n\`\`\`${cmd.permissions.join(", ")}\`\`\``);

        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      }

      if (!guild.me.permissions.has(cmd.botPerms || [])) {
        const l = cmd.botPerms.length;

        embed.setDescription(`**I Need ${l <= 1 ? "This" : "These"} Permission${l <= 1 ? "" : "s"}**\n\`\`\`${cmd.botPerms.join(", ")}\`\`\``);

        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      }

      const guildConfigs = await GuildConfig.findOne({ GuildID: guild.id });

      const setupChannel = guild.channels.cache.get(guildConfigs?.TextChannel);
      if (setupChannel && cmd.setupChannel) {
        embed.setDescription(`You need to Use Setup Channel System to use This Feature/Command!`);

        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      } else {
        cmd.execute(client, interaction);
      }
    } else if (interaction.isButton()) {
      client.buttonHandler(interaction);
    }
  } catch (err) {
    console.log(err);
  }
};
