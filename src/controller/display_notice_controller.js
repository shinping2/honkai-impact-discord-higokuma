const Discord = require('discord.js');
const DomParser = require('dom-parser');
const fetch = require("node-fetch");

const ServerConstants = require('../util/server_constants.js');

const PARAGRAPH_TAG = 'p';

/** Translate one language to another language. */
class DisplayNoticeController {
  static fetchDocText(/* String */ docUrl) {
    const options = {
      headers: {
        'user-agent': `Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36`,
      },
    };

    return new Promise( (resolve, reject) => {
      fetch(docUrl, options)
      .then( response => response.text() )
      .then( html => {
        const parser = new DomParser();
        const dom = parser.parseFromString(html);

        const nodeElements = dom.getElementsByTagName(PARAGRAPH_TAG);
        let sentences = [];
        for (let nodeElement of nodeElements) {
          let sentence = nodeElement.textContent;
          sentences.push(sentence);
        }

        resolve(sentences.join('\n'));
      })
      .catch( err => reject(err) );
    })
  }

  static displayNotice(/* Discord.Message */ msg) {
    this.displayTextWithUrl_(msg, ServerConstants.STATIC_NOTICE_DOC_URL, ServerConstants.EDITABLE_NOTICE_DOC_URL);
  }

  static displayNotice2(/* Discord.Message */ msg) {
    this.displayTextWithUrl_(msg, ServerConstants.STATIC_NOTICE_2_DOC_URL, ServerConstants.EDITABLE_NOTICE_2_DOC_URL);
  }

  static displayTextWithUrl_(/* Discord.Message */ msg, /* String */ staticDocUrl, /* String */ editDocUrl) {
    this.fetchDocText(staticDocUrl)
    .then(/* String */ paragraph => {
      if (paragraph && paragraph.length > 0) {
        const description = `${paragraph}\n[[link]](${editDocUrl})`;
        const embedMessage = new Discord.MessageEmbed().setDescription(description);
        msg.reply(embedMessage);
      }
    })
    .catch(err => console.log(err) );
  }
}

module.exports = DisplayNoticeController;
