const { Schema, model } = require("mongoose");

const AutoReconnect = new Schema({
  ChannelID: String,
  TextChannelID: String,
  GuildID: String,
});

module.exports = model("autoReconnect", AutoReconnect);