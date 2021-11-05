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

// // Crab Space Corridor - 5x15 play grid - Crab Ship - move left and right
// // The Crab can use the CRAB ROLL :TM: ability to roll through many asteroids on the index screen wrap.
// // Some ship doesn't have screen wrap, but is always moving forward X number of spaces and you control its movement left/right. Crab makes sense. The crab space corridor is pulling you in, you can't stop!

// // THE QUANTUM CRAB is unlocked after you pass the first Crab Space Corridor. Quantum Crab Tunneling though.
// // "Quantum Crab Tunneling" has index-based screen wrapping.

// // Retrieving derelict ships for the ISPS is dope, but it doesn't seem to fictionally align with going as many sectors deep in a given zone as you can. That fiction seems like it should have an explicit end point.

// // X Ship, The Weaver
// // Deck: UpLeft2, UpRight2, DownLeft1, DownRight1, Shoot (or Stasis, a projectile that sets an asteroid's speed to 0)
// // Ability: Recycle for now, I guess?

// // Mine Layer
// // New Goal: Survive as many waves of spawns as you can, no goal to reach the end.
// // Ability: Lay a static mine object that asteroids will run into and explode on.

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

const initialDeck = weaverDeck;

// const initialDeck = [
//   { name: "Left", cost: 1, range: 3, directions: ["left"] },
//   { name: "Up", cost: 1, range: 2, directions: ["up"] },
//   { name: "Right", cost: 1, range: 1, directions: ["right"] },
//   { name: "UpRight", cost: 1, range: 2, directions: ["upRight"] },
//   { name: "Down", cost: 1, range: 2, directions: ["down"] },
//   { name: "Up", cost: 1, range: 4, directions: ["up"] },
//   { name: "Shoot", cost: 1, range: 1, directions: ["up"], effect: "shoot" },
// ];

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

export { initialDeck, directionSwappedDeck, stallCard };
