const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "join",
  aliases: ["j", "jn"],
  description: "Joins the VC if can!",
  vcOnly: true,
  myPerms: ["CONNECT"],
  execute: async (client, message, args, PREFIX) => {
    // default embed
    const embed = new MessageEmbed().setColor(client.colors.success);

    let player = client.manager.players.get(message.guild.id);

    if (!player) {
      try {
        player = client.manager.create({
          guild: message.guild.id,
          voiceChannel: message.member.voice.channel.id,
          textChannel: message.channel.id,
          selfDeafen: true,
        });
        await player.connect();

        embed.setDescription(`${client.emos.success} | Successfully Connected To Your Voice Channel`);
        message.channel.send({ embeds: [embed] });
      } catch (err) {
        console.log(err);
      }
    } else {
      // Move the bot to the new voice channel / update text channel
      try {
        await player.setVoiceChannel(message.member.voice.channel.id);
        await player.setTextChannel(message.channel.id);
        embed.setDescription(`${client.emos.success} | Successfully join your voice channel`);
        message.channel.send({ embeds: [embed] });
      } catch (err) {
        console.log(err);
      }
    }
  },
};
