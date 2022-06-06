const fs = require("fs");

module.exports = (client) => {
  const loadDir = (dirs) => {
    const eventsFiles = fs.readdirSync(`./events/${dirs}`).filter((file) => file.endsWith(".js"));

    eventsFiles.forEach((file) => {
      const event = require(`../events/${dirs}/${file}`);
      const eventName = file.split(".")[0].trim();
      const fun = client.on(eventName, event.bind(null, client));
    });
  };

  ["client", "guild"].forEach((e) => loadDir(e));
};
