// const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const autoReconnect = require("../../models/autoReconnect");

module.exports = {
  name: "24/7",
  aliases: ["247"],
  description: "Joins the VC if can!",
  usage: "<ON/OFF>",
  myPerms: ["CONNECT"],
  permissions: ["MANAGE_GUILD"],
  execute: async (client, message, args, PREFIX) => {
    try {
      let player = message.client.manager.players.get(message.guild.id);

      if (!args[0]) {
        const errEmbed = client.embeds.error("Invalid Usage, Missing Arguments `ON/OFF`");
        return message.channel.send({ embeds: [errEmbed] });
      }

      if (!player) {
        player = client.manager.create({
          guild: message.guild.id,
          voiceChannel: message.member.voice.channel.id,
          textChannel: message.channel.id,
          selfDeafen: true,
        });
        await player.connect();
      }

      const isAutoReconnect = await autoReconnect.findOne({
        GuildID: message.guild.id,
      });

      if (isAutoReconnect) {
        const chnl = isAutoReconnect.ChannelID;
        const VC = message.guild.channels.cache.get(chnl); 
        if (!VC) {
          await isAutoReconnect.delete();
          const errEmbed = client.embeds.error(`Looks Like 24/7 VC Deleted`).addField(`${client.emos.disabled} | 24/7 Disabled Now, To Enable`, `\`\`\`24/7 ${this.usage}\`\`\``);
          return message.channel.send({ embeds: [errEmbed] });
        }
        player.twentyFourSeven = true;
      }

      const argu = args[0].toLowerCase();

      if (argu === "on") {
        if (player.twentyFourSeven) {
          const errEmbed = client.embeds.error("24/7 Already Enabled");
          return message.channel.send({ embeds: [errEmbed] });
        }

        // saving channel id to DB
        const newAutoReconnect = new autoReconnect({
          ChannelID: player.voiceChannel,
          TextChannelID: message.channel.id,
          GuildID: message.guild.id,
        });
        await newAutoReconnect.save();

        player.twentyFourSeven = true;
        const embed = client.embeds.enabled("24/7 Is Now Enabled");
        return message.channel.send({ embeds: [embed] });
      } else if (argu === "off") {
        if (!player.twentyFourSeven) {
          const errEmbed = client.embeds.error("24/7 is Not Enabled");
          return message.channel.send({ embeds: [errEmbed] });
        }

        player.twentyFourSeven = false;

        await autoReconnect.findOneAndDelete({
          GuildID: message.guild.id,
        });

        const embed = client.embeds.disabled("24/7 Is Now Disabled");
        return message.channel.send({ embeds: [embed] });
      } else {
        const errEmbed = client.embeds.error("Arguments Must Be `ON` or `OFF`");
        return message.channel.send({ embeds: [errEmbed] });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
