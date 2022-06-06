const { Client, Interaction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { Queue, Track } = require("erela.js");

module.exports = {
  name: "queue",
  description: "Current Queue list!",
  type: "CHAT_INPUT",
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  execute: async (client, interaction) => {
    try {
      if (!interaction.isCommand()) return;

      const embed = new MessageEmbed().setColor(client.colors.main);

      const getDuration = (track) => `${Math.floor((track.duration / 1000 / 60) << 0)}:${Math.floor((track.duration / 1000) % 60)}`;

      /**
       *
       * @param {Queue} queue_list
       * @returns {String}
       */
      const getQueue = (queue_list, skipp = 0) => {
        let queue_str = [];

        const currTrack = queue_list.current;

        let i = 1;
        queue_list.map((track) => {
          queue_str.push(`**${i}.** ${track.title} [${getDuration(track)}] - ${track.requester.tag}`);

          i++;
        });

        const final = queue_str.slice(skipp).slice(0, 15);

        final.unshift(`__**Current Track**__:\n**◉** ${currTrack.title} [${getDuration(currTrack)}] - ${currTrack.requester.tag}\n`);
        if (player.queue?.length > 15) {
          final.push(`**${16} ... ${player.queue?.length}**`);
        }

        return final.join("\n");
      };

      const player = client.manager.players.get(interaction.guild.id);

      if (!player) {
        embed.setDescription(`Nothing is Playing!`);

        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      }

      if (!player.queue?.length) {
        embed.setDescription(`Queue list is Empty!`);

        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      }

      embed.setTitle(`Current Queue list`).setDescription(getQueue(player.queue));

      return await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      client.handleError(err);
    }
  },
};
