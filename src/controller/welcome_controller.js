const Discord = require('discord.js');
const _ = require('lodash');

const ChannelUtils = require('../util/channel_utils.js');
const ServerConstants = require('../util/server_constants.js');
const UserUtils = require('../util/user_utils.js');

const ImageSearchUrlController = require('./image_search_url_controller.js');

const ARMADA_ID = '6195';

const ROLE_HYPERION = 'Hyperion';
const ROLE_NORTH_AMERICA = 'North America';

const FAREWELL_MESSAGES = [
  '${member} has too much anime to watch and is sad to leave the Hyperion :sob:.',
  '${member} is addicted to a new game and left the Hyperion to live in the virtual world.',
  '${member} has graduated from St. Freya and left St. Freya to fight in the outside world.',
  'Otto has deceived ${member} to go astray and claimed that ${member} simply saw the truth. Otto has used this deception to countless other victims. ${member} has left St. Freya and joined the Schicksal.',
  '${member} has eloped and is pursuing the second love without Principal Theresa’s approval.',
  '${member} is on a self-discovery journey. St. Freya is proud to raise such a strong-will person and is sad to see ${member} graduating from St. Freya :sob:.',
  'Otto created a clone of ${member}, but we have tracked them down and eliminated them 😎.',
];

const WELCOME_MESSAGES = [
  'Aloha Captain ${member}! Here is a lei for you 🌺',
  'Greeting Captain ${member}. Thanks for coming 😀',
  'Warmest welcome, Captain ${member} 😍',
  'Hello Captain ${member}. Glad to see you here 🎉',
  'Welcome to our hyperion, Captain ${member}. Have a free cookie on us 🍪',
  'Thanks for visiting our hyperion, Captain ${member} 😊',
  'Oh Captain ${member}, welcome to our humble hyperion 😎',
];

class WelcomeController {
  static addDefaultRoleToMember__(member) {
    const roles = member.guild.roles;

    const roleHyperion = roles.find(r => r.name === ROLE_HYPERION);
    const roleNorthAmerica = roles.find(r => r.name.endsWith(ROLE_NORTH_AMERICA));
    member.addRole(roleHyperion).catch(console.error);
    member.addRole(roleNorthAmerica).catch(console.error);
  }

  static announceFarewell(member, thumbnail) {
    const guild = member.guild;
    const cafeteriaChannel = ChannelUtils.findFirstChannel(guild.channels.cache,
        ServerConstants.CHANNEL_CAFETERIA);
    if (!cafeteriaChannel) {
      return;
    }

    const userName = UserUtils.getNameFromGuildMember(member);
    const reverseSearchUrl =
        ImageSearchUrlController.createGoogleImageSearchUrl(thumbnail);
    const randomIndex = Math.floor(Math.random() * FAREWELL_MESSAGES.length);
    let description = _.template(FAREWELL_MESSAGES[randomIndex])({member: `${member.user} (${userName})`});
    if (reverseSearchUrl) {
      description = description + '\n' + `[[find img]](${reverseSearchUrl})`;
    }
    const embedMessage = new Discord.MessageEmbed()
        .setDescription(description)
        .setThumbnail(thumbnail);
    cafeteriaChannel.send(embedMessage);
  }

  static announceOnWelcomeChannel(member, thumbnail) {
    const guild = member.guild;
    const cafeteriaChannel = ChannelUtils.findFirstChannel(guild.channels.cache,
        ServerConstants.CHANNEL_CAFETERIA);
    const welcomeChannel = ChannelUtils.findFirstChannel(guild.channels.cache,
        ServerConstants.CHANNEL_WELCOME);
    if (!cafeteriaChannel) {
      cafeteriaChannel = ServerConstants.CHANNEL_CAFETERIA;
    }
    if (!welcomeChannel || !welcomeChannel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
      return;
    }

    const userName = UserUtils.getNameFromGuildMember(member);
    const reverseSearchUrl =
        ImageSearchUrlController.createGoogleImageSearchUrl(thumbnail);
    const randomIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length);
    const title = _.template(WELCOME_MESSAGES[randomIndex])({member: `${member.user} (${userName})`});
    let description = `${title}
  Please join us in ${cafeteriaChannel}. Our Armada ID in game is: ${ARMADA_ID}`
    if (reverseSearchUrl) {
      description = description + '\n' + `[[find img]](${reverseSearchUrl})`;
    }
    const embedMessage = new Discord.MessageEmbed()
        .setDescription(description)
        .setThumbnail(thumbnail);
    welcomeChannel.send(embedMessage);
  }
}

module.exports = WelcomeController;
