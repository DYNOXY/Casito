const { Client, Interaction, MessageEmbed } = require("discord.js");
const GuildConfig = require("../../models/GuildConfig");

const v = () => {};

let isDo = true;

module.exports = {
  name: "setup",
  description: "Auto Setup of Bot!",
  type: "CHAT_INPUT",
  botPerms: ["MANAGE_CHANNELS"],
  permissions: ["MANAGE_GUILD", "MANAGE_CHANNELS"],
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  execute: async (client, interaction) => {
    try {
      if (!interaction.isCommand()) return;
      const { guild } = interaction;

      const isAlready = await GuildConfig.findOne({ GuildID: guild.id });
      const embed = new MessageEmbed().setColor(client.colors.main);

      const { loading, check, error, blank } = client.emos;

      if (isAlready) {
        const channel = guild.channels.cache.get(isAlready.TextChannel);
        if (channel) {
          embed.setDescription(`Setup Channel is already Selected for ${channel.toString()}!\n${blank}Delete ${channel.toString()} to use \`setup\` Command again!`);
          return await interaction.editReply({ embeds: [embed] });
        }

        await isAlready.delete();
      }

      embed.setTitle(`Casito Setup!`).setFooter("/help for further information about setup!");

      const strings = {
        frst: `${loading} Checking Things...`,
        frst_2: `${check} Everything Ok!`,
        scnd: `${loading} Setting Up...`,
        scnd_2: `${check} Started Setup!`,
        thrd: `${loading} Creating Text Channel...`,
        thrd_2: `${check} Created **__\`casito_requests\`__** Channel!`,
        ffth: `${loading} Sending Main Message...`,
        ffth_2: `${check} Sent Message in **__\`casito_requests\`__**!`,
        sxth: `${loading} Storing Data...`,
        sxth_2: `${check} Stored Data in DB!`,
        done: `${check} Setup Completed!`,
        failed: `${error} Setup Failed!`,
      };

      const descString = [];

      const setupFailed = async (err) => {
        if (err) {
          console.log(`Failed To Setup:- `.red, err);
        }

        descString.push(strings.failed);
        return await interaction.editReply({ embeds: [embed.setDescription(descString.join("\n"))] }).catch(v);
      };

      const setupChannel = async () => {
        descString.push(strings.thrd_2);
        await interaction.editReply({ embeds: [embed.setDescription(descString.join("\n").concat("\n" + strings.thrd))] }).catch(setupFailed);
        const textChannel = await guild.channels.create(`casito_requests`, {
          type: "GUILD_TEXT",
          topic: `Song Requests For ${client.user.username} Bot!, /help for More Info`,
          reason: `${client.user.username} Setup | Created Text Channel!`,
        });
        if (!textChannel) return setupFailed();

        descString.push(strings.ffth_2);
        await interaction.editReply({ embeds: [embed.setDescription(descString.join("\n").concat("\n" + strings.ffth))] }).catch(setupFailed);

        const defaultMsg = await textChannel.send({ embeds: [client.defaultEmbed], components: client.defaultComponents, content: client.defaultMessage }).catch(setupFailed);
        if (!defaultMsg) return setupFailed();
        if (isDo) descString.push(strings.sxth_2);
        if (isDo) await interaction.editReply({ embeds: [embed.setDescription(descString.join("\n").concat("\n" + strings.sxth))] }).catch(setupFailed);

        const newConfig = new GuildConfig({
          GuildID: guild.id,
          TextChannel: textChannel?.id,
          Message: defaultMsg?.id,
        });
        if (isDo) {
          const resp = await newConfig.save();
          if (!resp) return setupFailed();
        }

        if (isDo) descString.push(strings.done);
        if (isDo) await interaction.editReply({ embeds: [embed.setDescription(descString.join("\n"))] }).catch(setupFailed);
      };

      // descString.push(strings.frst);
      if (isDo) await interaction.editReply({ embeds: [embed.setDescription(descString.join("\n").concat("\n" + strings.frst))] }).catch(setupFailed);
      setTimeout(async () => {
        if (isDo) descString.push(strings.frst_2);
        if (isDo) await interaction.editReply({ embeds: [embed.setDescription(descString.join("\n").concat("\n" + strings.scnd))] }).catch(setupFailed);
        setupChannel();
      }, 600);
    } catch (err) {
      console.log(`Error Occured :`, err);
    }
  },
};
