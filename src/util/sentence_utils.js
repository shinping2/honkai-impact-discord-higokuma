
function findSentenceAfterTheFirstWord_(text) {
  const indexOfSpace = text.indexOf(' ');
  if (indexOfSpace > 0) {
    return text.substring(indexOfSpace+1);
  }

  return null;
}

module.exports = {
  findSentenceAfterTheFirstWord: findSentenceAfterTheFirstWord_,
};
