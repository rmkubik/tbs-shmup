import { defaultDeck, directionSwappedDeck } from "../cards";
import { repeatSectors } from "../sectors";
import shipIcon from "../../../assets/ship1.png";
import powerIcon from "../../../assets/power.png";

const sectors = [
  {
    conditions: ["noAsteroids"],
    deck: [
      {
        name: "Up",
        cost: 1,
        range: 4,
        directions: ["up"],
        selectionStyle: "precise",
      },
      {
        name: "UpRight",
        cost: 1,
        range: 2,
        directions: ["upRight"],
        selectionStyle: "precise",
      },
    ],
  },
  { conditions: ["lightAsteroids", "checkpoint"] },
];

export default {
  name: "Tutorial",
  unlock: {
    cost: 0,
  },
  mission: {
    winCondition: 3,
    description:
      "Transport a derelict ISPS standard issue star ship out of a dangerous asteroid field.",
    ship: {
      name: "Speed Racer",
      icon: shipIcon,
      color: "primaryColor",
    },
    theme: "default",
    sectors,
    dimensions: { width: 10, height: 15 },
    playerIndex: 145, // 22
    deck: defaultDeck,
    action: "none", // This should import a function directly, maybe?
    power: 2,
    maxPower: 2,
    drawSize: 3,
  },
  dare: {
    deck: directionSwappedDeck,
    winCondition: "highScore",
  },
};
