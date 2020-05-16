const Discord = require('discord.js');
const DomParser = require('dom-parser');
const _ = require('lodash');
const fetch = require("node-fetch");

const AsciiUtils = require('../util/ascii_utils.js');
const CollectionsUtils = require('../util/collections_utils.js');
const Constants = require('../util/constants.js');
const SentenceUtils = require('../util/sentence_utils.js');

const ASCII_REGEX = /&#\d+;/g;
const DIV_TAG = 'div';

const MAX_CHARACTER_COUNT = 300;
const JAPANESE_WORD_COUNT_THRESHOLD = 3;

/** Translate one language to another language. */
class LanguageTranslator {

  static fetchJapaneseTranslationFromUrl_(/* String */ searchTranslationUrl, /* Set[String]? */ queryAsciiCodeSet) {
    return new Promise( (resolve, reject) => {
      fetch(searchTranslationUrl)
      .then( response => response.text() )
      .then( html => {
        const parser = new DomParser();
        const dom = parser.parseFromString(html);

        let longestParagraphAndAsciiWordsTuple = [null, null];
        let longestParagraphLength = 0;
        let largestMatchCount = 0;
        const divElements = dom.getElementsByTagName(DIV_TAG);
        for (let divElement of divElements) {
          let paragraph = divElement.textContent;
          let paragraphLength = paragraph.length;
          // Avoid the very long paragraph with the page source.
          if (paragraphLength > MAX_CHARACTER_COUNT) {
            continue;
          }

          // Find the longest paragraph within boundary.
          if (longestParagraphLength < paragraphLength) {
            let asciiWords = paragraph.match(ASCII_REGEX);
            if (AsciiUtils.hasJapaneseAscii(asciiWords)) {
              const matchCount = CollectionsUtils.getMatchCountForSet(
                  queryAsciiCodeSet,
                  AsciiUtils.getAsciiCodeSetFromAsciiWords(asciiWords));
              if (largestMatchCount <= matchCount) {
                largestMatchCount = matchCount;
                longestParagraphLength = paragraphLength;
                longestParagraphAndAsciiWordsTuple = [paragraph, asciiWords];
              }
            }
          } 
        }

        let [longestParagraph, longestAsciiWords] = longestParagraphAndAsciiWordsTuple
        let japaneseText = AsciiUtils.getTextByReplacingAsciiWords(longestParagraph, longestAsciiWords);
        resolve(japaneseText);
      })
      .catch( err => reject(err) );
    })
  }

  static fetchEnglishTranslationFromUrl_(/* String */ searchTranslationUrl) {
    return new Promise( (resolve, reject) => {
      fetch(searchTranslationUrl)
      .then( response => response.text() )
      .then( html => {
        const parser = new DomParser();
        const dom = parser.parseFromString(html);

        let longestParagraphAndAsciiWordsTuple = [null, null];
        let longestParagraphLength = 0;
        const divElements = dom.getElementsByTagName(DIV_TAG);
        for (let divElement of divElements) {
          let paragraph = divElement.textContent;
          let paragraphLength = paragraph.length;
          // Avoid the very long paragraph with the page source.
          if (paragraphLength > MAX_CHARACTER_COUNT) {
            continue;
          }

          // Find the longest paragraph within boundary.
          if (longestParagraphLength < paragraphLength) {
            let asciiWords = paragraph.match(ASCII_REGEX);
            if (AsciiUtils.hasJapaneseAscii(asciiWords)) {            
              longestParagraphLength = paragraphLength;
              longestParagraphAndAsciiWordsTuple = [paragraph, asciiWords];
            }
          } 
        }

        let [longestParagraph, longestAsciiWords] = longestParagraphAndAsciiWordsTuple
        let japaneseText = AsciiUtils.getTextByReplacingAsciiWords(longestParagraph, longestAsciiWords);
        resolve(japaneseText);
      })
      .catch( err => reject(err) );
    })
  }

  static replyWithJapaneseTranslation(/* Discord.Message */ msg, /* String */ query = undefined) {
    if (!query) {
      const words = msg.content.split(' ');
      if (words.length > 0) {
        query = SentenceUtils.findSentenceAfterTheFirstWord(msg.content);
      }
    }

    if (!query) {
      msg.author.send(`Usage: ${Constants.COMMAND_PREFIX}jp your_english_phrase`);
      return;
    }

    let queryAsciiCodeSet = null;
    let googleTranslateUrl = null;
    const encodedQuery = encodeURIComponent(_.trim(query));
    const longSearchTranslationUrl = `https://www.google.com/search?sxsrf=ALeKk01x2faN7jlC8Fzfd_8sG6J8K6oaTQ%3A1589661961868&q=how+to+say+%22${encodedQuery}%22+in+japanese`;
    const searchTranslationUrl = `https://www.google.com/search?q=how+to+say+%22${encodedQuery}%22+in+japanese`;

    // Checks if the query has some Japanese characters
    let asciiCodes = AsciiUtils.getAsciiCodesFromText(query);
    if (AsciiUtils.hasJapaneseAscii(asciiCodes, JAPANESE_WORD_COUNT_THRESHOLD)) {
      googleTranslateUrl = `https://translate.google.com/?hl=en&tab=TT#view=home&op=translate&sl=ja&tl=en&text=${encodedQuery}`;
      queryAsciiCodeSet = new Set(asciiCodes);

    } else {
      googleTranslateUrl = `https://translate.google.com/?hl=en&tab=TT#view=home&op=translate&sl=en&tl=ja&text=${encodedQuery}`;
    }

    LanguageTranslator.fetchJapaneseTranslationFromUrl_(searchTranslationUrl, queryAsciiCodeSet)
    .then(japaneseParagraph => {
      LanguageTranslator.replyWithJapaneseParagraphAndGoogleTranslateUrls(
          msg,
          japaneseParagraph,
          longSearchTranslationUrl,
          searchTranslationUrl,
          googleTranslateUrl);
    })
    .catch(err => console.log(err) );
  }

  static replyWithJapaneseParagraphAndGoogleTranslateUrls(
    /* Discord.Message */ msg,
    /* String */ japaneseParagraph,
    /* String */ longSearchTranslationUrl,
    /* String */ searchTranslationUrl,
    /* String */ googleTranslateUrl) {
    let description = null;
    if (japaneseParagraph && japaneseParagraph.length > 0) {
      description = japaneseParagraph;
    } else {
      description = `Couldn't parse this link.`;
    }

    const messageText = `${description}\n[[search link]](${longSearchTranslationUrl})\t[[Google translate]](${googleTranslateUrl})`;
    const embedMessage = new Discord.MessageEmbed().setDescription(messageText);
    msg.reply(embedMessage);
  }
}

module.exports = LanguageTranslator;
