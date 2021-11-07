const concatMany = (arrays) => {
  return [].concat.apply([], arrays);
};

export default concatMany;
