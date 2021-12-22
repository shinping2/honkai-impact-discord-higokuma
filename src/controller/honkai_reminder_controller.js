const Discord = require('discord.js');
const _ = require('lodash');

const GoogleImageSearch = require('../../third_parties/image_search/image_search.js');
const AnimeNameUtils = require('../util/anime_name_utils.js');
const DateUtils = require('../util/date_utils.js');
const ChannelUtils = require('../util/channel_utils.js');
const ServerConstants = require('../util/server_constants.js');

const ImageSearchUrlController = require('./image_search_url_controller.js');

const ROLE_NAME_NA_CAPTAIN = 'na-captain';
const DELAY_THRESHOLD_MILLIS_SECOND = 30 * 60 * 1000;  // 30 minutes.
const HOURS_IN_ONE_DAY = 24;  // One day has 24 hours.

class HonkaiReminderController {
  constructor(/* Discord.Client */ client, /* ConfigurationController */ configurationController) {
    this.client_ = client;
    this.configurationController_ = configurationController;
    this.pendingEventTypeSet_ = new Set();
    this.timerIDs_ = new Set();
  }

  clearAndUpdateReminderSchedule() {
    for (const timerID of this.timerIDs_) {
      this.client_.clearTimeout(timerID);
    }
    this.timerIDs_.clear();
    this.pendingEventTypeSet_.clear();

    this.scheduleReminderCallback();
  }

  scheduleReminderCallback() {
    const nameToEventObject = this.configurationController_
        .configurationMap[ServerConstants.CONFIGURATION_KEY_REMINDER_EVENTS];
    const nameToEventEntries = Object.entries(nameToEventObject);
    for (const [eventName, eventMap] of nameToEventEntries) {
      this.scheduleEventReminderCallback_(eventName);
    }
  }

  scheduleEventReminderCallback_(/* String */ eventType) {
    if (this.pendingEventTypeSet_.has(eventType)) {
      return;
    }

    this.pendingEventTypeSet_.add(eventType);
    const timerID = this.client_.setTimeout(() => {
      this.client_.clearTimeout(timerID);
      this.timerIDs_.delete(timerID);

      this.pendingEventTypeSet_.delete(eventType);
      this.scheduleEventReminderCallback_(eventType);

      const query = this.getThumbnailSearchQuery_(eventType) + ' ' + AnimeNameUtils.getExtraSearchQuery();
      GoogleImageSearch.searchImage(query)
      .then(thumbnails => {
        const index = Math.floor(thumbnails.length * Math.random());
        const thumbnail = thumbnails[index];
        this.postMessageForEventType_(eventType, thumbnail);
      })
      .catch( err => {
        this.postMessageForEventType_(eventType);
      });
    }, this.getDelayInMillisSecond_(eventType));

    this.timerIDs_.add(timerID)
  }

  /* String */ getThumbnailSearchQuery_(/* String */ eventType) {
    const nameToEventObject = this.configurationController_
        .configurationMap[ServerConstants.CONFIGURATION_KEY_REMINDER_EVENTS];
    const eventMap = nameToEventObject[eventType];
    const imageQueries = eventMap[ServerConstants.CONFIGURATION_KEY_IMAGE_QUERIES];
    if (imageQueries) {
      const randomIndex = Math.floor(Math.random() * imageQueries.length);
      return imageQueries[randomIndex];
    }

    return AnimeNameUtils.getRandomAnimeName()
  }

  postMessageForEventType_(/* String */ eventType, /* String? */ thumbnail) {
    const channels = ChannelUtils.findChannels(this.client_.channels.cache,
        ServerConstants.CHANNEL_CAFETERIA);
    for (const channel of channels) {
      this.postMessageInChannel_(channel, eventType, thumbnail);
    }
  }

  postMessageInChannel_(/* Discord.Channel */ channel, /* String */ eventType, /* String? */ thumbnail) {
    const messageText = this.getMessageForEvent_(channel.guild, eventType);
    let descriptionText =
        `${messageText}\n[[edit link]](${ServerConstants.EDITABLE_NOTICE_2_DOC_URL})`;
    if (thumbnail) {
      const reverseSearchUrl = ImageSearchUrlController.createGoogleImageSearchUrl(thumbnail);
      descriptionText = `${descriptionText}\t[[find img]](${reverseSearchUrl})`;
    }

    const messageModel = new Discord.MessageEmbed().setDescription(descriptionText);
    if (thumbnail) {
      messageModel.setThumbnail(thumbnail);
    }
    channel.send(messageModel);
  }

  /* int */ getDelayInMillisSecond_(/* String */ eventType) {
    const nameToEventObject = this.configurationController_
        .configurationMap[ServerConstants.CONFIGURATION_KEY_REMINDER_EVENTS];
    const eventMap = nameToEventObject[eventType];
    const daysInWeek = eventMap[ServerConstants.CONFIGURATION_KEY_DAYS_IN_WEEK];
    const hourOfDay = eventMap[ServerConstants.CONFIGURATION_KEY_HOUR_OF_DAY];
    const reminderTimeAheadInHours = eventMap[ServerConstants.CONFIGURATION_KEY_REMINDER_TIME_AHEAD];
    let hours = hourOfDay - reminderTimeAheadInHours;
    let dayAdjustment = 0;
    if (hours < 0) {
      hours += HOURS_IN_ONE_DAY;
      dayAdjustment = 1;
    }

    const currentTimeInESTInMillis = DateUtils.currentDateInESTInMillis().getTime();
    const timeThreshold = currentTimeInESTInMillis + DELAY_THRESHOLD_MILLIS_SECOND;
    let smallestTimeInESTInMillis = Number.MAX_SAFE_INTEGER;
    for (const dayInWeek of daysInWeek) {
      let day = DateUtils.DAY_TO_NUMBER_MAP[dayInWeek];
      if (!Number.isInteger(day)) {
        console.warn('Cannot recognized day of the week:', dayInWeek);
        continue;
      }

      const date = DateUtils.createNextDateInESTWithDayAndHour(day - dayAdjustment, hours);
      const eventTime = date.getTime();
      if (eventTime < timeThreshold) {
        continue;  // Avoid scheduling an event too soon.
      }

      smallestTimeInESTInMillis = Math.min(smallestTimeInESTInMillis, eventTime);
    }

    return smallestTimeInESTInMillis - currentTimeInESTInMillis;
  }

  /* String */ getMessageForEvent_(/* Discord.Guild */ guild, /* String */ eventType) {
    const naCaptainRole = ChannelUtils.findRole(guild.roles.cache, ROLE_NAME_NA_CAPTAIN);

    const nameToEventObject = this.configurationController_
        .configurationMap[ServerConstants.CONFIGURATION_KEY_REMINDER_EVENTS];
    const eventMap = nameToEventObject[eventType];
    const messages = eventMap[ServerConstants.CONFIGURATION_KEY_MESSAGES];
    const templateOptions = {
      role: `${naCaptainRole}`,
      hours: eventMap[ServerConstants.CONFIGURATION_KEY_REMINDER_TIME_AHEAD],
    };
    const randomIndex = Math.floor(Math.random() * messages.length);
    return _.template(messages[randomIndex])(templateOptions);
  }
}

module.exports = HonkaiReminderController;
