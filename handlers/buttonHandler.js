const { Client } = require("discord.js");
const fs = require("fs");

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  const intrFiles = fs.readdirSync("./btnInteractions");

  console.log("-".repeat(38).yellow);
  console.log(`[●] Loading Buttons Interactions...\n`.magenta);
  for (const intrect of intrFiles) {
    const name = intrect.split(".js")[0];
    const intrFile = require(`../btnInteractions/${intrect}`);

    client.btnInteractions.set(name, intrFile);
    console.log(`[✔] loaded ${name.cyan}${" Button Interaction!".green}`.green);
  }
  console.log("-".repeat(38).yellow);
};
