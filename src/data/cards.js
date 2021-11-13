// `
//   . . . . .
//   . . 3 4 .
//   . . 2 . .
//   . . 1 . .
//   . . * . .
// `;

// `
//   . . . . . . .
//   . . 6 5 . . .
//   . . . 4 . . .
//   * 1 2 3 . . .
//   . . . . . . .
// `;

// // [
// //   { row: 0, col: 1 },
// //   { row: 0, col: 2 }
// // ]

// // [
// //   'left', 'left', 'up',
// // ]

// `
//   . . . . .
//   . . 1 . .
//   . . . . .
//   * . . . .
//   . . . . .
// `;

const weaverDeck = [
  { name: "UpLeft", cost: 1, range: 3, directions: ["upLeft"] },
  { name: "UpRight", cost: 1, range: 3, directions: ["upRight"] },
  { name: "DownLeft", cost: 1, range: 2, directions: ["downLeft"] },
  { name: "DownRight", cost: 1, range: 2, directions: ["downRight"] },
  { name: "Shoot", cost: 1, range: 1, directions: ["up"], effect: "shoot" },
];

const defaultDeck = [
  {
    name: "Left",
    cost: 1,
    range: 3,
    directions: ["left"],
  },
  {
    name: "Up",
    cost: 1,
    range: 2,
    directions: ["up"],
    selectionStyle: "precise",
  },
  {
    name: "Right",
    cost: 1,
    range: 1,
    directions: ["right"],
    selectionStyle: "precise",
  },
  {
    name: "UpRight",
    cost: 1,
    range: 2,
    directions: ["upRight"],
    selectionStyle: "precise",
  },
  {
    name: "Down",
    cost: 1,
    range: 2,
    directions: ["down"],
    selectionStyle: "precise",
  },
  {
    name: "Up",
    cost: 1,
    range: 4,
    directions: ["up"],
    selectionStyle: "precise",
  },
  { name: "Shoot", cost: 1, range: 1, directions: ["up"], effect: "shoot" },
];

const directionSwappedDeck = [
  { name: "Right", cost: 1, range: 3, directions: ["right"] },
  { name: "Up", cost: 1, range: 2, directions: ["up"] },
  { name: "Left", cost: 1, range: 1, directions: ["left"] },
  { name: "UpLeft", cost: 1, range: 2, directions: ["upLeft"] },
  { name: "Down", cost: 1, range: 2, directions: ["down"] },
  { name: "Up", cost: 1, range: 4, directions: ["up"] },
  {
    name: "Shoot",
    cost: 1,
    range: 1,
    directions: ["up"],
    effect: "shoot",
  },
];

const stallCard = {
  name: "Stall",
  cost: 1,
  range: 0,
  directions: [],
};

const initialDeck = defaultDeck;

export {
  initialDeck,
  defaultDeck,
  weaverDeck,
  directionSwappedDeck,
  stallCard,
};
