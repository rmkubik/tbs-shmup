import { defaultDeck } from "../cards";
import sectors from "../sectors";
import shipIcon from "../../../assets/ship1.png";

export default {
  name: "ISPS Postal Zone 130-01",
  unlock: {
    cost: 0,
  },
  ship: {
    name: "Speed Racer",
    icon: shipIcon,
  },
  mission: {
    winCondition: 3,
    description:
      "Transport a derelict ISPS standard issue star ship out of a dangerous asteroid field.",
  },
  dare: {},
  theme: "default",
  sectors,
  dimensions: { width: 10, height: 15 },
  playerIndex: 145,
  deck: defaultDeck,
  action: "default", // This should import a function directly, maybe?
  power: 2,
  drawSize: 3,
};
