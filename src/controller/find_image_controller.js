const Discord = require('discord.js');
const GoogleImageSearch = require('../../third_parties/image_search/image_search.js')
const _ = require('lodash');

const ImageSearchUrlController = require('./image_search_url_controller.js');

const ACTION_TO_FORMAT_MAP = {
  'awoo': ['${author} went awoo', '${author} went awoo at ${user}'],
  'blush': ['${author} is blushing', '${user} makes ${author} blushing'],
  'confused': ['${author} is confused', '${user} makes ${author} confused'],
  'cuddle': ['${author} wants to cuddle', '${author} wants to cuddle ${user}'],
  'dance': ['${author} wants to dance (^○^)', '${author} wants to dance with ${user} (^○^)'],
  'howl': ['${author} wants to howl', '${author} wants to howl with ${user}'],
  'hug': ['${author} wants to hug', '${author} wants to hug ${user}'],
  'idk': ['${author} shows ¯\\_(ツ)_/¯', '${author} shows ¯\\_(ツ)_/¯ to ${user}'],
  'insult': ['${author} is insulting at air (>皿<)', '${author} wants to insult ${user} (>皿<)'],
  // 'kiss',
  // 'lick',
  'neko': ['${author} went neko 🐱', '${author} wants to shows a neko 🐱 to ${user}'],
  'nyan': ['${author} went ＾○ ⋏ ○＾', '${author} greets ${user} with a ＾○ ⋏ ○＾'],
  'pat': ['${author} wants to pat someone', '${author} wants to pat ${user}'],
  'poke': ['${author} wants to poke at air', '${author} wants to poke ${user}'],
  'punch': ['${author} is doing air boxing', '${author} wants to punch ${user}'],
  'pout': ['${author} is pouting', '${user} makes ${author} pout'],
  'sleepy': ['${author} is sleepy (´〜｀*) zzz', '${author} wants to dance with ${user}'],
  'shrug': ['${author} shows ¯\\_(ツ)_/¯', '${author} shows ¯\\_(ツ)_/¯ to ${user}'],
  'teehee': ['${author} shows ๑╹U╹)', '${author} shows ๑╹U╹) to ${user}'],
  'triggered': ['${author} is triggered (>皿<)', '${user} triggered ${author} (>皿<)'],
  'smile': ['${author} is smiling (^○^)', '${user} made ${author} smiles (^○^)'],
  'slap': ['${author} wants to slap at air', '${author} wants to slap ${user}'],
  'stare': ['${author} is staring at air', '${author} is staring at ${user}'],
  'wasted': ['${author} wants to waste something', '${author} wants to make ${user} wasted'],
};

const ACTIONS = Object.keys(ACTION_TO_FORMAT_MAP);

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
      const title = action ? FindImageController.getActionTitle_(msg, action) : '';
      const description = `${title}\n[[find img]](${reverseSearchUrl})`;
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

  static getActionTitle_(/* Message */ msg, /* String */ action) {
    if (action) {
      const [authorTemplate, authorAndTargetTemplate] = ACTION_TO_FORMAT_MAP[action];
      const mentionedIDAndUserTupleArray = msg.mentions.users;
      if (_.size(mentionedIDAndUserTupleArray) > 0) {
        const userIdList = Object.keys(mentionedIDAndUserTupleArray);
        let mentionedUserStringArray = [];
        for (let mentionedIDAndUserTuple of mentionedIDAndUserTupleArray) {
          const mentionedUser = mentionedIDAndUserTuple[1];
          mentionedUserStringArray.push(`${mentionedUser}`);
        }
        const tokenMap = {
          author: `${msg.author}`,
          user: mentionedUserStringArray,
        };
        return _.template(authorAndTargetTemplate)(tokenMap);
      } else {
        return _.template(authorTemplate)({author: `${msg.author}`});
      }
    }
    return '';
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
