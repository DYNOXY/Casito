const { Client, Message, MessageEmbedFooter, MessageOptions } = require("discord.js");
const { Player } = require("erela.js");

module.exports = class MainMsg {
  /**
   *
   * @param {Message} message
   * @param {Client} client
   * @returns
   */
  constructor(message, client) {
    this.message = message;
    this.client = client;
  }

  /**
   *
   * @param {String} content
   * @returns
   */
  setContent = async (content) => {
    try {
      if (this.message.deleted) return;
      if (content == null) {
        return await this.message?.edit({ content: this.client.defaultMessage }).catch(this.client.handleError);
      }
      return await this.message?.edit({ content }).catch(this.client.handleError);
    } catch (err) {
      this.client.handleError(err);
    }
  };

  /**
   *
   * @param {String} image
   * @returns
   */
  setImage = async (image) => {
    try {
      if (this.message.deleted) return;
      if (image == null) {
        return await this.message?.edit({ embeds: [{ ...this.message.embeds[0], image: { url: this.client.defaultEmbed.image.url } }] }).catch(this.client.handleError);
      }
      return await this.message?.edit({ embeds: [{ ...this.message.embeds[0], image: { url: image } }] }).catch(this.client.handleError);
    } catch (err) {
      this.client.handleError(err);
    }
  };

  /**
   *
   * @param {String} title
   * @returns
   */
  setTitle = async (title) => {
    try {
      if (this.message.deleted) return;
      if (title == null) {
        return await this.message?.edit({ embeds: [{ ...this.message.embeds[0], title: this.client.defaultEmbed.title }] }).catch(this.client.handleError);
      }
      return await this.message?.edit({ embeds: [{ ...this.message.embeds[0], title }] }).catch(this.client.handleError);
    } catch (err) {
      this.client.handleError(err);
    }
  };

  /**
   *
   * @param {String} desc
   * @returns
   */
  setDescription = async (desc) => {
    try {
      if (this.message.deleted) return;
      return await this.message?.edit({ embeds: [{ ...this.message.embeds[0], description: desc }] }).catch(this.client.handleError);
    } catch (err) {
      this.client.handleError(err);
    }
  };

  /**
   *
   * @param {MessageEmbedFooter} footer
   * @returns
   */
  setFooter = async (footer) => {
    try {
      if (this.message.deleted) return;
      if (footer == null) {
        return await this.message?.edit({ embeds: [{ ...this.message.embeds[0], footer: this.client.defaultEmbed.footer }] }).catch(this.client.handleError);
      }
      return await this.message?.edit({ embeds: [{ ...this.message.embeds[0], footer }] }).catch(this.client.handleError);
    } catch (err) {
      this.client.handleError(err);
    }
  };

  /**
   *
   * @param {MessageOptions} args
   * @param {String} msg
   * @returns
   */
  setEmbed = async (args, msg) => {
    try {
      if (this.message.deleted) return;
      return await this.message?.edit({ embeds: [{ ...this.message.embeds[0], ...args }], content: msg || this.client.defaultMessage }).catch(this.client.handleError);
    } catch (err) {
      this.client.handleError(err);
    }
  };

  myStatus = {
    getFilterStatus: (player) => {
      const arr = {
        eightD: "8D",
        bassboost: "Bassboost",
        nightcore: "Nightcore",
        pop: "pop",
        treblebass: "Treblebass",
        soft: "Soft",
        karaoke: "Karaoke",
        vibrato: "Vibrato",
        tremolo: "Tremolo",
        vaporwave: "Vaporwave",
      };

      for (const value in arr) {
        if (player[value]) {
          return arr[value];
        }
      }

      return "Disabled";
    },
    getLoop: (player) => {
      if (player.trackRepeat) {
        return "Track";
      } else if (player.queueRepeat) {
        return "Queue";
      } else {
        return "Disabled";
      }
    },
  };

  /**
   *
   * @param {Player} player
   * @returns {String}
   */
  getFooterStatus = (player) => {
    try {
      if (!player) {
        throw new Error("Player is Required!");
      }

      if (this.message.deleted) return;

      return player && player.playing ? `Volume: ${player.volume} | filter: ${this.myStatus.getFilterStatus(player)} | loop: ${this.myStatus.getLoop(player)}` : this.client.defaultEmbed.footer;
    } catch (err) {
      this.client.handleError(err);
    }
  };

  /**
   *
   * @param {Player} player
   * @returns {String}
   */
  setFooterStatus = async (player) => {
    try {
      if (!player && !player.playing) {
        throw new Error("Player is Required!");
      }

      if (this.message.deleted) return;

      return await this.message?.edit({ embeds: [{ ...this.message.embeds[0], footer: { text: this.getFooterStatus(player) } }] }).catch(this.client.handleError);
    } catch (err) {
      this.client.handleError(err);
    }
  };

  /**
   *
   * @returns {void}
   */
  reset = async () => {
    try {
      if (this.message.deleted) return;
      await this.message?.edit({ embeds: [this.client.defaultEmbed], components: this.client.defaultComponents, content: this.client.defaultMessage }).catch(this.client.handleError);
    } catch (err) {
      this.client.handleError(err);
    }
  };
};

// new Discord.MessageEmbed({ description: "Hoi!",footer: "Hoi" }).setTimestamp();
