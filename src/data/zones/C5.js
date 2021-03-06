import { defaultDeck, directionSwappedDeck } from "../cards";
import { repeatSectors } from "../sectors";
import shipIcon from "../../../assets/ship1.png";
import powerIcon from "../../../assets/power.png";
import { createAsteroid } from "../entities";
import randInt from "../../utils/randInt";
import planetIcon from "../../../assets/asteroid5.png";

const sectors = [
  {
    conditions: ["singleAsteroid"],
    deck: [
      {
        name: "FTL",
        cost: 1,
        range: 20,
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
      {
        name: "Left",
        cost: 1,
        range: 3,
        directions: ["left"],
        selectionStyle: "precise",
      },
    ],
    getStartingEntities: ({ colCount }) => {
      let asteroids = [];

      for (let row = 3; row < 10; row += 3) {
        const colIndex = randInt(0, colCount - 1);
        const asteroid = createAsteroid({
          speed: 3,
          index: row * colCount + colIndex,
        });

        asteroids.push(asteroid);
      }

      return asteroids;
    },
  },
  {
    conditions: ["lighterAsteroids"],
    deck: [
      {
        name: "Left",
        cost: 1,
        range: 3,
        directions: ["left"],
        selectionStyle: "precise",
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
    ],
  },
  {
    conditions: ["lightAsteroids"],
  },
];

export default {
  name: "Tutorial",
  unlock: {
    cost: 0,
  },
  icon: {
    src: planetIcon,
    color: "primaryColor",
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
