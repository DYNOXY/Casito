const { Client, Message } = require("discord.js");
require("colors");
const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_VOICE_STATES"],
});
console.clear();
console.log("-".repeat(38).yellow);
console.log(`[●] Starting Casito...`.magenta);
console.log("-".repeat(38).yellow);

const isConnected = (async () =>
  !!(await require("dns")
    .promises.resolve("google.com")
    .catch(() => {})))();
if (!isConnected) {
  console.log(`[!] No Internet!`.blue);
}

process.env = require("./config.json");

require("./Utility/DB_Connect")(client);

const { readdirSync } = require("fs");

require(`./handlers/clientHandler`)(client);

readdirSync("./handlers/").forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

client.login(process.env.TOKEN).catch((err) => {
  const errType = err.toString();

  if (errType.includes("reason: getaddrinfo ENOTFOUND discord.com")) {
    return console.log(`[×] Cant login, No Internet!`.red);
  }

  console.log(`[×] ${errType}`.red);
});
