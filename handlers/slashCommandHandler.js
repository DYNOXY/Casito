const fs = require("fs");
const registerSlash = require("../Utility/registerSlash");

module.exports = async (client) => {
  const cmdFolders = fs.readdirSync("./SlashCommands");

  console.log("-".repeat(38).yellow);
  console.log(`[●] Loading Slash Commands...\n`.magenta);
  const slashCommandsArr = [];
  if (!cmdFolders.length) {
    console.log("[!] Found 0 Slash Commands!".blue);
  } else {
    for (const cmdFolder of cmdFolders) {
      const commandFiles = fs.readdirSync(`./SlashCommands/${cmdFolder}`).filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const command = require(`../SlashCommands/${cmdFolder}/${file}`);
        if (command.name && command.execute) {
          command.directory = cmdFolder.split("_")[cmdFolder.split("_").length - 1];
          client.slashCommands.set(command.name, command);
          slashCommandsArr.push(command);
          console.log(`[✔] Loaded ${command.name.cyan} ${"Slash Command".green}`.green);
        } else {
          continue;
        }
      }
    }
  }
  console.log("-".repeat(38).yellow);
  client.on("ready", async () => {
    registerSlash(client, slashCommandsArr);
  });
};