
/* [int] */ function getAsciiCodesFromText_(/* String */ text) {
	let asciiCodes = [];
	for (let character of text) {
	  asciiCodes.push(character.charCodeAt(0));
	}
	return asciiCodes;
}

/* Set[int] */ function getAsciiCodeSetFromAsciiWords_(/* [String] */ asciiWords) {
	let asciiCodes = new Set();
	for (let asciiWord of asciiWords) {
		let asciiCodeText = getAsciiCodeTextFromAsciiWord_(asciiWord);
		asciiCodes.add(Number(asciiCodeText));
	}
	return asciiCodes;
}

function getAsciiCodeTextFromAsciiWord_(/* String */ asciiWord) {
	if (Number.isInteger(asciiWord)) {
		return asciiWord;
	}

	// Remove the prefix '&#' and the suffix ';'.
	return asciiWord.substring(2, asciiWord.length - 1);
}

function getTextByReplacingAsciiWords_(/* String */ paragraph, /* [String] */ asciiWords) {
  if (!paragraph || !asciiWords || asciiWords.length <= 0) {
    return paragraph;
  }

  let convertedParagraph = paragraph;
  for (let asciiWord of asciiWords) {
    let asciiText = getAsciiCodeTextFromAsciiWord_(asciiWord);
    convertedParagraph = convertedParagraph.replace(asciiWord, String.fromCharCode(asciiText));
  }
  return convertedParagraph;
}

function hasJapaneseAscii_(/* [String] */ asciiWords, /* int */ requiredCount = 1) {
	if (!asciiWords) {
	  return false;
	}

	let counter = 0;
	for (let asciiWord of asciiWords) {
	  let asciiText = getAsciiCodeTextFromAsciiWord_(asciiWord);
	  if (isJapaneseAscii_(Number(asciiText))) {
	  	counter ++;
	  	if (counter >= requiredCount) {
		    return true;
		  }
	  }
	}
	return false;
}

function isJapaneseAscii_(/* int */ code) {
	return isHiraganaAscii_(code) || isHiraganaAscii_(code) || isKatakanaAscii_(code);
}

function isHiraganaAscii_(/* int */ code) {
	return code >= 12352 && code <= 12447;
}

function isKatakanaAscii_(/* int */ code) {
	return code >= 12448 && code <= 12543;
}

function isKanjiAscii_(/* int */ code) {
	return code >= 19968 && code <= 19893;
}

module.exports = {
	getAsciiCodesFromText: getAsciiCodesFromText_,
	getAsciiCodeSetFromAsciiWords: getAsciiCodeSetFromAsciiWords_,
	getAsciiCodeTextFromAsciiWord: getAsciiCodeTextFromAsciiWord_,
  getTextByReplacingAsciiWords: getTextByReplacingAsciiWords_,
  hasJapaneseAscii: hasJapaneseAscii_,
};
