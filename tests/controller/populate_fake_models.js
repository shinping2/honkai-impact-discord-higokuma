const ModelFake = require('../model/fake/model_fake.js');

class PopulateFakeModels {
  static populateFakeModels(/* ImageSearchUrlController */ imageSearchUrlController) {
  	imageSearchUrlController.cachedUserIdImageUrlsModels_ =
  		ModelFake.USER_ID_IMAGE_URLS_MODELS;
  }
}

module.exports = PopulateFakeModels;
