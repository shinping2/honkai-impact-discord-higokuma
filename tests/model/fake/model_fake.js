const UserIdImageUrlsModel = require('../../../src/model/user_id_image_urls_model.js');

const userIdImageUrlsModel = new UserIdImageUrlsModel(
	'489616233084223508',
	['https://media.tenor.co/images/efd5e0d6611d9451799f23fa8d0e1214/tenor.png']);

module.exports = {
  USER_ID_IMAGE_URLS_MODELS: [userIdImageUrlsModel],
};
