import { defaultDeck, directionSwappedDeck } from "../cards";
import sectors from "../sectors";
import shipIcon from "../../../assets/ship1.png";
import powerIcon from "../../../assets/power.png";

export default {
  name: "ISPS Postal Zone 130-01",
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
