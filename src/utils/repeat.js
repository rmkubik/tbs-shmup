const repeat = (item, count) => {
  return new Array(count).fill("").map(() => item);
};

export default repeat;
