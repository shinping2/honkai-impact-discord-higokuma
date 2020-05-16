
function getMatchCountForSet_(/* Set[String] */ set, /* [String] */ array) {
  if (!set || !array) {
    return 0;
  }

  let count = 0;
  for (let arrayElement of array) {
    if (set.has(arrayElement)) {
      count ++;
    }
  }

  return count;
}

module.exports = {
  getMatchCountForSet: getMatchCountForSet_,
};
