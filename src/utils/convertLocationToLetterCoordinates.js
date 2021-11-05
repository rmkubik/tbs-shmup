const convertLocationToLetterCoordinates = (location) => {
  const { row, col } = location;

  const numericComponent = row + 1;
  const alphabetComponent = String.fromCharCode(col + 97).toUpperCase();

  return alphabetComponent + numericComponent;
};

export default convertLocationToLetterCoordinates;
