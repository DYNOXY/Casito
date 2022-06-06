const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "disconnect",
  aliases: ["dc", "leave"],
  description: "Joins the VC if can!",
  vcOnly: true,
  execute: async (client, message, args, PREFIX) => {
    // default embed
    const embed = new MessageEmbed().setColor(client.colors.success);

    let player = client.manager.players.get(message.guild.id);

    if (!player) {
      player = client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        selfDeafen: true,
      });
      await player.connect();
    }
    const { channel } = message.member.voice;

    if (channel.id !== player.voiceChannel) {
      embed.setColor(client.colors.error).setDescription(`${client.emos.error} | Must Be In Same Voice Channel`);
      return message.channel.send({ embeds: [embed] });
    }

    if (player) {
      player.destroy();
    } else {
      message.member.voice.channel.leave();
    }

    embed.setDescription(`${client.emos.success} | Left **${message.member.voice.channel.name}** Voice channel`);
    return message.channel.send({ embeds: [embed] });
  },
};
