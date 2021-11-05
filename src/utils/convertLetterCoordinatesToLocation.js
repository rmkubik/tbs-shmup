const convertLetterCoordinatesToLocation = (lettersCoordinates) => {
  const numericComponent = lettersCoordinates
    .toLowerCase()
    .replace(/[a-z]*/g, "");

  const alphabetComponent = lettersCoordinates
    .toLowerCase()
    .replace(/\d*/g, "");

  const row = numericComponent - 1;
  const col = alphabetComponent.charCodeAt(0) - 97;

  return {
    row,
    col,
  };
};

export default convertLetterCoordinatesToLocation;
