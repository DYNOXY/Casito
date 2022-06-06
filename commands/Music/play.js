const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const autoReconnect = require("../../models/autoReconnect");

module.exports = {
  name: "play",
  aliases: ["p"],
  description: "Plays the Music",
  usage: "<Song NAME>",
  vcOnly: true,
  myPerms: ["CONNECT", "SPEAK"],
  execute: async (client, message, args, PREFIX) => {
    try {
      let { channel } = message.member.voice;
      let play = message.client.manager.players.get(message.guild.id);

      const prefix = client.config.dPrefix;

      if (!args.length) {
        let embed = new MessageEmbed().setColor(client.colors.error).setTitle("No Song Specified").setDescription(`To play a song Try \`\`\`${prefix}play [Your Song Name]\`\`\``);
        return await message.channel.send({ embeds: [embed] });
      }

      const isAutoReconnect = await autoReconnect.findOne({
        GuildID: message.guild.id,
      });

      if (!play) {
        play = message.client.manager.create({
          guild: message.guild.id,
          voiceChannel: channel.id,
          textChannel: message.channel.id,
          selfDeafen: true,
        });
        if (isAutoReconnect) {
          play.twentyFourSeven = true;
        }

        if (!channel.joinable) {
          let embed = client.embeds.error("Unable To Join VC");
          return message.channel.send({ embeds: [embed] });
        }

        play.connect();
      } else {
        if (isAutoReconnect) {
          play.twentyFourSeven = true;
        }
      }

      const player = message.client.manager.players.get(message.guild.id);
      if (channel.id !== player.voiceChannel) {
        let embed = client.embeds.error("Must Join the Same VC");
        return message.channel.send({ embeds: [embed] });
      }

      const search = args.join(" ");
      let res;

      embed = new MessageEmbed().setColor(client.colors.main).setDescription(`${client.emos.search} Searching...`);
      let searchMsg = await message.channel.send({ embeds: [embed] });

      try {
        res = await player.search(search, message.author);
        if (res.loadType === "LOAD_FAILED") {
          if (!player.queue.current) player.destroy();
          throw new Error(res.exception.message);
        }
      } catch (err) {
        let embed = client.embeds.error(`Unable to Find Song - [\`${search}\`]`);
        return message.channel.send({ embeds: [embed] });
      }

      switch (res.loadType) {
        case "NO_MATCHES":
          await searchMsg.delete();
          if (!player.twentyFourSeven) {
            if (!player.queue.current) player.destroy();
          }
          let embed = client.embeds.error(`Unable to Find Song - [\`${search}\`]`);
          return message.channel.send({ embeds: [embed] });

        case "TRACK_LOADED":
          await searchMsg.delete();
          await player.queue.add(res.tracks[0]);
          if (!player.playing && !player.paused && !player.queue.length) player.play();
          let embed2 = new MessageEmbed().setColor(client.colors.main).setTitle(`Queued`).setDescription(`[${res.tracks[0].title}](${res.tracks[0].uri})`);
          if (player.queue.length >= 1)
            //await delay(4900)
            message.channel.send({ embeds: [embed2] });
          return;

        case "PLAYLIST_LOADED":
          await searchMsg.delete();
          await player.queue.add(res.tracks);
          if (!player.playing && !player.paused && player.queue.size + 1 === res.tracks.length) player.play();
          let embed3 = new MessageEmbed().setColor(client.colors.main).setTitle(`Queued`).setDescription(`**${res.playlist.name}** \`[${res.tracks.length} Songs]\``);
          if (player.queue.length >= res.tracks.length)
            //  await delay(4900)
            message.channel.send({ embeds: [embed3] });
          return;

        case "SEARCH_RESULT":
          await searchMsg.delete();
          await player.queue.add(res.tracks[0]);
          if (!player.playing && !player.paused && !player.queue.length) player.play();
          let embed4 = new MessageEmbed().setColor(client.colors.main).setTitle(`Queued`).setDescription(`[${res.tracks[0].title}](${res.tracks[0].uri})`);
          if (player.queue.length >= 1)
            //await delay(4900)
            message.channel.send({ embeds: [embed4] });
          return;
      }
    } catch (err) {
      console.log(err);
    }
  },
};
