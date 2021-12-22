const Discord = require('discord.js');
const _ = require('lodash');

const ChannelUtils = require('../util/channel_utils.js');
const ServerConstants = require('../util/server_constants.js');
const UserUtils = require('../util/user_utils.js');

const ImageSearchUrlController = require('./image_search_url_controller.js');

class UserUpdateController {
  static displayGuildMemeberUpdate(/* Discord.GuildMember */ oldMember,
      /* Discord.GuildMember */ newMember) {
    const newName = UserUtils.getNameFromGuildMember(newMember);
    const oldName = UserUtils.getNameFromGuildMember(oldMember);
    if (oldName == newName) {
      return;
    }

    const messageModel = this.createMessageModelForNameUpdate_(oldName, newName,
        newMember.user.displayAvatarURL());
    const channel = ChannelUtils.findFirstChannel(newMember.guild.channels.cache,
        ServerConstants.CHANNEL_CAFETERIA);
    channel.send(messageModel);
  }

  /* Discord.MessageEmbed | String */ static createMessageModelForNameUpdate_(/* String */ oldName,
      /* String */ newName, /* String? */ thumbnail) {
    const descriptionText = `*${oldName}* has transformed to *${newName}*`;
    if (thumbnail) {
      const reverseSearchUrl =
          ImageSearchUrlController.createGoogleImageSearchUrl(thumbnail);
      const description = `${descriptionText}\t[[find img]](${reverseSearchUrl})`;
      return new Discord.MessageEmbed()
          .setDescription(description)
          .setThumbnail(thumbnail);
    }

    return descriptionText;
  }
}

module.exports = UserUpdateController;
