const convertIndexToLocation = (index, width) => {
  const row = Math.floor(index / width);
  const col = index % width;

  return {
    row,
    col,
  };
};

export default convertIndexToLocation;
