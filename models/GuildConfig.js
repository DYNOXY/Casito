const { Schema, model } = require("mongoose");

const GuildConfig = new Schema({
  GuildID: {
    type: String,
    required: true,
    unique: true,
  },
  TextChannel: {
    type: String,
    required: true,
  },
  Message: {
    type: String,
    required: false,
  },
  TwentyFourSeven: {
    type: Boolean,
    default: false,
  },
  VoiceChannel: {
    type: String,
    required: false,
  },
});

module.exports = model("guildConfigs", GuildConfig);
