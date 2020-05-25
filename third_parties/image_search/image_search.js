const _ = require('lodash');
const fetch = require("node-fetch");
const DomParser = require('dom-parser');

const HTTP = 'http';

function getSrcAttribute(node) {
  return node.getAttribute('src');
};

function startsWithHttp(str) {
  return str.startsWith(HTTP);
};

class ImageSearch {
  /**
   * Function for image search
   *
   * @param  {string} query   Image search filed query
   * @return {Promise}    Returns a promise, with an array of found image URL's
   */
  static searchImage(query) {
    query = encodeURIComponent(query)

    return new Promise( (resolve, reject) => {
      // Fetches Items from Google Image Search URL
      fetch("https://www.google.com.ua/search?source=lnms&sa=X&gbv=1&tbm=isch&q="+query)
      .then( res => res.text() )
      .then(/* String */ html => {
        const parser = new DomParser();
        const dom = parser.parseFromString(html);

        const allImageNodes = dom.getElementsByTagName('img');
        const imageNodes = allImageNodes.slice(4);

        const allUrls = _.map(imageNodes, getSrcAttribute);
        const urls = _.filter(_.compact(allUrls), startsWithHttp);
        resolve(urls);
      })
      .catch( err => reject(err) )
    })
  }
}

module.exports = ImageSearch;