const Discord = require('discord.js');
const GoogleImageSearch = require('../../third_parties/image_search/image_search.js')
const _ = require('lodash');

const ImageSearchUrlController = require('./image_search_url_controller.js');

const ACTIONS = [
  'awoo',
  'blush',
  'confused',
  'cuddle',
  'dance',
  'howl',
  'hug',
  'idk',
  'insult',
  // 'kiss',
  // 'lick',
  'neko',
  'nyan',
  'pat',
  'poke',
  'punch',
  'pout',
  'sleepy',
  'shrug',
  'teehee',
  'triggered',
  'smile',
  'slap',
  'stare',
  'wasted',
];

const ACTION_SET = new Set(ACTIONS);

const KEYWORDS = [
  'Angel Beats',
  'Ansatsu Kyoushitsu',
  'Akagami Shirayuki-hime',
  'Boku dake ga Inai Machi',
  'Charlotte',
  'Chuunibyou',
  'Clannad',
  'Evergarden',
  'Fruits Basket',
  'Gabriel',
  'Grimgar',
  'Hataraku Maou-sama',
  'Hyouka',
  'K-On',
  'Kaguya-sama',
  'Kaichou',
  'Kamisama',
  'Kokoro',
  'Kyoukai',
  'Lucky',
  'Madoka',
  'Masamune-kun',
  'Nisemonogatari',
  'Nisekoi',
  'Noragami',
  'Ookami',
  'Ouran',
  'ReLIFE',
  'Saenai',
  'Steins Gate',
  'Suzumiya',
  'Tate no Yuusha no Nariagari',
  'Toaru Kagaku',
  'Toradora',
  'Umaru-chan',
  'Yahari',
  'Yakuindomo',
  'Yuri',
  '盾勇者',
];

const EXTRA_KEYWORD = ' kawaii gif';

/** Find images via DuckDuckGo. */
class FindImageController {
  constructor() {
    this.cached_thumbnails_ = new Set();
  }

  findRandomImage(action = undefined) {
    return new Promise( (resolve, reject) => {
      if (!action && this.cached_thumbnails_.size > 100) {
        resolve(Array.from(this.cached_thumbnails_));
      } else {
        const index = Math.floor(KEYWORDS.length * Math.random());
        const query = KEYWORDS[index] + EXTRA_KEYWORD;

        GoogleImageSearch.searchImage(query)
        .then(thumbnails => {
          if (!action) {
            for (let thumbnail of thumbnails) {
              this.cached_thumbnails_.add(thumbnail);
            }
            thumbnails = Array.from(this.cached_thumbnails_);
          }
          resolve(thumbnails);
        })
        .catch( err => reject(err) );
      }
    });
  }

  sendImageSearchUrls(msg, action = undefined) {
    if (!action) {
      const words = msg.content.split(' ');
      if (words.length > 0) {
        action = FindImageController.findSecondWord_(msg.content);
      }
    }
    if (action) {
      if (ACTION_SET.has(action)) {
        this.sendRichEmbedMessage_(msg, action);
      } else {
        FindImageController.replyHelpMessage_(msg, action);
      }
    } else {
      this.sendRichEmbedMessage_(msg, undefined, true);
    }
  }

  sendRichEmbedMessage_(msg, action = undefined, removeUsedImage = false) {
    this.findRandomImage(action)
    .then(thumbnails => {
      if (thumbnails.length == 0) {
        msg.author.send('Cannot find any image.');
        return;
      }
      const index = Math.floor(thumbnails.length * Math.random());
      const thumbnail = thumbnails[index];
      const reverseSearchUrl =
          ImageSearchUrlController.createGoogleImageSearchUrl(thumbnail);
      let title = action ? `${action} ` : '';
      const description = `${title}[[find img]](${reverseSearchUrl})`;
      const embedMessage = new Discord.MessageEmbed()
          .setDescription(description)
          .setImage(thumbnail);
      msg.reply(embedMessage);
      if (removeUsedImage) {
        this.cached_thumbnails_.delete(thumbnail);
      }
    })
    .catch(console.log);
  }

  static findSecondWord_(text) {
    const words = text.split(' ');
    if (words.length > 1) {
      return words[1];
    }
    return null
  }

  static isValidAction(action) {
    return ACTION_SET.has(action);
  }

  static replyHelpMessage_(msg, action) {
    const validActions = ACTIONS.join(', ');
    const message = `${action} is not one of the valid actions:
    ${validActions}`;
    msg.author.send(message);
  }
}

module.exports = FindImageController;
