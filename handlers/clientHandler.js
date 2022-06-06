const { Collection, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = async (client) => {
  client.config = require("../config.json");
  client.commands = new Collection();
  client.slashCommands = new Collection();
  client.btnInteractions = new Collection();
  client.events = new Collection();
  client.functions = require("../Utility/functions");
  client.emos = require("../Utility/emojis");
  client.colors = require("../Utility/colors");
  client.embeds = require("../Utility/embeds");
  client.db = new Collection();
  const { invite } = process.env.links;
  const { banner } = process.env.images;
  client.defaultEmbed = new MessageEmbed().setColor(client.colors.main).setTitle(`Nothing Playing!`).setDescription(`[Invite Me!](${invite}) | [Support!](${process.env.links.supportServer})`).setImage(banner).setFooter(`Send Message To Play Music!`);

  const firstComponent = new MessageActionRow().addComponents(
    new MessageButton().setStyle("SECONDARY").setCustomId("previous").setEmoji("893430397420060703"),
    new MessageButton().setStyle("SECONDARY").setCustomId("playpause").setEmoji("891360855059492914"),
    new MessageButton().setStyle("SECONDARY").setCustomId("skip").setEmoji("893361084214431754"),
    new MessageButton().setStyle("SECONDARY").setCustomId("stop").setEmoji("891360854761672745"),
    new MessageButton().setStyle("SECONDARY").setCustomId("filter").setEmoji("893364676010868766"),
  );

  const secondComponent = new MessageActionRow().addComponents(
    new MessageButton().setStyle("SECONDARY").setCustomId("autoplay").setEmoji("890801528066179133"),
    new MessageButton().setStyle("SECONDARY").setCustomId("loop").setEmoji("891360855210479616"),
    new MessageButton().setStyle("SECONDARY").setCustomId("shuffle").setEmoji("891360855269195846"),
    new MessageButton().setStyle("SECONDARY").setCustomId("volume").setEmoji("891360855499866182"),
    new MessageButton().setStyle("SECONDARY").setCustomId("lyrics").setEmoji("893010067459301418"),
  );
  client.defaultComponents = [firstComponent, secondComponent];
  client.defaultMessage = "**__Queue list :-__**\nEmpty! Send Song Name Here To Play Music!";
  client.handleError = (err) => {
    if (err.toString() === "DiscordAPIError: Unknown Message") return;
    console.log(`[ERROR] An Unexpected Error Occured:\n`.red, err);
  };
  client.cooldown = {
    btnInteractions: {
      stop: 5,
      playpause: 3,
      volume: 5,
      skip: 1,
      previous: 5,
      shuffle: 15,
      lyrics: 10,
      filter: 5,
      autoplay: 10,
      loop: 10,
    },
  };
};
