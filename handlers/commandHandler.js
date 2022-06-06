const fs = require("fs");

module.exports = (client) => {
  const cmdFolders = fs.readdirSync("./commands");
  console.log("-".repeat(38).yellow);
  console.log(`[●] Loading Commands...\n`.magenta);
  for (const cmdFolder of cmdFolders) {
    const commandFiles = fs.readdirSync(`./commands/${cmdFolder}`).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`../commands/${cmdFolder}/${file}`);
      if (command.name && command.execute) {
        client.commands.set(command.name, command);
        console.log(`[✔] Loaded ${command.name.cyan} ${"Command".green}`.green);
      } else {
        console.log(`[×] Failed to load ${command.name.cyan} ${"Command".red}`.red);
      }
    }
  }
  console.log("-".repeat(38).yellow);
};
