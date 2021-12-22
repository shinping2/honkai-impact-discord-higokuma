/**
 * reference:
 * https://www.freecodecamp.org/news/how-to-create-a-discord-bot-under-15-minutes-fb2fd0083844/
 */

const Discord = require('discord.js');
const _ = require('lodash');

const Constants = require('./src/util/constants.js');
const ConfigurationController = require('./src/controller/configuration_controller.js');
const FindImageController = require('./src/controller/find_image_controller.js');
const ImageSearchUrlController = require('./src/controller/image_search_url_controller.js');
const LanguageTranslator = require('./src/controller/language_translator.js');
const DisplayNoticeController = require('./src/controller/display_notice_controller.js');
const WelcomeController = require('./src/controller/welcome_controller.js');
const HonkaiReminderController = require('./src/controller/honkai_reminder_controller.js');
const UserUpdateController = require('./src/controller/user_update_controller.js');

const configurationController = new ConfigurationController();
const client = new Discord.Client();
const findImageController = new FindImageController();
const imageUrlManager = new ImageSearchUrlController(client);
const honkaiReminderController = new HonkaiReminderController(client, configurationController);

const PopulateFakeModels = require('./tests/controller/populate_fake_models.js');
PopulateFakeModels.populateFakeModels(imageUrlManager);

const INVALID_INDEX = -1;
const ACTION_CUDDLE = 'cuddle';
const DISCORD_BOT_TOKEN = Put your discord bot token here.

client.on(Discord.Constants.Events.CLIENT_READY, () => {
  console.log(`Logged in as ${client.user.tag}!`);
})

client.on(Discord.Constants.Events.GUILD_MEMBER_ADD, member => {
  findImageController.findRandomImage(ACTION_CUDDLE)
  .then(thumbnails => {
    const index = Math.floor(thumbnails.length * Math.random());
    const thumbnail = thumbnails[index];
    WelcomeController.announceOnWelcomeChannel(member, thumbnail)
  })
  .catch(console.error);
});

/*
client.on(Discord.Constants.Events.CLIENT_READY, () => {
  console.log(`Logged in as ${client.user.tag}!`);
  configurationController.fetchAndUpdateConfig()
  .then(configurationMap => {
    honkaiReminderController.scheduleReminderCallback();
  })
  .catch(err => {
    console.error(err);
    honkaiReminderController.scheduleReminderCallback();
  });
})

client.on(Discord.Constants.Events.GUILD_MEMBER_ADD, member => {
  findImageController.findRandomImage(ACTION_CUDDLE)
  .then(thumbnails => {
    const index = Math.floor(thumbnails.length * Math.random());
    const thumbnail = thumbnails[index];
    WelcomeController.announceOnWelcomeChannel(member, thumbnail)
  })
  .catch(console.error);
});

client.on(Discord.Constants.Events.GUILD_MEMBER_REMOVE, member => {
  findImageController.findRandomImage(ACTION_CUDDLE)
  .then(thumbnails => {
    const index = Math.floor(thumbnails.length * Math.random());
    const thumbnail = thumbnails[index];
    WelcomeController.announceFarewell(member, thumbnail)
  })
  .catch(console.error);
});

client.on(Discord.Constants.Events.GUILD_MEMBER_UPDATE,
    (oldMember, newMember) => {
  UserUpdateController.displayGuildMemeberUpdate(oldMember, newMember);
});
*/

client.on(Discord.Constants.Events.MESSAGE_CREATE, msg => {
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
    } else if (msg.content.startsWith(`${Constants.COMMAND_PREFIX}notice2`)) {
      DisplayNoticeController.displayNotice2(msg);
    } else if (msg.content.startsWith(`${Constants.COMMAND_PREFIX}notice`)) {
      DisplayNoticeController.displayNotice(msg);
    } else if (msg.content.startsWith(`${Constants.COMMAND_PREFIX}config show`)) {
      ConfigurationController.replyWithConfigLink(msg);
    } else if (msg.content.startsWith(`${Constants.COMMAND_PREFIX}config update`)) {
      configurationController.updateConfig(msg)
      .then(() => honkaiReminderController.clearAndUpdateReminderSchedule())
      .catch(error => {
        console.error(error);
        ConfigurationController.displayErrorMessage(msg);
      });
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
});

client.login(DISCORD_BOT_TOKEN);
