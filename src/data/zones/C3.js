import { defaultDeck, directionSwappedDeck } from "../cards";
import sectors from "../sectors";
import shipIcon from "../../../assets/ship1.png";
import ship2 from "../../../assets/ship2.png";

export default {
  name: "Spider Space Gateway",
  unlock: {
    cost: 5,
  },
  icon: {
    src: ship2,
    color: "bombColor",
  },
  mission: {
    winCondition: 3,
    description: "Welcome to the World Wide Web.",
    ship: {
      name: "Speed Racer",
      icon: shipIcon,
      color: "primaryColor",
    },
    theme: "default",
    sectors,
    dimensions: { width: 10, height: 15 },
    playerIndex: 22, // 145,
    deck: defaultDeck,
    action: "default", // This should import a function directly, maybe?
    power: 2,
    maxPower: 2,
    drawSize: 3,
  },
  dare: {
    deck: directionSwappedDeck,
    winCondition: "highScore",
  },
};
