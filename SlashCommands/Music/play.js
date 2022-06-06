const { Client, Interaction, MessageEmbed } = require("discord.js");
const autoReconnect = require("../../models/autoReconnect");

module.exports = {
  name: "play",
  description: "Plays The Music",
  type: "CHAT_INPUT",
  options: [
    {
      name: "song",
      description: "Song Name to Play",
      type: 3,
      required: true,
    },
  ],
  setupChannel: true,
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  execute: async (client, interaction) => {
    try {
      if (!interaction.isCommand()) return;

      const song = interaction.options.getString("song");

      let { channel } = interaction.member.voice;
      let play = interaction.client.manager.players.get(interaction.guild.id);

      const embed = new MessageEmbed().setColor(client.colors.main);

      const isAutoReconnect = await autoReconnect.findOne({
        GuildID: interaction.guild.id,
      });

      if (!play) {
        play = interaction.client.manager.create({
          guild: interaction.guild.id,
          voiceChannel: channel.id,
          textChannel: interaction.channel.id,
          selfDeafen: true,
        });
        if (isAutoReconnect) {
          play.twentyFourSeven = true;
        }

        if (!channel.joinable) {
          let embed = client.embeds.error("Unable To Join VC");
          return await interaction.editReply({ embeds: [embed] }).catch(() => {});
        }

        play.connect();

        if (channel.guild.me.voice?.channel?.type === "GUILD_STAGE_VOICE") {
          embed.setDescription(`Casito Does not Supports Stage Yet!`);
          return respond({ embeds: [embed] }).catch(client.handleError);
        }
      } else {
        if (isAutoReconnect) {
          play.twentyFourSeven = true;
        }
      }

      const player = interaction.client.manager.players.get(interaction.guild.id);
      if (channel.id !== player.voiceChannel) {
        let embed = client.embeds.error("Must Join the Same VC");
        return await interaction.editReply({ embeds: [embed] }).catch(() => {});
      }

      const search = song;
      let res;

      embed.setDescription(`${client.emos.loading} Searching...`);
      await interaction.editReply({ embeds: [embed], fetchReply: true }).catch(() => {});

      try {
        res = await player.search(search, interaction.user);
        if (res.loadType === "LOAD_FAILED") {
          if (!player.queue.current && !player.twentyFourSeven) player.destroy();

          throw new Error(res.exception.message);
        }
      } catch (err) {
        let embed = client.embeds.error(`Unable to Find Song - [\`${search}\`]`);
        return await interaction.editReply({ embeds: [embed] }).catch(() => {});
      }

      client.manager.on("trackStart", async (player, track) => {
        let min = Math.floor((track.duration / 1000 / 60) << 0),
          sec = Math.floor((track.duration / 1000) % 60);

        let np = new MessageEmbed()
          .setColor(client.colors.main)
          .setThumbnail(player.queue.current.identifier ? `https://img.youtube.com/vi/${player.queue.current.identifier}/hqdefault.jpg` : `https://media.discordapp.net/attachments/893107937365594122/893470434203410492/istockphoto-1279654034-170667a.jpg`)
          .setTitle(track.title)
          .setURL(track.uri)
          .setDescription(`Duration - **${min}:${sec < 10 ? `0${sec}` : sec}**\n\nRequested By ${track.requester.toString()}`);
        // .setFooter(``);
        await interaction.editReply({ embeds: [np], content: `**Search Result for** ${search}` }).catch((e) => {});
        setTimeout(async () => {
          await interaction.deleteReply().catch(() => {});
        }, track.duration);
      });

      switch (res.loadType) {
        case "NO_MATCHES":
          if (!player.queue.current && !player.twentyFourSeven) player.destroy();
          let embed = client.embeds.error(`Unable to Find Song - [\`${search}\`]`);
          return await interaction.editReply({ embeds: [embed] });

        case "TRACK_LOADED":
          await player.queue.add(res.tracks[0]);
          if (!player.playing && !player.paused && !player.queue.length) player.play();
          let embed2 = new MessageEmbed().setColor(client.colors.main).setTitle(`Queued`).setDescription(`[${res.tracks[0].title}](${res.tracks[0].uri})`);
          if (player.queue.length >= 1)
            //await delay(4900)
            await interaction.editReply({ embeds: [embed2] }).catch(() => {});
          return;

        case "PLAYLIST_LOADED":
          await player.queue.add(res.tracks);
          if (!player.playing && !player.paused && player.queue.size + 1 === res.tracks.length) player.play();
          let embed3 = new MessageEmbed().setColor(client.colors.main).setTitle(`Queued`).setDescription(`**${res.playlist.name}** \`[${res.tracks.length} Songs]\``);
          if (player.queue.length >= res.tracks.length)
            //  await delay(4900)
            await interaction.editReply({ embeds: [embed3] }).catch(() => {});
          return;

        case "SEARCH_RESULT":
          await player.queue.add(res.tracks[0]);
          if (!player.playing && !player.paused && !player.queue.length) player.play();
          let embed4 = new MessageEmbed().setColor(client.colors.main).setTitle(`Queued`).setDescription(`[${res.tracks[0].title}](${res.tracks[0].uri})`);
          if (player.queue.length >= 1)
            //await delay(4900)
            await interaction.editReply({ embeds: [embed4] }).catch(() => {});
          return;
      }
    } catch (err) {
      console.log(`Error Occured :`, err);
    }
  },
};
