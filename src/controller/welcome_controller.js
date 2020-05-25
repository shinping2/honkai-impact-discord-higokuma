const Discord = require('discord.js');
const _ = require('lodash');

const ImageSearchUrlController = require('./image_search_url_controller.js');

const ARMADA_ID = '6195';

const CHANNEL_CAFETERIA = 'valkyrie-cafeteria';
const CHANNEL_RULE = 'rules-and-about';
const CHANNEL_SELECT_ROLES = 'select-roles';
const CHANNEL_WELCOME = 'welcome';

const ROLE_HYPERION = 'Hyperion';
const ROLE_NORTH_AMERICA = 'North America';

const RANDOM_WELCOME_TITLES = [
  'Aloha Captain ${member}! Here is a lei for you 🌺',
  'Greeting Captain ${member}. Thanks for coming 😀',
  'Warmest welcome, Captain ${member} 😍',
  'Hello Captain ${member}. Glad to see you here 🎉',
  'Welcome to our hyperion, Captain ${member}. Have a free cookie on us 🍪',
  'Thanks for visiting our hyperion, Captain ${member} 😊',
  'Oh Captain ${member}, welcome to our humble hyperion 😎',
];

class WelcomeController {
  static addDefaultRoleToMember(member) {
    const roles = member.guild.roles;

    const roleHyperion = roles.find(r => r.name === ROLE_HYPERION);
    const roleNorthAmerica = roles.find(r => r.name.endsWith(ROLE_NORTH_AMERICA));
    member.addRole(roleHyperion).catch(console.error);
    member.addRole(roleNorthAmerica).catch(console.error);
  }

  static announceOnWelcomeChannel(member, thumbnail) {
    const guild = member.guild;
    let cafeteriaChannel = CHANNEL_CAFETERIA;
    let welcomeChannel = CHANNEL_WELCOME;
    for (const [id, channel] of guild.channels.cache.entries()) {
      if (channel.name.endsWith(CHANNEL_CAFETERIA)) {
        cafeteriaChannel = channel;
      } else if (channel.name.endsWith(CHANNEL_WELCOME)) {
        if (channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
          welcomeChannel = channel;
        }
      }
    }

    if (!welcomeChannel) {
      return;
    }

    const reverseSearchUrl =
        ImageSearchUrlController.createGoogleImageSearchUrl(thumbnail);
    const randomIndex = Math.floor(Math.random() * RANDOM_WELCOME_TITLES.length);
    const title = _.template(RANDOM_WELCOME_TITLES[randomIndex])({member: `${member.user}`});
    let description = `${title}
  Please join us in ${cafeteriaChannel}. Our Armada ID in game is: ${ARMADA_ID}`
    if (reverseSearchUrl) {
      description = description + '\n' + `[[find img]](${reverseSearchUrl})`;
    }
    const embedMessage = new Discord.MessageEmbed()
        .setDescription(description)
        .setThumbnail(thumbnail)
    welcomeChannel.send(embedMessage);
  }
}

module.exports = WelcomeController;
