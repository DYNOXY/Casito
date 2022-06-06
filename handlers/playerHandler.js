const { Client, MessageEmbed, GuildMember, Message, Collection, MessageOptions } = require("discord.js");
const { Player, TrackUtils, Track } = require("erela.js");
const GuildConfig = require("../models/GuildConfig");
const MainMsg = require("../Utility/MainMsg");
const { getQueue } = require("../Utility/functions");
const prettyMilliseconds = require("pretty-ms");
const cooldown = new Collection();

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  const embed = new MessageEmbed().setColor(client.colors.main);

  const btnCooldowns = client.cooldown.btnInteractions;

  /**
   *
   * @param {Player} player
   * @param {String} music
   * @param {GuildMember} member
   * @param {Function<MessageOptions>} respond
   * @param {Message} message
   */
  client.playMusic = async (player, music, member, respond, message) => {
    try {
      const guildConfigs = await GuildConfig.findOne({ GuildID: member.guild.id });

      if (guildConfigs?.TwentyFourSeven) {
        player.twentyFourSeven = guildConfigs?.TwentyFourSeven;
      }

      const mainMsg = new MainMsg(message, client);

      let { channel } = member.voice;

      if (!channel) {
        embed.setDescription("Must Join a Voice Channel!");
        return respond({ embeds: [embed] }).catch(client.handleError);
      }

      if (player.state !== "CONNECTED") player.connect();

      const res = await player.search(music, member.user);

      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current && !player.twentyFourSeven) player.destroy();
        embed.setDescription(`Unable to Find Song: **${res.exception.message}**`);
        return respond({ embeds: [embed] }).catch(client.handleError);
      }

      client.manager.on(
        "trackStart",
        /**
         *
         * @param {Player} player
         * @param {Track} track
         */
        async (player, track) => {
          const { current } = player.queue;

          let min = Math.floor((track.duration / 1000 / 60) << 0),
            sec = Math.floor((track.duration / 1000) % 60);

          const { banner } = process.env.images;

          mainMsg
            .setEmbed(
              new MessageEmbed()
                .setDescription(`**[${track.title}](${track.uri})** [${min}:${sec < 10 ? `0${sec}` : sec}]\n${client.defaultEmbed?.description}`)
                .setImage(banner)
                .setColor(client.colors.main)
                .setFooter(mainMsg.getFooterStatus(player)),
              `**__Queue list :-__**\n${getQueue(player.queue)}`,
            )
            .catch(client.handleError);
        },
      );

      const lt = (e) => e === res.loadType;

      if (lt("NO_MATCHES")) {
        if (!player.queue.current && !player.twentyFourSeven) player.destroy();
        embed.setDescription(`Unable to Find Song: **${music}**`);
        return respond({ embeds: [embed] }).catch(client.handleError);
      } else if (lt("TRACK_LOADED")) {
        console.log(res.tracks[0]);
        player.queue.add(res.tracks[0]);
        mainMsg.setContent(`**__Queue list :-__**\n${getQueue(player.queue)}`).catch(client.handleError);
        if (!player.playing && !player.paused && !player.queue.length) {
          player.play();
        }
      } else if (lt("PLAYLIST_LOADED")) {
        player.queue.add(res.tracks);
        mainMsg.setContent(`**__Queue list :-__**\n${getQueue(player.queue)}`).catch(client.handleError);
        if (!player.playing && !player.paused && player.queue.size + 1 === res.tracks.length) {
          return player.play();
        }
      } else if (lt("SEARCH_RESULT")) {
        player.queue.add(res.tracks[0]);
        mainMsg.setContent(`**__Queue list :-__**\n${getQueue(player.queue)}`).catch(client.handleError);
        if (!player.playing && !player.paused && !player.queue.length) {
          player.play();
        }
      }

      client.manager.on("queueEnd", async () => {
        mainMsg.reset();
      });

      client.manager.on("playerDestroy", async () => {
        mainMsg.reset();
      });
    } catch (err) {
      client.handleError(err);
    }
  };

  client.buttonHandler = async (interaction) => {
    try {
      if (interaction.isButton()) {
        const { message, guild } = interaction;

        const mainMsg = new MainMsg(message, client);

        const guildConfigs = await GuildConfig.findOne({ GuildID: guild.id });

        if (guildConfigs) {
          if (interaction.message.id === guildConfigs.Message) {
            const player = await client.manager.players.get(guild.id);

            if (!cooldown.get(guild.id)) cooldown.set(guild.id, []);
            const cooldown_presv = cooldown.get(guild.id);
            try {
              const tryFind = cooldown_presv.find((e) => e.cmd === interaction?.customId);
              let cooldownTiming = btnCooldowns[interaction?.customId] * 1000;
              const checkTimeCond = tryFind?.time + cooldownTiming > Date.now();
              if (tryFind) {
                if (checkTimeCond) {
                  embed.setDescription(`This Button is at Cooldown for **${prettyMilliseconds(tryFind?.time + cooldownTiming - Date.now())}**`);
                  return await interaction.reply({ embeds: [embed], ephemeral: true });
                } else {
                  cooldown.set(
                    guild.id,
                    cooldown_presv.filter((e) => e.cmd !== interaction?.customId),
                  );
                }
              }

              if (btnCooldowns[interaction?.customId]) {
                cooldown_presv.push({
                  cmd: interaction?.customId,
                  time: Date.now(),
                });
              }

              const btnIntr = require(`../btnInteractions/${interaction?.customId}.js`);
              if (btnIntr) await btnIntr(client, interaction, player, mainMsg);
            } catch (err) {
              client.handleError(err);
            }
          }
        }
      }
    } catch (err) {
      client.handleError(err);
    }
  };
};
