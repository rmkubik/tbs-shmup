const concat = (arrays) => {
  return [].concat.apply([], arrays);
};

const repeat = (array, count) => {
  const arrays = new Array(count).fill("").map(() => array);

  return concat(arrays);
};

let sectors = [
  // Zone 1
  { conditions: ["lightAsteroids"] },
  // Zone 2
  { conditions: ["mediumAsteroids", "checkpoint"] },
  { conditions: ["mediumAsteroids"] },
  { conditions: ["patternedAsteroids-kreldfarr"] },
  // Zone 3
  { conditions: ["lightAsteroids", "nebula", "checkpoint"] },
  { conditions: ["mediumAsteroids", "nebula"] },
  { conditions: ["patternedAsteroids-hwaranklex", "nebula"] },
  // Zone 4
  { conditions: ["mediumAsteroids", "stalling", "checkpoint"] },
  { conditions: ["mediumAsteroids", "stalling"] },
  { conditions: ["patternedAsteroids-wildRoids", "stalling"] },
  // Zone 5
  { conditions: ["lightAsteroids", "left-offline", "nebula", "checkpoint"] },
  { conditions: ["mediumAsteroids", "left-offline", "nebula"] },
  { conditions: ["mediumAsteroids", "nebula"] },
  // Zone 6
  { conditions: ["lightAsteroids", "malfunctioning", "checkpoint"] },
  { conditions: ["mediumAsteroids"] },
  { conditions: ["mediumAsteroids", "malfunctioning"] },
  // Zone 7
  { conditions: ["heavyAsteroids", "checkpoint"] },
  { conditions: ["heavyAsteroids", "nebula"] },
  { conditions: ["heavyAsteroids"] },
  // Zone 8
  { conditions: ["mediumAsteroids", "left-offline", "stalling", "checkpoint"] },
  { conditions: ["mediumAsteroids", "malfunctioning", "stalling"] },
  { conditions: ["mediumAsteroids", "left-offline", "stalling", "nebula"] },
  // Zone 9
  { conditions: ["heavyAsteroids", "stalling", "checkpoint"] },
  {
    conditions: ["heavyAsteroids", "malfunctioning", "stalling", "nebula"],
  },
];

// sectors = [
//   { conditions: ["mediumAsteroids", "checkpoint"] },
//   { conditions: ["mediumAsteroids"] },
//   { conditions: ["mediumAsteroids"] },
//   { conditions: ["mediumAsteroids"] },
//   { conditions: ["heavyAsteroids"] },
//   ...repeat(
//     [
//       { conditions: ["mediumAsteroids"] },
//       { conditions: ["mediumAsteroids"] },
//       { conditions: ["mediumAsteroids"] },
//       { conditions: ["mediumAsteroids"] },
//       { conditions: ["heavyAsteroids"] },
//     ],
//     3
//   ),
// ];

// console.log(sectors);

export default sectors;
