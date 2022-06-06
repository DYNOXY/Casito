const { MessageEmbed, MessageActionRow, MessageButton, Client, Message, MessageOptions } = require("discord.js");
const GuildConfig = require("../../models/GuildConfig");
// models

const vd = (e) => {};

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @returns
 */
module.exports = async (client, message) => {
  try {
    if (!client.application?.owner) await client.application?.fetch();

    const embed = new MessageEmbed().setColor(client.colors.main); // message.edit({embeds})

    const { guild } = message;
    const guildConfigs = await GuildConfig.findOne({ GuildID: guild.id });

    if (guildConfigs) {
      const setupChannel = guild.channels.cache.get(guildConfigs.TextChannel);

      if (setupChannel && setupChannel.id === message.channelId) {
        if (message.author.id === client.user.id) return;

        await message.delete().catch(client.handleError);

        /**
         *
         * @param {MessageOptions} data
         */
        const handleResponse = async (data) => {
          const m = await setupChannel.send(data);
          setTimeout(() => m.delete().catch(vd), 2500);
        };

        let { channel } = message.member.voice;

        if (!channel) {
          embed.setDescription("Must Join a Voice Channel!");
          return handleResponse({ embeds: [embed] }).catch(client.handleError);
        }

        let mainMsg = await setupChannel.messages.fetch(guildConfigs.Message).catch(client.handleError);

        let player = client.manager.players.get(message.guildId);

        if (!player) {
          player = client.manager.create({
            guild: message.guildId,
            voiceChannel: channel.id,
            selfDeafen: true,
            mainMessage: mainMsg,
          });
        }

        if (channel.id !== player?.voiceChannel) {
          const myVC = await message.guild.channels.fetch(player?.voiceChannel).catch(client.handleError);
          embed.setDescription(`You Need To Join ${myVC?.toString()}!`);
          return handleResponse({ embeds: [embed] }).catch(client.handleError);
        }

        if (!channel.joinable) {
          embed.setDescription(`Unable To Join ${channel.toString()}`);
          return handleResponse({ embeds: [embed] }).catch(client.handleError);
        }

        if (!mainMsg) {
          mainMsg = await message.channel.send({ embeds: [client.defaultEmbed], components: client.defaultComponents });
          await GuildConfig.findOneAndUpdate({ GuildID: guild.id }, { Message: mainMsg.id });

          const questionEmbed = new MessageEmbed().setColor(client.colors.main).setDescription(`:rolling_eyes: looks like Main Message was Deleted!\nEmbed Was Regenerated But You Wanna Play the Music?`).addField("Query!", message.content);
          const row = new MessageActionRow().addComponents(new MessageButton().setCustomId("yes").setStyle("SUCCESS").setLabel("Yes"), new MessageButton().setCustomId("no").setStyle("DANGER").setLabel("No"));

          const resMsg = await message.channel.send({ embeds: [questionEmbed], components: [row] });

          const delMsg = setTimeout(async () => await resMsg.delete().catch(() => {}), 60000);

          const filter = (i) => i.user.id === message.author.id;
          const collector = resMsg.createMessageComponentCollector({ filter, time: 60000, componentType: "BUTTON" });

          const msgs = await channel.messages.fetch();

          msgs
            .filter((m) => m.id !== mainMsg.id)
            .filter((e) => e.id !== resMsg.id)
            .map(async (m) => await m.delete().catch(() => {}));

          collector.on("collect", async (intr) => {
            clearTimeout(delMsg);
            if (intr.customId === "yes") {
              c;
              client.playMusic(player, message.content, message.member, handleResponse, mainMsg);
              await resMsg.delete().catch(client.handleError);
            } else if (intr.customId === "no") {
              await resMsg.delete().catch(client.handleError);
            }
          });

          return;
        }

        await client.playMusic(player, message.content, message.member, handleResponse, mainMsg).catch(client.handleError);

        await message.delete().catch(() => {});
        const msgs = await setupChannel.messages.fetch().catch(client.handleError);

        msgs.map(async (msg) => {
          if (msg.id !== mainMsg.id) await msg.delete().catch(() => {});
        });
      }
    }

    const prefix = process.env.PREFIX;

    if (!message.content.startsWith(prefix)) return;
    if (message.author.id !== client.application?.owner.id) return;

    const args = message.content.slice(prefix.length).split(/[ ]+/);
    const userCmd = args.shift().toLowerCase();

    if (userCmd === "eval") {
      await client.commands.get("eval").execute(client, message, args);
    }
  } catch (err) {
    console.log(err);
  }
};
