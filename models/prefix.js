const { Schema, model } = require("mongoose");

const PrefixSchema = new Schema({
  Prefix: {
    type: String,
  },
  GuildID: String,
});

const MessageModel = (module.exports = model("prefixes", PrefixSchema));