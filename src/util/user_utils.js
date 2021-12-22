const _ = require('lodash');

/* String */ function getNameFromGuildMember_(/* Discord.GuildMember */ guildMember) {
  if (_.size(guildMember.nickname) > 0) {
    return guildMember.nickname;
  }

  return guildMember.user.username;
}

module.exports = {
  getNameFromGuildMember: getNameFromGuildMember_,
};
