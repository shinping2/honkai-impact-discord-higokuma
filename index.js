/**
 * reference:
 * https://www.freecodecamp.org/news/how-to-create-a-discord-bot-under-15-minutes-fb2fd0083844/
 */

const Discord = require('discord.js');
const _ = require('lodash');

const Constants = require('./src/util/constants.js');
const FindImageController = require('./src/controller/find_image_controller.js');
const ImageSearchUrlController = require('./src/controller/image_search_url_controller.js');
const LanguageTranslator = require('./src/controller/language_translator.js');
const WelcomeController = require('./src/controller/welcome_controller.js');

const client = new Discord.Client();
const findImageController = new FindImageController();
const imageUrlManager = new ImageSearchUrlController(client);

const PopulateFakeModels = require('./tests/controller/populate_fake_models.js');
PopulateFakeModels.populateFakeModels(imageUrlManager);

const INVALID_INDEX = -1;
const ACTION_CUDDLE = 'cuddle';
const DISCORD_BOT_TOKEN = Put your discord bot token here.

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('guildMemberAdd', member => {
  findImageController.findRandomImage(ACTION_CUDDLE)
  .then(thumbnails => {
    const index = Math.floor(thumbnails.length * Math.random());
    const thumbnail = thumbnails[index];
    WelcomeController.announceOnWelcomeChannel(member, thumbnail)
  });
});

client.on('message', msg => {
  // ignore message from this bot
  if (msg.author.bot && msg.author.id === client.user.tag) {
    return;
  }

  if (msg.content.startsWith(Constants.COMMAND_PREFIX)) {
    // check if the command is ?img
    if (msg.content.startsWith(`${Constants.COMMAND_PREFIX}img`)) {
      imageUrlManager.sendImageSearchUrls(msg);
    } else if (msg.content.startsWith(`${Constants.COMMAND_PREFIX}jp`)) {
      LanguageTranslator.replyWithJapaneseTranslation(msg);
    } else if (msg.content.startsWith(`${Constants.COMMAND_PREFIX}search`)) {
      findImageController.sendImageSearchUrls(msg);
    } else {
      const words = msg.content.split(' ');
      if (words.length > 0) {
        const word = words[0];
        const action = word.substr(1);
        if (FindImageController.isValidAction(action)) {
          findImageController.sendImageSearchUrls(msg, action);
        }
      }
    }
  } else {
    imageUrlManager.cacheMessage(msg);
  }
})

client.login(DISCORD_BOT_TOKEN);
