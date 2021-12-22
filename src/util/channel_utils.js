
/* [Discord.Channel] */ function findChannels_(/* {String: Discord.Channel} */ channelMap, /* String */ name) {
  let channels = [];
  for (const [id, channel] of channelMap.entries()) {
    if (channel.name.endsWith(name)) {
      channels.push(channel);
    }
  }
  return channels;
}

/* Discord.Channel */ function findFirstChannel_(/* {String: Discord.Channel} */ channelMap, /* String */ name) {
  for (const [id, channel] of channelMap.entries()) {
    if (channel.name.endsWith(name)) {
      return channel;
    }
  }
  return null;
}

/* Discord.Role */ function findRole_(/* {String roleID: Discord.Role} */ roleMap, /* String */ roleName) {
  for (const [roleID, role] of roleMap) {
    if (role.name.endsWith(roleName)) {
      return role;
    }
  }
  return null;
}

module.exports = {
  findChannels: findChannels_,
  findFirstChannel: findFirstChannel_,
  findRole: findRole_,
};
