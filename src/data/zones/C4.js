import { defaultDeck, directionSwappedDeck } from "../cards";
import sectors from "../sectors";
import shipIcon from "../../../assets/ship1.png";
import planetIcon from "../../../assets/asteroid5.png";

export default {
  name: "The Recyclotron",
  unlock: {
    cost: 3,
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
