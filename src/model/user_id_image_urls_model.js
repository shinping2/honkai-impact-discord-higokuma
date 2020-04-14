const _ = require('lodash');

class UserIdImageUrlsModel {
  constructor(userId, imageUrls) {
    this.userId = userId;
    this.imageUrls = imageUrls;
  }
}

module.exports = UserIdImageUrlsModel;
