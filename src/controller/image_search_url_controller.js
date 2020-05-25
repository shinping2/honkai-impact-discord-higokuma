const Discord = require('discord.js');
const _ = require('lodash');

const UserIdImageUrlsModel = require('../model/user_id_image_urls_model.js');
const Constants = require('../util/constants.js');

const SCHEMA_HTTP = 'http';
const SCHEMA_HTTPS = 'https';
const FIND_HTTP_IMAGE = 'find http img';
const FIND_IMAGE = 'find img';

class ImageSearchUrlController {
  constructor(client) {
    this.client = client;
    this.cachedUserIdImageUrlsModels_ = [];
  }

  cacheMessage(msg) {
    const imageUrls = this.findImageUrls_(msg);
    if (_.isEmpty(imageUrls)) {
      return;
    }

    const userIdImageUrlsModel = new UserIdImageUrlsModel(msg.author.id, imageUrls);
    this.cachedUserIdImageUrlsModels_ =
        this.cachedUserIdImageUrlsModels_.slice(0, Constants.CACHE_IMAGE_URL_CAP);
    this.cachedUserIdImageUrlsModels_.unshift(userIdImageUrlsModel);
  }

  sendImageSearchUrls(msg) {
    const mentionedUser = this.findFirstMentionedUser_(msg.mentions.users);
    const index = this.findFirstNumber_(msg.content);

    const cachedUserIdImageUrlsModel = this.findCachedImageUrlsModel_(mentionedUser, index);
    const unfilteredImageUrls = _.get(cachedUserIdImageUrlsModel, 'imageUrls');
    const imageUrls = Array.from(new Set(unfilteredImageUrls));
    if (_.isEmpty(imageUrls)) {
      const mentionedUserName = _.get(mentionedUser, 'username');
      const message = mentionedUserName
          ? `${mentionedUser.username} hasn't post any recent image url.`
          : `Cannot find any recent image url`;
      msg.author.send(message);
    } else {
      const httpsUrlText =
          ImageSearchUrlController.createGoogleImageSearchUrlText(imageUrls, FIND_IMAGE)
              .join(', ');
      const httpUrlText =
          ImageSearchUrlController.createGoogleImageSearchUrlText(imageUrls, FIND_HTTP_IMAGE, false)
              .join(', ');
      const description = `${httpsUrlText}\nIf the above link doesn't work, try ${httpUrlText}`;
      const embedMessage = new Discord.MessageEmbed().setDescription(description);
      msg.reply(embedMessage); 
    }
  }

  static createGoogleImageSearchUrl(imageUrl, allowHttps = true) {
    if (!imageUrl) {
      return undefined;
    }
    if (!allowHttps && imageUrl.startsWith(SCHEMA_HTTPS)) {
      imageUrl = imageUrl.replace(SCHEMA_HTTPS, SCHEMA_HTTP);
    }
    return Constants.GOOGLE_IMAGES_SEARCH_BASE_URL + encodeURIComponent(imageUrl);
  }

  static createGoogleImageSearchUrlText(imageUrls, title, allowHttps) {
    return _.map(imageUrls, imageUrl => {
      const searchUrl = this.createGoogleImageSearchUrl(imageUrl, allowHttps);
      return `[[${title}]](${searchUrl})`;
    });
  }

  findAttachedImageUrl_(attachments) {
    const urls = [];
    for (const [id, messageAttachment] of attachments) {
      const url = _.get(messageAttachment, 'url');
      if (!_.isEmpty(url)) {
        urls.push(url);
      }
    }
    return urls;
  }

  findCachedImageUrlsModel_(user, index = NaN) {
    let lastUserIdImageUrlsModel = undefined;
    let i = 0;
    const userId = _.get(user, 'id');
    for (let userIdImageUrlsModel of this.cachedUserIdImageUrlsModels_) {
      if (userId && userId !== userIdImageUrlsModel.userId) {
        continue;
      }

      lastUserIdImageUrlsModel = userIdImageUrlsModel;
      i ++;
      if (_.isNaN(index) || index === i) {
        return lastUserIdImageUrlsModel;
      }
    }
    return lastUserIdImageUrlsModel;
  }

  findEmbedImageUrl_(embed) {
    const image = _.get(embed, 'thumbnail.url');
    if (image) {
      return image;
    }
    return _.get(embed, 'image.url');
  }

  findFirstMentionedUser_(userMap) {
    for (let [userId, user] of userMap) {
      if (userId !== this.client.user.id) {
        return user;
      }
    }
    return undefined;
  }

  findFirstNumber_(text) {
    const words = text.split(' ');
    for (let word of words) {
      const number = parseInt(word);
      if (!isNaN(number)) {
        return number
      }
    }
    return NaN
  }

  findImageUrls_(msg) {
    const attachedImageUrls = this.findAttachedImageUrl_(msg.attachments);
    const embedImageUrls = _.map(msg.embeds, this.findEmbedImageUrl_);
    const contentImageUrls = this.findImageUrlsFromText_(msg.content);
    return _.uniq(_.compact([
      ...attachedImageUrls,
      ...embedImageUrls,
      ...contentImageUrls,
    ]));
  }

  sendUsage_(msg) {
    msg.author.send(`Usage: ${Constants.COMMAND_PREFIX}img @user 1`);
  }

  findImageUrlsFromText_(text) {
    if (_.isEmpty(text)) {
      return [];
    }
    const imageUrls = text.match(/http\S+.(jpg|jpeg|png|gif)/g);
    if (_.isEmpty(imageUrls)) {
      return [];
    }
    return imageUrls;
  }
}

module.exports = ImageSearchUrlController;
