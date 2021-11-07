import { defaultDeck } from "../cards";
import sectors from "../sectors";
import shipIcon from "../../../assets/ship1.png";

export default {
  name: "The Down Zone",
  unlock: {
    cost: 7,
  },
  ship: {
    name: "Speed Racer",
    icon: shipIcon,
  },
  theme: "default",
  sectors,
  dimensions: { width: 10, height: 15 },
  playerIndex: 145,
  deck: defaultDeck,
  action: "default", // This should import a function directly, maybe?
  power: 2,
  drawSize: 3,
};
