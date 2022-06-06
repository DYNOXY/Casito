const { Client } = require("discord.js");
require("colors");

const handle = (err) => {
  const errName = `${err}`;
  if (errName !== "DiscordAPIError: Missing Access") {
    console.log("[×] Failed to Register Slash Command,\n".red, err);
  }
};

/**
 *
 * @param {Client} client
 * @param {String} guildId
 */
module.exports = async (client, slashCommandsArr, guildId, command) => {
  try {
    if (guildId) {
      const guild = await client.guilds.fetch(guildId);
      if (!guild) {
        return console.log("[×] Invalid Guild ID".red);
      }
      await guild?.commands.set(slashCommandsArr).catch(handle);
      console.log(`${"[✔] Registered ".green}${slashCommandsArr?.length}${" Commands in ".green}${guild.name.cyan}`);

      return;
    }
    if (command) {
      const cmd = slashCommandsArr.find((e) => e.name === command);
      if (!cmd) {
        return console.log("[×] {".red + command.cyan + "} Command Not Found.".red);
      }
      client.guilds.cache.forEach(async (guild) => {
        await guild?.commands.create(cmd).catch(handle);
        console.log(`${"[✔] Registered ".green}${cmd.name.cyan}${" Command in ".green}${guild.name.cyan}`);
      });
      return;
    }
    client.guilds.cache.forEach(async (guild) => {
      await guild?.commands.set(slashCommandsArr).catch(handle);
      console.log(`${"[✔] Registered ".green}${slashCommandsArr?.length}${" Commands in ".green}${guild.name.cyan}`);
    });
  } catch (err) {
    handle(err);
  }
};
