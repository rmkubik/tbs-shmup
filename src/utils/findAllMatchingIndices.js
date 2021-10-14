const findAllMatchingIndices = (array, matcher) => {
  const matchingIndices = [];

  for (let index = 0; index < array.length; index += 1) {
    if (matcher(array[index])) {
      matchingIndices.push(index);
    }
  }

  return matchingIndices;
};

export default findAllMatchingIndices;
