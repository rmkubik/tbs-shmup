// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// Comment about: Durstenfeld shuffle
const shuffle = (array) => {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }

  return copy;
};

export default shuffle;
