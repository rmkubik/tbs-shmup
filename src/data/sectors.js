const concat = (arrays) => {
  return [].concat.apply([], arrays);
};

const repeat = (array, count) => {
  const arrays = new Array(count).fill("").map(() => array);

  return concat(arrays);
};

let sectors = [
  { conditions: ["mediumAsteroids", "checkpoint"] },
  { conditions: ["mediumAsteroids"] },
  { conditions: ["mediumAsteroids"] },
  { conditions: ["mediumAsteroids"] },
  { conditions: ["heavyAsteroids"] },
  ...repeat(
    [
      { conditions: ["mediumAsteroids"] },
      { conditions: ["mediumAsteroids"] },
      { conditions: ["mediumAsteroids"] },
      { conditions: ["mediumAsteroids"] },
      { conditions: ["heavyAsteroids"] },
    ],
    3
  ),
];

console.log(sectors);

export default sectors;
