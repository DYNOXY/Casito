const { MessageEmbed, Client, Guild } = require("discord.js");
/**
 *
 * @param {Client} client
 * @param {Guild} guild
 * @returns
 */

module.exports = async (client, guild) => {
  try {
    if (guild.memberCount < 50 && !guild.id === "889692556059873390") {
      await guild.leave();
    }

    const channels = await guild.channels.fetch();

    let dodis = false;
    channels.map(async (e) => {
      if (!dodis) {
        if (e.permissionsFor(guild.me).toArray().includes("SEND_MESSAGES") && e.isText()) {
          const embed = new MessageEmbed().setColor(client.colors.main);
          embed.setDescription(`Thank you for inviting me!

          To get started, join a voice channel and **/play** a song.
          If you prefer to have a unique songrequest channel use **/setup**
          
          If you need support feel free to join the Support Server. [Support Server](https://discord.gg/Tk98DSsXyz) 
          
          **Want more Casitos ?**
          Casito 1 - [Click Here](https://discord.com/api/oauth2/authorize?client_id=889558751546327100&permissions=7696208&scope=bot%20applications.commands)
          Casito 2 - [Click Here](https://discord.com/api/oauth2/authorize?client_id=889809522439385098&permissions=7696208&scope=bot%20applications.commands)
          Casito 3 - [Click Here](https://discord.com/api/oauth2/authorize?client_id=889809753964941332&permissions=7696208&scope=bot%20applications.commands)`);
          try {
            await e.send({ embeds: [embed] });
          } catch {}
          dodis = true;
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
};
