import { defaultDeck, directionSwappedDeck } from "../cards";
import sectors from "../sectors";
import shipIcon from "../../../assets/ship1.png";

export default {
  name: "Bomber",
  unlock: {
    cost: 5,
  },
  mission: {
    winCondition: 3,
    description:
      "Transport a derelict ISPS standard issue star ship out of a dangerous asteroid field.",
    ship: {
      name: "Bomber",
      icon: shipIcon,
      color: "primaryColor",
    },
    theme: "default",
    sectors,
    dimensions: { width: 10, height: 15 },
    playerIndex: 145, // 22
    deck: defaultDeck,
    action: "default", // This should import a function directly, maybe?
    power: 2,
    maxPower: 2,
    drawSize: 3,
  },
  dare: {
    winCondition: "highScore",
  },
};
