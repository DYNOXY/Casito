const { Client, Interaction, MessageEmbed } = require("discord.js");
const { porgressBar } = require("music-progress-bar");

module.exports = {
  name: "nowplaying",
  description: "Information about Current Track!",
  type: "CHAT_INPUT",
  /**
   *
   * @param {Client} client
   * @param {Manager} client.manager
   * @param {Interaction} interaction
   */
  execute: async (client, interaction) => {
    try {
      if (!interaction.isCommand()) return;

      const getDuration = (duration) => {
        let s = Math.floor((duration / 1000 / 60) << 0);
        let m = Math.floor((duration / 1000) % 60);
        return `${s < 10 ? `0${s}` : s}:${m < 10 ? `0${m}` : m}`;
      };

      const embed = new MessageEmbed().setColor(client.colors.main);

      const player = client.manager.players.get(interaction.guildId);

      if (!player) {
        embed.setDescription(`Nothing is Playing!`);
        return await interaction.editReply({ embeds: [embed] });
      }

      const currTrack = player?.queue.current;

      if (!currTrack) {
        embed.setDescription(`No Playing Track found!`);
        return await interaction.editReply({ embeds: [embed] });
      }

      const { supportServer } = process.env.links;

      const bar = porgressBar({ currentPositon: Math.round((player.position / currTrack.duration) * 14), endPositon: 14, width: 14 }, { format: "<bar>" });

      const finalBar = bar.split("🔵");

      finalBar[0] = `[${finalBar[0]}](${supportServer} "Support Server!")`;

      embed
        .setThumbnail(currTrack.displayThumbnail())
        .setTitle("Now Playing!")
        .setDescription(`[${currTrack?.title.slice(0, 44).concat("...")}](${currTrack.uri})`)
        .addField("Progess", finalBar.join("🔵"))
        .addField("Duration", `[${getDuration(player.position)} / ${getDuration(currTrack.duration)}]`);

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.log(`Error Occured :`, err);
    }
  },
};
