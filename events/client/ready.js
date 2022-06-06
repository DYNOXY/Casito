const { Manager } = require("erela.js");

const Spotify = require("better-erela.js-spotify").default;
const Deezer = require("erela.js-deezer");
const Filter = require("erela.js-filters");
const Facebook = require("erela.js-facebook");
const { Client } = require("discord.js");
const GuildConfig = require("../../models/GuildConfig");
const { LavasfyClient } = require("lavasfy");

/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
  console.log("-".repeat(38).yellow);
  console.log(`[✔] logged in as [${client.user.tag.cyan}${"]".green}`.green);
  console.log("-".repeat(38).yellow);

  client.user.setActivity("/help", { type: "LISTENING", name: "/help" });

  const data = await GuildConfig.find({ GuildID: client.guilds.cache.map((e) => e.id) });

  data.map(async (d) => {
    const guild = client.guilds.cache.get(d.GuildID);
    const channel = guild?.channels.cache.get(d.TextChannel);
    if (guild && channel) {
      const mainMsg = await channel.messages.fetch(d.Message);

      mainMsg.edit({ embeds: [client.defaultEmbed], components: client.defaultComponents, content: client.defaultMessage }).catch(client.handleError);
    }
  });

  const creator = await client.users.fetch("537194359154671616");
  client.madeBy = creator;

  const { clientID, clientSecret } = process.env;

  client.lavasfy = new LavasfyClient(
    {
      clientID,
      clientSecret,
    },
    process.env.private_node,
  );

  client.manager = new Manager({
    nodes: process.env.private_node,
    plugins: [new Deezer(), new Facebook(), new Spotify({ clientID, clientSecret }), new Filter()],
    autoPlay: true,
    secure: false,
    send: (id, payload) => {
      const guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    },
  });

  await client.lavasfy.requestToken();
  client.manager.init(client.user.id);

  client.on("raw", (d) => client.manager.updateVoiceState(d));

  const JoinVC = async () => {
    const guildConfigs = await GuildConfig.find();
    guildConfigs.forEach(async (x) => {
      try {
        const guildID = x.GuildID;
        const channelID = x.VoiceChannel;
        if (!channelID || !guildID) return;
        const guild = client.guilds.cache.get(guildID);
        if (guild) {
          const chnlToJoin = await guild.channels.fetch(channelID).catch(client.handleError);
          if (chnlToJoin) {
            const checkPlayer = client.manager.players.get(guildID);
            if (checkPlayer && !checkPlayer.connected) {
              await checkPlayer.connect();
            } else {
              player = client.manager.create({
                guild: guildID,
                voiceChannel: channelID,
                textChannel: null,
                selfDeafen: true,
              });

              if (!player.connected) await player.connect();
            }
          }
        }
      } catch (err) {
        console.log("failed to Create ->", err);
      }
    });
  };

  let joined = false;
  console.log("-".repeat(38).yellow);
  client.manager.on("nodeConnect", async (node) => {
    console.log(`[✔] Node Connected - [${node.options.identifier.cyan}${"]".green}`.green);

    if (!joined) {
      await JoinVC();
      joined = true;
    }
  });

  client.manager.on("nodeError", (node, error) => {
    console.log(`[NODE] "${node.options.identifier}" An ERROR Occured → ${error.message}`);
  });

  client.manager.on("socketClosed", async (player, payload) => {
    try {
      const guildConfigs = await GuildConfig.findOne({ GuildID: player.guild });
      if (guildConfigs?.TwentyFourSeven) {
        player.twentyFourSeven = guildConfigs?.TwentyFourSeven;
      }
      if (payload.byRemote === true && !player.twentyFourSeven) player.destroy();
    } catch (err) {
      client.handleError(err);
    }
  });

  client.manager.on("playerMove", async (player, currentChannel, newChannel) => {
    const newChnl = await client.channels.fetch(newChannel).catch(client.handleError);
    if (!newChnl) return;
    player.voiceChannel = newChnl?.id;

    setTimeout(() => {
      player.pause(false);
    }, 2000);
  });
};
