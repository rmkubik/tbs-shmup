const initialDeck = [
  { name: "Left", cost: 1, range: 3, directions: ["left"] },
  { name: "Up", cost: 1, range: 2, directions: ["up"] },
  { name: "Right", cost: 1, range: 1, directions: ["right"] },
  { name: "UpRight", cost: 1, range: 2, directions: ["upRight"] },
  { name: "Down", cost: 1, range: 2, directions: ["down"] },
  { name: "Up", cost: 1, range: 4, directions: ["up"] },
  { name: "Shoot", cost: 1, range: 1, directions: ["up"], effect: "shoot" },
];

const stallCard = {
  name: "Stall",
  cost: 1,
  range: 0,
  directions: [],
};

export { initialDeck, stallCard };
