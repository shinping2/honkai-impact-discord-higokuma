const Discord = require('discord.js');
const JSON5 = require('json5');
const _ = require('lodash');

const ConfigJsonConstants = require('../util/config_json_constants.js');
const ServerConstants = require('../util/server_constants.js');

const DisplayNoticeController = require('./display_notice_controller.js');

class ConfigurationController {

  constructor() {
    this.configurationMap = JSON.parse(ConfigJsonConstants.CONFIGURATION_JSON);
  }

  /* Promise */ fetchAndUpdateConfig() {
    return new Promise( (resolve, reject) => {
      DisplayNoticeController.fetchDocText(ServerConstants.STATIC_NOTICE_2_DOC_URL)
      .then(/* String */ paragraph => {
        if (!paragraph || paragraph.length == 0) {
          reject(null);
        }

        const unescapedParagraph = _.unescape(paragraph);
        const lines = unescapedParagraph.split('\n');
        const trimedLines = _.map(lines, _.trim);
        const jsonString = trimedLines.join('');
        try {
          const newCOnfigurationMap = JSON5.parse(jsonString);
          if (newCOnfigurationMap) {
            this.configurationMap = newCOnfigurationMap;
            resolve(newCOnfigurationMap);
          } else {
            reject(null);
          }
          this.configurationMap
        } catch(err) {
          reject(err);
        }
      })
      .catch(reject);
    });
  }

  updateConfig(/* Discord.Message */ msg) {
    return new Promise( (resolve, reject) => {
      this.fetchAndUpdateConfig()
      .then(/* Object */ configurationMap => {
        ConfigurationController.replyWithConfigLink(msg);
        resolve();
      })
      .catch(reject);
    });
  }

  static replyWithConfigLink(/* Discord.Message */ msg) {
    const description = `[[config link]](${ServerConstants.EDITABLE_NOTICE_2_DOC_URL})`;
    const messageModel = new Discord.MessageEmbed().setDescription(description);
    msg.author.send(messageModel);
  }

  static displayErrorMessage(/* Discord.Message */ msg) {
    const description =
        `Error fetching the configuration from [[link]](${ServerConstants.EDITABLE_NOTICE_2_DOC_URL})`;
    const messageModel = new Discord.MessageEmbed().setDescription(description);
    msg.author.send(messageModel);
  }
}

module.exports = ConfigurationController;
